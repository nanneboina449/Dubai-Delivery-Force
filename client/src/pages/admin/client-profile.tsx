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
import { ArrowLeft, Save, Building2, FileText, CreditCard, Users, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessClient } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

export default function ClientProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/admin/business-clients/:id");
  const clientId = params?.id;
  const [formData, setFormData] = useState<Partial<BusinessClient>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: client, isLoading } = useQuery<BusinessClient>({
    queryKey: ["/api/admin/business-clients", clientId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/business-clients/${clientId}`);
      if (!res.ok) throw new Error("Failed to fetch client");
      return res.json();
    },
    enabled: !!clientId,
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
      setHasChanges(false);
    }
  }, [client]);

  const updateField = (field: keyof BusinessClient, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<BusinessClient>) => {
      return apiRequest("PATCH", `/api/admin/business-clients/${clientId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-clients", clientId] });
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

  if (!client) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Client not found</p>
          <Link href="/admin/business-clients">
            <Button className="mt-4">Back to Clients</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/business-clients">
            <Button variant="outline" size="icon" data-testid="button-back">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{formData.companyName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[formData.status || "active"]}>{formData.status}</Badge>
              <Badge variant="outline">{formData.industry}</Badge>
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
            <Building2 size={14} /> Company
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Phone size={14} /> Contacts
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <FileText size={14} /> Contract
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard size={14} /> Billing
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
                    <label className="text-sm font-medium text-gray-600">Industry</label>
                    <Input value={formData.industry || ""} onChange={(e) => updateField("industry", e.target.value)} data-testid="input-industry" />
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
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <Textarea value={formData.address || ""} onChange={(e) => updateField("address", e.target.value)} data-testid="input-address" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <label className="text-sm font-medium text-gray-600">VAT Number</label>
                  <Input value={formData.vatNumber || ""} onChange={(e) => updateField("vatNumber", e.target.value)} data-testid="input-vat" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Service Type</label>
                  <Select value={formData.serviceType || ""} onValueChange={(v) => updateField("serviceType", v)}>
                    <SelectTrigger data-testid="select-service-type"><SelectValue placeholder="Select service type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dedicated">Dedicated Drivers</SelectItem>
                      <SelectItem value="on_demand">On-Demand</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Drivers Required</label>
                    <Input type="number" value={formData.driversRequired || ""} onChange={(e) => updateField("driversRequired", parseInt(e.target.value) || null)} data-testid="input-drivers-required" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Delivery Volume</label>
                    <Input value={formData.deliveryVolume || ""} onChange={(e) => updateField("deliveryVolume", e.target.value)} placeholder="e.g., 500/day" data-testid="input-volume" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Operating Hours</label>
                  <Input value={formData.operatingHours || ""} onChange={(e) => updateField("operatingHours", e.target.value)} placeholder="e.g., 8AM - 10PM" data-testid="input-hours" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <CardTitle className="text-lg">Operations Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Name</label>
                  <Input value={formData.operationsContactName || ""} onChange={(e) => updateField("operationsContactName", e.target.value)} data-testid="input-ops-name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input type="email" value={formData.operationsContactEmail || ""} onChange={(e) => updateField("operationsContactEmail", e.target.value)} data-testid="input-ops-email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <Input value={formData.operationsContactPhone || ""} onChange={(e) => updateField("operationsContactPhone", e.target.value)} data-testid="input-ops-phone" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Name</label>
                  <Input value={formData.billingContactName || ""} onChange={(e) => updateField("billingContactName", e.target.value)} data-testid="input-billing-name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input type="email" value={formData.billingContactEmail || ""} onChange={(e) => updateField("billingContactEmail", e.target.value)} data-testid="input-billing-email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <Input value={formData.billingContactPhone || ""} onChange={(e) => updateField("billingContactPhone", e.target.value)} data-testid="input-billing-phone" />
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={formData.notes || ""} 
                  onChange={(e) => updateField("notes", e.target.value)} 
                  placeholder="Additional notes about this client..."
                  className="min-h-[100px]"
                  data-testid="textarea-notes"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={formData.billingAddress || ""} 
                  onChange={(e) => updateField("billingAddress", e.target.value)} 
                  placeholder="Billing address for invoices..."
                  className="min-h-[100px]"
                  data-testid="textarea-billing-address"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                  <Select value={formData.paymentTerms || ""} onValueChange={(v) => updateField("paymentTerms", v)}>
                    <SelectTrigger data-testid="select-payment-terms"><SelectValue placeholder="Select payment terms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="net_7">Net 7</SelectItem>
                      <SelectItem value="net_15">Net 15</SelectItem>
                      <SelectItem value="net_30">Net 30</SelectItem>
                      <SelectItem value="net_60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Credit Limit (AED)</label>
                  <Input type="number" value={formData.creditLimit || ""} onChange={(e) => updateField("creditLimit", parseInt(e.target.value) || null)} data-testid="input-credit-limit" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
