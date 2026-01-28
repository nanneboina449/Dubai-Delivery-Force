import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import AdminLayout from "./admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, User, Briefcase, FileText, DollarSign, Building2, Phone, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Driver } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

const visaStatusOptions = [
  { value: "Company Sponsored", label: "Company Sponsored Visa" },
  { value: "Own Visa", label: "Own Visa" },
  { value: "Visit Visa", label: "Visit Visa" },
  { value: "UAE National", label: "UAE National" },
  { value: "Freelance Visa", label: "Freelance Visa" },
  { value: "Pending", label: "Pending Visa Processing" },
];

export default function DriverProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/admin/drivers/:id");
  const driverId = params?.id;
  const [formData, setFormData] = useState<Partial<Driver>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: driver, isLoading } = useQuery<Driver>({
    queryKey: ["/api/admin/drivers", driverId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/drivers/${driverId}`);
      if (!res.ok) throw new Error("Failed to fetch driver");
      return res.json();
    },
    enabled: !!driverId,
  });

  useEffect(() => {
    if (driver) {
      setFormData(driver);
      setHasChanges(false);
    }
  }, [driver]);

  const updateField = (field: keyof Driver, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Driver>) => {
      return apiRequest("PATCH", `/api/admin/drivers/${driverId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drivers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drivers", driverId] });
      toast({ title: "Profile updated successfully" });
      setHasChanges(false);
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const totalSalary = (formData.basicSalary || 0) + (formData.housingAllowance || 0) + 
                      (formData.transportAllowance || 0) + (formData.otherAllowance || 0);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!driver) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Driver not found</p>
          <Link href="/admin/drivers">
            <Button className="mt-4">Back to Drivers</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/drivers">
            <Button variant="outline" size="icon" data-testid="button-back">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{formData.fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[formData.status || "active"]}>{formData.status}</Badge>
              <Badge variant="outline">{formData.vehicleType}</Badge>
              <Badge className={formData.visaStatus === "Company Sponsored" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                {formData.visaStatus}
              </Badge>
              {formData.employeeId && <span className="text-sm text-gray-500">ID: {formData.employeeId}</span>}
            </div>
          </div>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleSave} 
            disabled={updateMutation.isPending}
            className="bg-[#F56A07] hover:bg-[#d55a06]"
            data-testid="button-save-profile"
          >
            <Save size={16} className="mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User size={14} /> Personal
          </TabsTrigger>
          <TabsTrigger value="employment" className="flex items-center gap-2">
            <Briefcase size={14} /> Employment
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText size={14} /> Documents
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-2">
            <DollarSign size={14} /> Salary
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Building2 size={14} /> Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <Input value={formData.fullName || ""} onChange={(e) => updateField("fullName", e.target.value)} data-testid="input-fullname" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                    <Input value={formData.nationality || ""} onChange={(e) => updateField("nationality", e.target.value)} data-testid="input-nationality" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <Input type="email" value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} data-testid="input-email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <Input value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} data-testid="input-phone" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Address</label>
                  <Textarea value={formData.fullAddress || ""} onChange={(e) => updateField("fullAddress", e.target.value)} data-testid="input-address" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <Input value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} data-testid="input-city" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emirate</label>
                    <Select value={formData.emirate || ""} onValueChange={(v) => updateField("emirate", v)}>
                      <SelectTrigger data-testid="select-emirate"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dubai">Dubai</SelectItem>
                        <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                        <SelectItem value="Sharjah">Sharjah</SelectItem>
                        <SelectItem value="Ajman">Ajman</SelectItem>
                        <SelectItem value="RAK">Ras Al Khaimah</SelectItem>
                        <SelectItem value="Fujairah">Fujairah</SelectItem>
                        <SelectItem value="UAQ">Umm Al Quwain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Postal Code</label>
                    <Input value={formData.postalCode || ""} onChange={(e) => updateField("postalCode", e.target.value)} data-testid="input-postal" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone size={16} /> Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Name</label>
                    <Input value={formData.emergencyContactName || ""} onChange={(e) => updateField("emergencyContactName", e.target.value)} data-testid="input-emergency-name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Relationship</label>
                    <Input value={formData.emergencyContactRelation || ""} onChange={(e) => updateField("emergencyContactRelation", e.target.value)} placeholder="e.g., Spouse, Parent" data-testid="input-emergency-relation" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                  <Input value={formData.emergencyContactPhone || ""} onChange={(e) => updateField("emergencyContactPhone", e.target.value)} data-testid="input-emergency-phone" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employee ID</label>
                    <Input value={formData.employeeId || ""} onChange={(e) => updateField("employeeId", e.target.value)} data-testid="input-employee-id" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Joining Date</label>
                    <Input type="date" value={formData.joiningDate || ""} onChange={(e) => updateField("joiningDate", e.target.value)} data-testid="input-joining-date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Select value={formData.status || "active"} onValueChange={(v) => updateField("status", v)}>
                      <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vehicle Type</label>
                    <Select value={formData.vehicleType || ""} onValueChange={(v) => updateField("vehicleType", v)}>
                      <SelectTrigger data-testid="select-vehicle-type"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">License Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Number</label>
                    <Input value={formData.licenseNumber || ""} onChange={(e) => updateField("licenseNumber", e.target.value)} data-testid="input-license-number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Type</label>
                    <Input value={formData.licenseType || ""} onChange={(e) => updateField("licenseType", e.target.value)} placeholder="e.g., Light Vehicle, Motorcycle" data-testid="input-license-type" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">License Expiry</label>
                  <Input type="date" value={formData.licenseExpiry || ""} onChange={(e) => updateField("licenseExpiry", e.target.value)} data-testid="input-license-expiry" />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={formData.notes || ""} 
                  onChange={(e) => updateField("notes", e.target.value)} 
                  placeholder="Additional notes about this driver..."
                  className="min-h-[100px]"
                  data-testid="textarea-notes"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visa & Immigration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Visa Status</label>
                  <Select value={formData.visaStatus || ""} onValueChange={(v) => updateField("visaStatus", v)}>
                    <SelectTrigger data-testid="select-visa-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {visaStatusOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Visa Number</label>
                    <Input value={formData.visaNumber || ""} onChange={(e) => updateField("visaNumber", e.target.value)} data-testid="input-visa-number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Visa Expiry</label>
                    <Input type="date" value={formData.visaExpiry || ""} onChange={(e) => updateField("visaExpiry", e.target.value)} data-testid="input-visa-expiry" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Visa File Number</label>
                  <Input value={formData.visaFileNumber || ""} onChange={(e) => updateField("visaFileNumber", e.target.value)} data-testid="input-visa-file" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Labor Card Number</label>
                    <Input value={formData.laborCardNumber || ""} onChange={(e) => updateField("laborCardNumber", e.target.value)} data-testid="input-labor-card" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Labor Card Expiry</label>
                    <Input type="date" value={formData.laborCardExpiry || ""} onChange={(e) => updateField("laborCardExpiry", e.target.value)} data-testid="input-labor-expiry" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identity Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passport Number</label>
                    <Input value={formData.passportNumber || ""} onChange={(e) => updateField("passportNumber", e.target.value)} data-testid="input-passport" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passport Expiry</label>
                    <Input type="date" value={formData.passportExpiry || ""} onChange={(e) => updateField("passportExpiry", e.target.value)} data-testid="input-passport-expiry" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emirates ID</label>
                    <Input value={formData.emiratesId || ""} onChange={(e) => updateField("emiratesId", e.target.value)} placeholder="784-XXXX-XXXXXXX-X" data-testid="input-emirates-id" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emirates ID Expiry</label>
                    <Input type="date" value={formData.emiratesIdExpiry || ""} onChange={(e) => updateField("emiratesIdExpiry", e.target.value)} data-testid="input-emirates-expiry" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="salary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Salary Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Basic Salary (AED)</label>
                    <Input type="number" value={formData.basicSalary || ""} onChange={(e) => updateField("basicSalary", parseInt(e.target.value) || null)} data-testid="input-basic-salary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Housing Allowance (AED)</label>
                    <Input type="number" value={formData.housingAllowance || ""} onChange={(e) => updateField("housingAllowance", parseInt(e.target.value) || null)} data-testid="input-housing" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transport Allowance (AED)</label>
                    <Input type="number" value={formData.transportAllowance || ""} onChange={(e) => updateField("transportAllowance", parseInt(e.target.value) || null)} data-testid="input-transport" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Other Allowance (AED)</label>
                    <Input type="number" value={formData.otherAllowance || ""} onChange={(e) => updateField("otherAllowance", parseInt(e.target.value) || null)} data-testid="input-other" />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Package</span>
                    <span className="text-2xl font-bold text-[#F56A07]">AED {totalSalary.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.paymentMethod || ""} onValueChange={(v) => updateField("paymentMethod", v)}>
                  <SelectTrigger data-testid="select-payment-method"><SelectValue placeholder="Select payment method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wps">WPS (Wage Protection System)</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  WPS is mandatory for UAE employment. Ensure bank details are filled in the Bank tab.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bank">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="text-lg">Bank Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                <Input value={formData.bankName || ""} onChange={(e) => updateField("bankName", e.target.value)} placeholder="e.g., Emirates NBD, ADCB, FAB" data-testid="input-bank-name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Number</label>
                <Input value={formData.bankAccountNumber || ""} onChange={(e) => updateField("bankAccountNumber", e.target.value)} data-testid="input-account-number" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">IBAN</label>
                <Input value={formData.bankIban || ""} onChange={(e) => updateField("bankIban", e.target.value)} placeholder="AE XX XXXX XXXX XXXX XXXX XXX" data-testid="input-iban" />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important</p>
                  <p>Bank details are used for salary disbursement through WPS. Ensure accuracy to avoid payment delays.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
