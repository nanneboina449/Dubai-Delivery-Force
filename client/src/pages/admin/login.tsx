import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function useAdminAuth() {
  const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";
  const adminUser = sessionStorage.getItem("adminUser");
  
  const setAuth = (user: { id: string; username: string }) => {
    sessionStorage.setItem("adminAuth", "true");
    sessionStorage.setItem("adminUser", JSON.stringify(user));
  };
  
  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminUser");
  };
  
  return { isAuthenticated, adminUser: adminUser ? JSON.parse(adminUser) : null, setAuth, logout };
}

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin");
      return;
    }
    
    checkSetup();
  }, [isAuthenticated]);

  const checkSetup = async () => {
    try {
      const response = await fetch("/api/admin/setup-check");
      const data = await response.json();
      setNeedsSetup(data.needsSetup);
    } catch (error) {
      console.error("Setup check failed:", error);
      setNeedsSetup(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/login", { username, password });
      const data = await response.json();
      
      if (data.success) {
        setAuth(data.user);
        setLocation("/admin");
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/users", { username, password });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Admin account created",
          description: "You can now log in with your credentials",
        });
        setNeedsSetup(false);
        setUsername("");
        setPassword("");
      } else {
        toast({
          title: "Setup failed",
          description: data.error || "Failed to create admin account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (needsSetup === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2744]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-[#1a2744] rounded-full flex items-center justify-center">
            {needsSetup ? <UserPlus className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl">
            {needsSetup ? "Setup Admin Account" : "UrbanFleet Admin"}
          </CardTitle>
          <p className="text-gray-500 mt-2">
            {needsSetup 
              ? "Create your first admin account to get started" 
              : "Enter your credentials to access the admin panel"
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={needsSetup ? handleSetup : handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                data-testid="input-admin-username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={needsSetup ? "Create a password (min 6 characters)" : "Enter password"}
                required
                minLength={needsSetup ? 6 : undefined}
                data-testid="input-admin-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#F56A07] hover:bg-[#d55a06]" 
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? "Please wait..." : (needsSetup ? "Create Admin Account" : "Login")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
