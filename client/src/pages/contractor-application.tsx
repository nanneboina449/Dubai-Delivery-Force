import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Truck, 
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Bike,
  Car,
  Users,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const contractorFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  tradeLicense: z.string().min(2, "Trade license number is required"),
  emirate: z.string().min(1, "Emirate is required"),
  fleetMotorcycles: z.coerce.number().min(0).default(0),
  fleetCars: z.coerce.number().min(0).default(0),
  fleetVans: z.coerce.number().min(0).default(0),
  fleetTrucks: z.coerce.number().min(0).default(0),
  totalDrivers: z.coerce.number().min(1, "Number of drivers is required"),
  yearsInBusiness: z.coerce.number().min(0, "Years in business is required"),
  currentClients: z.string().optional(),
  insuranceCoverage: z.string().min(1, "Insurance coverage is required"),
  additionalServices: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type ContractorFormData = z.infer<typeof contractorFormSchema>;

import logoImage from "@assets/urbanfleet_logo_hd.png";

const Logo = () => (
  <a href="/" className="flex items-center">
    <img 
      src={logoImage} 
      alt="UrbanFleet Delivery Service" 
      className="h-16 md:h-20 w-auto object-contain"
    />
  </a>
);

export default function ContractorApplication() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      tradeLicense: "",
      emirate: "",
      fleetMotorcycles: 0,
      fleetCars: 0,
      fleetVans: 0,
      fleetTrucks: 0,
      totalDrivers: 0,
      yearsInBusiness: 0,
      currentClients: "",
      insuranceCoverage: "",
      additionalServices: "",
      additionalNotes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContractorFormData) => {
      const response = await apiRequest("POST", "/api/contractor-applications", data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your partnership application and contact you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContractorFormData) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center max-w-md border border-white/20"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Partnership Request Submitted!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest in partnering with UrbanFleet. Our business development team will review your application and contact you within 2-3 business days.
          </p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-orange-600 text-white rounded-full px-8 py-6">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-secondary/80 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Logo />
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
              Become a <span className="text-primary">Contractor</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Partner with UrbanFleet and put your fleet to work. We connect contractors with businesses across the UAE.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" /> Company Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Company Name *</Label>
                  <Input
                    {...form.register("companyName")}
                    placeholder="Enter company name"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-companyName"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-red-400 text-sm">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Contact Person *</Label>
                  <Input
                    {...form.register("contactPerson")}
                    placeholder="Full name"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-contactPerson"
                  />
                  {form.formState.errors.contactPerson && (
                    <p className="text-red-400 text-sm">{form.formState.errors.contactPerson.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Email *</Label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="company@email.com"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Phone Number *</Label>
                  <Input
                    {...form.register("phone")}
                    placeholder="+971 XX XXX XXXX"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Trade License Number *</Label>
                  <Input
                    {...form.register("tradeLicense")}
                    placeholder="Enter trade license number"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-tradeLicense"
                  />
                  {form.formState.errors.tradeLicense && (
                    <p className="text-red-400 text-sm">{form.formState.errors.tradeLicense.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Emirate *</Label>
                  <Select onValueChange={(value) => form.setValue("emirate", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-emirate">
                      <SelectValue placeholder="Select emirate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ajman">Ajman</SelectItem>
                      <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                      <SelectItem value="Fujairah">Fujairah</SelectItem>
                      <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.emirate && (
                    <p className="text-red-400 text-sm">{form.formState.errors.emirate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Years in Business *</Label>
                  <Input
                    {...form.register("yearsInBusiness", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-yearsInBusiness"
                  />
                  {form.formState.errors.yearsInBusiness && (
                    <p className="text-red-400 text-sm">{form.formState.errors.yearsInBusiness.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Total Drivers *</Label>
                  <Input
                    {...form.register("totalDrivers", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-totalDrivers"
                  />
                  {form.formState.errors.totalDrivers && (
                    <p className="text-red-400 text-sm">{form.formState.errors.totalDrivers.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" /> Fleet Details
              </h3>
              <p className="text-gray-400 mb-6">Tell us about the vehicles you own:</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Bike className="w-4 h-4" /> Motorcycles
                  </Label>
                  <Input
                    {...form.register("fleetMotorcycles", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-fleetMotorcycles"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Car className="w-4 h-4" /> Cars
                  </Label>
                  <Input
                    {...form.register("fleetCars", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-fleetCars"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Vans
                  </Label>
                  <Input
                    {...form.register("fleetVans", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-fleetVans"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Trucks
                  </Label>
                  <Input
                    {...form.register("fleetTrucks", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-fleetTrucks"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" /> Insurance & Operations
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Insurance Coverage *</Label>
                  <Select onValueChange={(value) => form.setValue("insuranceCoverage", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-insuranceCoverage">
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Comprehensive">Comprehensive Coverage</SelectItem>
                      <SelectItem value="Third Party">Third Party Only</SelectItem>
                      <SelectItem value="Fleet Insurance">Fleet Insurance</SelectItem>
                      <SelectItem value="Need Assistance">Need Assistance with Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.insuranceCoverage && (
                    <p className="text-red-400 text-sm">{form.formState.errors.insuranceCoverage.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Current Clients (Optional)</Label>
                  <Input
                    {...form.register("currentClients")}
                    placeholder="List major clients if any"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-currentClients"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label className="text-gray-300">Additional Services Offered (Optional)</Label>
                <Input
                  {...form.register("additionalServices")}
                  placeholder="e.g., Cold chain, fragile items, same-day delivery"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  data-testid="input-additionalServices"
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Additional Information</h3>
              <Textarea
                {...form.register("additionalNotes")}
                placeholder="Tell us more about your company, operations, or any questions you have..."
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                data-testid="textarea-additionalNotes"
              />
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 text-white font-bold py-6 rounded-xl text-lg"
              data-testid="button-submit"
            >
              {mutation.isPending ? "Submitting..." : "Submit Partnership Application"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
