import { useQuery } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Users, Truck, Building2, Clock, UserCheck, Car, Briefcase, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

interface Stats {
  riders: number;
  contractors: number;
  inquiries: number;
  pending: number;
  activeDrivers: number;
  activeContractors: number;
  fleetVehicles: number;
  businessClients: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
  });

  const applicationCards = [
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

  const fleetCards = [
    { 
      title: "Active Drivers", 
      value: stats?.activeDrivers || 0, 
      icon: UserCheck,
      color: "bg-emerald-500",
      href: "/admin/drivers"
    },
    { 
      title: "Active Contractors", 
      value: stats?.activeContractors || 0, 
      icon: Briefcase,
      color: "bg-orange-500",
      href: "/admin/active-contractors"
    },
    { 
      title: "Fleet Vehicles", 
      value: stats?.fleetVehicles || 0, 
      icon: Car,
      color: "bg-cyan-500",
      href: "/admin/fleet-vehicles"
    },
    { 
      title: "Business Clients", 
      value: stats?.businessClients || 0, 
      icon: Building2,
      color: "bg-indigo-500",
      href: "/admin/business-clients"
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        <>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {applicationCards.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid={`card-stat-${stat.title.toLowerCase().replace(/ /g, '-')}`}>
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
              </Link>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">Fleet Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleetCards.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid={`card-stat-${stat.title.toLowerCase().replace(/ /g, '-')}`}>
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
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/riders">
              <div 
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                data-testid="link-quick-riders"
              >
                <div className="flex items-center gap-3">
                  <Users className="text-blue-500" />
                  <div>
                    <p className="font-medium">Review Rider Applications</p>
                    <p className="text-sm text-gray-500">Process new rider applications</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/assignments">
              <div 
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                data-testid="link-quick-assignments"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="text-orange-500" />
                  <div>
                    <p className="font-medium">Manage Driver Assignments</p>
                    <p className="text-sm text-gray-500">Assign drivers to business clients</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/drivers">
              <div 
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                data-testid="link-quick-drivers"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="text-emerald-500" />
                  <div>
                    <p className="font-medium">Manage Active Drivers</p>
                    <p className="text-sm text-gray-500">View and edit driver information</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/fleet-vehicles">
              <div 
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                data-testid="link-quick-fleet"
              >
                <div className="flex items-center gap-3">
                  <Car className="text-cyan-500" />
                  <div>
                    <p className="font-medium">Fleet Vehicles</p>
                    <p className="text-sm text-gray-500">Manage company and contractor vehicles</p>
                  </div>
                </div>
              </div>
            </Link>
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
