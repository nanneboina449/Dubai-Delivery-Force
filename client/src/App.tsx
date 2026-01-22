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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/team" component={Team} />
      <Route path="/apply/rider" component={RiderApplication} />
      <Route path="/apply/contractor" component={ContractorApplication} />
      <Route path="/contact/business" component={BusinessInquiry} />
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
