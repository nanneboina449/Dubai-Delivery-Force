import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const ADMIN_PASSWORD = "urbanfleet2026";

export function useAdminAuth() {
  const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";
  
  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      return true;
    }
    return false;
  };
  
  const logout = () => {
    sessionStorage.removeItem("adminAuth");
  };
  
  return { isAuthenticated, login, logout };
}

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setLocation("/admin");
    } else {
      toast({
        title: "Invalid password",
        description: "Please enter the correct admin password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-[#1a2744] rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">UrbanFleet Admin</CardTitle>
          <p className="text-gray-500 mt-2">Enter password to access the admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-testid="input-admin-password"
              />
            </div>
            <Button type="submit" className="w-full bg-[#F56A07] hover:bg-[#d55a06]" data-testid="button-admin-login">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
