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
  Bike, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  FileCheck,
  Clock,
  Globe
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const riderFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  nationality: z.string().min(2, "Nationality is required"),
  currentLocation: z.string().min(2, "Current location is required"),
  visaStatus: z.string().min(1, "Visa status is required"),
  hasUaeDrivingLicense: z.string().min(1, "Please select an option"),
  licenseType: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience is required"),
  vehicleType: z.string().min(1, "Vehicle type preference is required"),
  ownsVehicle: z.string().min(1, "Please select an option"),
  availableToStart: z.string().min(1, "Availability is required"),
  preferredWorkArea: z.string().min(1, "Preferred work area is required"),
  englishProficiency: z.string().min(1, "English proficiency is required"),
  additionalNotes: z.string().optional(),
});

type RiderFormData = z.infer<typeof riderFormSchema>;

import logoImage from "@assets/WhatsApp_Image_2026-01-22_at_09.40.01_1769074882220.jpeg";

const Logo = () => (
  <a href="/" className="flex items-center">
    <img 
      src={logoImage} 
      alt="UrbanFleet Delivery Service" 
      className="h-16 md:h-20 w-auto object-contain"
    />
  </a>
);

export default function RiderApplication() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RiderFormData>({
    resolver: zodResolver(riderFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      nationality: "",
      currentLocation: "",
      visaStatus: "",
      hasUaeDrivingLicense: "",
      licenseType: "",
      yearsOfExperience: 0,
      vehicleType: "",
      ownsVehicle: "",
      availableToStart: "",
      preferredWorkArea: "",
      englishProficiency: "",
      additionalNotes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: RiderFormData) => {
      const response = await apiRequest("POST", "/api/rider-applications", data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and contact you soon.",
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

  const onSubmit = (data: RiderFormData) => {
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
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest in joining UrbanFleet. Our team will review your application and contact you within 3-5 business days.
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
              Join as a <span className="text-primary">Rider</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Start your delivery career with UrbanFleet. We offer visa sponsorship, competitive pay, and growth opportunities.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Full Name *</Label>
                  <Input
                    {...form.register("fullName")}
                    placeholder="Enter your full name"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-fullName"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-red-400 text-sm">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Email *</Label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="your@email.com"
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
                    placeholder="+971 50 XXX XXXX"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-400 text-sm">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Nationality *</Label>
                  <Input
                    {...form.register("nationality")}
                    placeholder="Enter your nationality"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-nationality"
                  />
                  {form.formState.errors.nationality && (
                    <p className="text-red-400 text-sm">{form.formState.errors.nationality.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Current Location in UAE *</Label>
                  <Select onValueChange={(value) => form.setValue("currentLocation", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-currentLocation">
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
                      <SelectItem value="Outside UAE">Outside UAE</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.currentLocation && (
                    <p className="text-red-400 text-sm">{form.formState.errors.currentLocation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Visa Status *</Label>
                  <Select onValueChange={(value) => form.setValue("visaStatus", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-visaStatus">
                      <SelectValue placeholder="Select visa status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE Resident">UAE Resident Visa</SelectItem>
                      <SelectItem value="Visit Visa">Visit Visa</SelectItem>
                      <SelectItem value="Need Sponsorship">Need Visa Sponsorship</SelectItem>
                      <SelectItem value="UAE National">UAE National</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.visaStatus && (
                    <p className="text-red-400 text-sm">{form.formState.errors.visaStatus.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-primary" /> Driving & Experience
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Do you have a UAE Driving License? *</Label>
                  <Select onValueChange={(value) => form.setValue("hasUaeDrivingLicense", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-hasUaeDrivingLicense">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.hasUaeDrivingLicense && (
                    <p className="text-red-400 text-sm">{form.formState.errors.hasUaeDrivingLicense.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">License Type</Label>
                  <Select onValueChange={(value) => form.setValue("licenseType", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-licenseType">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorcycle">Motorcycle License</SelectItem>
                      <SelectItem value="Light Vehicle">Light Vehicle License</SelectItem>
                      <SelectItem value="Heavy Vehicle">Heavy Vehicle License</SelectItem>
                      <SelectItem value="Multiple">Multiple Licenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Years of Delivery Experience *</Label>
                  <Input
                    {...form.register("yearsOfExperience", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-yearsOfExperience"
                  />
                  {form.formState.errors.yearsOfExperience && (
                    <p className="text-red-400 text-sm">{form.formState.errors.yearsOfExperience.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Preferred Vehicle Type *</Label>
                  <Select onValueChange={(value) => form.setValue("vehicleType", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Any">Any Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.vehicleType && (
                    <p className="text-red-400 text-sm">{form.formState.errors.vehicleType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Do you own a vehicle? *</Label>
                  <Select onValueChange={(value) => form.setValue("ownsVehicle", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-ownsVehicle">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes, I own a vehicle</SelectItem>
                      <SelectItem value="No">No, I need a company vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.ownsVehicle && (
                    <p className="text-red-400 text-sm">{form.formState.errors.ownsVehicle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">English Proficiency *</Label>
                  <Select onValueChange={(value) => form.setValue("englishProficiency", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-englishProficiency">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.englishProficiency && (
                    <p className="text-red-400 text-sm">{form.formState.errors.englishProficiency.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" /> Availability
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">When can you start? *</Label>
                  <Select onValueChange={(value) => form.setValue("availableToStart", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-availableToStart">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediately">Immediately</SelectItem>
                      <SelectItem value="Within 1 Week">Within 1 Week</SelectItem>
                      <SelectItem value="Within 2 Weeks">Within 2 Weeks</SelectItem>
                      <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
                      <SelectItem value="After Visa Processing">After Visa Processing</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.availableToStart && (
                    <p className="text-red-400 text-sm">{form.formState.errors.availableToStart.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Preferred Work Area *</Label>
                  <Select onValueChange={(value) => form.setValue("preferredWorkArea", value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-preferredWorkArea">
                      <SelectValue placeholder="Select preferred area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Northern Emirates">Northern Emirates</SelectItem>
                      <SelectItem value="Any Location">Any Location</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.preferredWorkArea && (
                    <p className="text-red-400 text-sm">{form.formState.errors.preferredWorkArea.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Additional Information</h3>
              <Textarea
                {...form.register("additionalNotes")}
                placeholder="Tell us more about yourself, your experience, or any questions you have..."
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                data-testid="textarea-additionalNotes"
              />
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:opacity-90 text-white font-bold py-6 rounded-xl text-lg"
              data-testid="button-submit"
            >
              {mutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
