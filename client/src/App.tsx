import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RiderApplication from "@/pages/rider-application";
import ContractorApplication from "@/pages/contractor-application";
import BusinessInquiry from "@/pages/business-inquiry";
import Team from "@/pages/team";
import AdminDashboard from "@/pages/admin/dashboard";
import RidersAdmin from "@/pages/admin/riders";
import ContractorsAdmin from "@/pages/admin/contractors";
import InquiriesAdmin from "@/pages/admin/inquiries";
import AdminLogin from "@/pages/admin/login";
import DriversAdmin from "@/pages/admin/drivers";
import ActiveContractorsAdmin from "@/pages/admin/active-contractors";
import FleetVehiclesAdmin from "@/pages/admin/fleet-vehicles";
import BusinessClientsAdmin from "@/pages/admin/business-clients";
import AssignmentsAdmin from "@/pages/admin/assignments";
import DriverProfile from "@/pages/admin/driver-profile";
import ContractorProfile from "@/pages/admin/contractor-profile";
import ClientProfile from "@/pages/admin/client-profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/team" component={Team} />
      <Route path="/apply/rider" component={RiderApplication} />
      <Route path="/apply/contractor" component={ContractorApplication} />
      <Route path="/contact/business" component={BusinessInquiry} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/riders" component={RidersAdmin} />
      <Route path="/admin/contractors" component={ContractorsAdmin} />
      <Route path="/admin/inquiries" component={InquiriesAdmin} />
      <Route path="/admin/drivers" component={DriversAdmin} />
      <Route path="/admin/drivers/:id" component={DriverProfile} />
      <Route path="/admin/active-contractors" component={ActiveContractorsAdmin} />
      <Route path="/admin/active-contractors/:id" component={ContractorProfile} />
      <Route path="/admin/fleet-vehicles" component={FleetVehiclesAdmin} />
      <Route path="/admin/business-clients" component={BusinessClientsAdmin} />
      <Route path="/admin/business-clients/:id" component={ClientProfile} />
      <Route path="/admin/assignments" component={AssignmentsAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
