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
import { ArrowLeft, Save, Building, FileText, DollarSign, Users, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ActiveContractor } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

export default function ContractorProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/admin/active-contractors/:id");
  const contractorId = params?.id;
  const [formData, setFormData] = useState<Partial<ActiveContractor>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: contractor, isLoading } = useQuery<ActiveContractor>({
    queryKey: ["/api/admin/active-contractors", contractorId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/active-contractors/${contractorId}`);
      if (!res.ok) throw new Error("Failed to fetch contractor");
      return res.json();
    },
    enabled: !!contractorId,
  });

  useEffect(() => {
    if (contractor) {
      setFormData(contractor);
      setHasChanges(false);
    }
  }, [contractor]);

  const updateField = (field: keyof ActiveContractor, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<ActiveContractor>) => {
      return apiRequest("PATCH", `/api/admin/active-contractors/${contractorId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/active-contractors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/active-contractors", contractorId] });
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

  if (!contractor) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Contractor not found</p>
          <Link href="/admin/active-contractors">
            <Button className="mt-4">Back to Contractors</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/active-contractors">
            <Button variant="outline" size="icon" data-testid="button-back">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{formData.companyName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[formData.status || "active"]}>{formData.status}</Badge>
              <span className="text-sm text-gray-500">{formData.emirate}</span>
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

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building size={14} /> Company
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Phone size={14} /> Contacts
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <FileText size={14} /> Contract
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <DollarSign size={14} /> Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <Input value={formData.companyName || ""} onChange={(e) => updateField("companyName", e.target.value)} data-testid="input-company-name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Trade License</label>
                    <Input value={formData.tradeLicense || ""} onChange={(e) => updateField("tradeLicense", e.target.value)} data-testid="input-trade-license" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Expiry</label>
                    <Input type="date" value={formData.tradeLicenseExpiry || ""} onChange={(e) => updateField("tradeLicenseExpiry", e.target.value)} data-testid="input-license-expiry" />
                  </div>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Office Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Office Address</label>
                  <Textarea value={formData.officeAddress || ""} onChange={(e) => updateField("officeAddress", e.target.value)} data-testid="input-office-address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <Input value={formData.officeCity || ""} onChange={(e) => updateField("officeCity", e.target.value)} data-testid="input-city" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Postal Code</label>
                    <Input value={formData.officePostalCode || ""} onChange={(e) => updateField("officePostalCode", e.target.value)} data-testid="input-postal" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fleet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fleet Size</label>
                    <Input type="number" value={formData.fleetSize || ""} onChange={(e) => updateField("fleetSize", parseInt(e.target.value) || null)} data-testid="input-fleet-size" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Driver Count</label>
                    <Input type="number" value={formData.driverCount || ""} onChange={(e) => updateField("driverCount", parseInt(e.target.value) || null)} data-testid="input-driver-count" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Insurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Insurance Coverage</label>
                  <Input value={formData.insuranceCoverage || ""} onChange={(e) => updateField("insuranceCoverage", e.target.value)} placeholder="e.g., Comprehensive" data-testid="input-insurance" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Insurance Expiry</label>
                  <Input type="date" value={formData.insuranceExpiry || ""} onChange={(e) => updateField("insuranceExpiry", e.target.value)} data-testid="input-insurance-expiry" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Person</label>
                  <Input value={formData.contactPerson || ""} onChange={(e) => updateField("contactPerson", e.target.value)} data-testid="input-contact-person" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input type="email" value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} data-testid="input-email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <Input value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} data-testid="input-phone" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secondary Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Name</label>
                  <Input value={formData.secondaryContactName || ""} onChange={(e) => updateField("secondaryContactName", e.target.value)} data-testid="input-secondary-name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input type="email" value={formData.secondaryContactEmail || ""} onChange={(e) => updateField("secondaryContactEmail", e.target.value)} data-testid="input-secondary-email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <Input value={formData.secondaryContactPhone || ""} onChange={(e) => updateField("secondaryContactPhone", e.target.value)} data-testid="input-secondary-phone" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contract">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <Input type="date" value={formData.contractStartDate || ""} onChange={(e) => updateField("contractStartDate", e.target.value)} data-testid="input-start-date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">End Date</label>
                    <Input type="date" value={formData.contractEndDate || ""} onChange={(e) => updateField("contractEndDate", e.target.value)} data-testid="input-end-date" />
                  </div>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Commission Rate (%)</label>
                  <Input type="number" value={formData.commissionRate || ""} onChange={(e) => updateField("commissionRate", parseInt(e.target.value) || null)} data-testid="input-commission" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                  <Select value={formData.paymentTerms || ""} onValueChange={(v) => updateField("paymentTerms", v)}>
                    <SelectTrigger data-testid="select-payment-terms"><SelectValue placeholder="Select payment terms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="net_15">Net 15</SelectItem>
                      <SelectItem value="net_30">Net 30</SelectItem>
                    </SelectContent>
                  </Select>
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
                  placeholder="Additional notes about this contractor..."
                  className="min-h-[100px]"
                  data-testid="textarea-notes"
                />
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
              <div>
                <label className="text-sm font-medium text-gray-600">SWIFT Code</label>
                <Input value={formData.bankSwiftCode || ""} onChange={(e) => updateField("bankSwiftCode", e.target.value)} data-testid="input-swift" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
