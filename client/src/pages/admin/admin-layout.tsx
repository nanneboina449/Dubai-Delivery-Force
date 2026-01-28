import { Link, useLocation, Redirect } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Building2, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "./login";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/riders", label: "Rider Applications", icon: Users },
  { path: "/admin/contractors", label: "Contractor Applications", icon: Truck },
  { path: "/admin/inquiries", label: "Business Inquiries", icon: Building2 },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a2744] text-white rounded-md"
        data-testid="button-toggle-sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1a2744] text-white transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">UrbanFleet Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Management Portal</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path || 
              (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer
                  ${isActive 
                    ? 'bg-[#F56A07] text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                  }
                `}>
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <Link href="/" data-testid="link-back-to-site">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors cursor-pointer">
              <span>Back to Site</span>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors cursor-pointer w-full"
            data-testid="button-admin-logout"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
