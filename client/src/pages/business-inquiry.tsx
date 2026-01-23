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
  Building2, 
  CheckCircle2,
  Phone,
  Mail,
  Users,
  Calendar,
  Truck,
  Package
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { sendFormEmail, formatBusinessInquiry } from "@/lib/emailService";

const businessFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  emirate: z.string().min(1, "Emirate is required"),
  deliveryVolume: z.string().min(1, "Delivery volume is required"),
  vehicleTypesNeeded: z.string().min(1, "Vehicle types needed is required"),
  ridersNeeded: z.coerce.number().min(1, "Number of riders needed is required"),
  startDate: z.string().min(1, "Expected start date is required"),
  contractDuration: z.string().min(1, "Contract duration is required"),
  specialRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

import logoImage from "@assets/urbanfleet-logo-cropped_1769075449106.png";

const Logo = () => (
  <a href="/" className="flex items-center">
    <img 
      src={logoImage} 
      alt="UrbanFleet Delivery Service" 
      className="h-16 md:h-20 w-auto object-contain"
    />
  </a>
);

export default function BusinessInquiry() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      industry: "",
      companySize: "",
      emirate: "",
      deliveryVolume: "",
      vehicleTypesNeeded: "",
      ridersNeeded: 0,
      startDate: "",
      contractDuration: "",
      specialRequirements: "",
      additionalNotes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      // Send email notification
      await sendFormEmail({
        form_type: 'Business Inquiry',
        form_data: formatBusinessInquiry(data),
        from_name: data.contactPerson,
        from_email: data.email,
        phone: data.phone,
      });
      // Also save to database if backend is available
      try {
        const response = await apiRequest("POST", "/api/business-inquiries", data);
        return response.json();
      } catch {
        // If backend is not available (static hosting), just return success
        return { success: true };
      }
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Inquiry Submitted!",
        description: "Our team will contact you to discuss your requirements.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessFormData) => {
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
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Inquiry Received!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest in UrbanFleet's workforce solutions. Our business team will contact you within 24 hours to discuss your requirements.
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
              For <span className="text-primary">Businesses</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Tell us about your delivery workforce requirements and we'll create a tailored solution for your business.
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
                  <Label className="text-gray-300">Industry *</Label>
                  <Select onValueChange={(value) => form.setValue("industry", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Healthcare">Healthcare / Pharmacy</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Logistics">Logistics & Warehousing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.industry && (
                    <p className="text-red-400 text-sm">{form.formState.errors.industry.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Company Size *</Label>
                  <Select onValueChange={(value) => form.setValue("companySize", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-companySize">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.companySize && (
                    <p className="text-red-400 text-sm">{form.formState.errors.companySize.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Primary Emirate *</Label>
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
                      <SelectItem value="Multiple">Multiple Emirates</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.emirate && (
                    <p className="text-red-400 text-sm">{form.formState.errors.emirate.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" /> Delivery Requirements
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Expected Daily Delivery Volume *</Label>
                  <Select onValueChange={(value) => form.setValue("deliveryVolume", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-deliveryVolume">
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 deliveries/day</SelectItem>
                      <SelectItem value="51-100">51-100 deliveries/day</SelectItem>
                      <SelectItem value="101-300">101-300 deliveries/day</SelectItem>
                      <SelectItem value="301-500">301-500 deliveries/day</SelectItem>
                      <SelectItem value="500+">500+ deliveries/day</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.deliveryVolume && (
                    <p className="text-red-400 text-sm">{form.formState.errors.deliveryVolume.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Vehicle Types Needed *</Label>
                  <Select onValueChange={(value) => form.setValue("vehicleTypesNeeded", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-vehicleTypesNeeded">
                      <SelectValue placeholder="Select vehicle types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorcycles">Motorcycles Only</SelectItem>
                      <SelectItem value="Cars">Cars Only</SelectItem>
                      <SelectItem value="Vans">Vans Only</SelectItem>
                      <SelectItem value="Trucks">Trucks Only</SelectItem>
                      <SelectItem value="Mixed Fleet">Mixed Fleet</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.vehicleTypesNeeded && (
                    <p className="text-red-400 text-sm">{form.formState.errors.vehicleTypesNeeded.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Number of Riders Needed *</Label>
                  <Input
                    {...form.register("ridersNeeded", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-ridersNeeded"
                  />
                  {form.formState.errors.ridersNeeded && (
                    <p className="text-red-400 text-sm">{form.formState.errors.ridersNeeded.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Expected Start Date *</Label>
                  <Select onValueChange={(value) => form.setValue("startDate", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-startDate">
                      <SelectValue placeholder="Select start date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediately">Immediately</SelectItem>
                      <SelectItem value="Within 1 Week">Within 1 Week</SelectItem>
                      <SelectItem value="Within 2 Weeks">Within 2 Weeks</SelectItem>
                      <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
                      <SelectItem value="Planning Phase">Still in Planning Phase</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.startDate && (
                    <p className="text-red-400 text-sm">{form.formState.errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">Contract Duration *</Label>
                  <Select onValueChange={(value) => form.setValue("contractDuration", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-contractDuration">
                      <SelectValue placeholder="Select contract duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Project Based">Project Based (Short-term)</SelectItem>
                      <SelectItem value="3 Months">3 Months</SelectItem>
                      <SelectItem value="6 Months">6 Months</SelectItem>
                      <SelectItem value="1 Year">1 Year</SelectItem>
                      <SelectItem value="Long Term">Long Term Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.contractDuration && (
                    <p className="text-red-400 text-sm">{form.formState.errors.contractDuration.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Special Requirements</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Special Requirements (Optional)</Label>
                  <Input
                    {...form.register("specialRequirements")}
                    placeholder="e.g., Cold chain, fragile items, specific uniforms, branded vehicles"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-specialRequirements"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Additional Notes (Optional)</Label>
                  <Textarea
                    {...form.register("additionalNotes")}
                    placeholder="Tell us more about your business needs, delivery zones, or any questions..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                    data-testid="textarea-additionalNotes"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 text-white font-bold py-6 rounded-xl text-lg"
              data-testid="button-submit"
            >
              {mutation.isPending ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
