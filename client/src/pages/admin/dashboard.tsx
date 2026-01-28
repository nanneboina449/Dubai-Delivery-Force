import { useQuery } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Users, Truck, Building2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  riders: number;
  contractors: number;
  inquiries: number;
  pending: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    { 
      title: "Rider Applications", 
      value: stats?.riders || 0, 
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/riders"
    },
    { 
      title: "Contractor Applications", 
      value: stats?.contractors || 0, 
      icon: Truck,
      color: "bg-green-500",
      href: "/admin/contractors"
    },
    { 
      title: "Business Inquiries", 
      value: stats?.inquiries || 0, 
      icon: Building2,
      color: "bg-purple-500",
      href: "/admin/inquiries"
    },
    { 
      title: "Pending Review", 
      value: stats?.pending || 0, 
      icon: Clock,
      color: "bg-[#F56A07]",
      href: "#"
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the UrbanFleet admin portal</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow" data-testid={`card-stat-${stat.title.toLowerCase().replace(' ', '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a 
              href="/admin/riders" 
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="link-quick-riders"
            >
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" />
                <div>
                  <p className="font-medium">Review Rider Applications</p>
                  <p className="text-sm text-gray-500">Process new rider applications</p>
                </div>
              </div>
            </a>
            <a 
              href="/admin/contractors" 
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="link-quick-contractors"
            >
              <div className="flex items-center gap-3">
                <Truck className="text-green-500" />
                <div>
                  <p className="font-medium">Review Contractor Applications</p>
                  <p className="text-sm text-gray-500">Manage fleet partner registrations</p>
                </div>
              </div>
            </a>
            <a 
              href="/admin/inquiries" 
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="link-quick-inquiries"
            >
              <div className="flex items-center gap-3">
                <Building2 className="text-purple-500" />
                <div>
                  <p className="font-medium">Handle Business Inquiries</p>
                  <p className="text-sm text-gray-500">Respond to business partnership requests</p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm"><strong>Pending</strong> - New application awaiting review</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm"><strong>Reviewing</strong> - Application under evaluation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm"><strong>Approved</strong> - Application accepted</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm"><strong>Rejected</strong> - Application declined</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-sm"><strong>Onboarding</strong> - Processing for onboarding</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>
              <span className="text-sm"><strong>Completed</strong> - Fully processed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
