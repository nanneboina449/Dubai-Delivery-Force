import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Plus, Edit, Trash2, Building2, FileText } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ActiveContractor } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

const emptyContractor = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  tradeLicense: "",
  emirate: "",
  contractStartDate: "",
  contractEndDate: "",
  insuranceCoverage: "",
  insuranceExpiry: "",
  status: "active",
  notes: "",
};

export default function ActiveContractorsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContractor, setSelectedContractor] = useState<ActiveContractor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyContractor);

  const { data: contractors, isLoading } = useQuery<ActiveContractor[]>({
    queryKey: ["/api/admin/active-contractors"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyContractor) => {
      return apiRequest("POST", "/api/admin/active-contractors", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/active-contractors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Contractor added successfully" });
      setIsCreating(false);
      setFormData(emptyContractor);
    },
    onError: () => {
      toast({ title: "Failed to add contractor", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof emptyContractor>) => {
      return apiRequest("PATCH", `/api/admin/active-contractors/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/active-contractors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Contractor updated successfully" });
      setSelectedContractor(null);
    },
    onError: () => {
      toast({ title: "Failed to update contractor", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/active-contractors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/active-contractors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Contractor removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove contractor", variant: "destructive" });
    },
  });

  const openEditDialog = (contractor: ActiveContractor) => {
    setSelectedContractor(contractor);
    setFormData({
      companyName: contractor.companyName,
      contactPerson: contractor.contactPerson,
      email: contractor.email,
      phone: contractor.phone,
      tradeLicense: contractor.tradeLicense,
      emirate: contractor.emirate,
      contractStartDate: contractor.contractStartDate || "",
      contractEndDate: contractor.contractEndDate || "",
      insuranceCoverage: contractor.insuranceCoverage || "",
      insuranceExpiry: contractor.insuranceExpiry || "",
      status: contractor.status,
      notes: contractor.notes || "",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedContractor) {
      updateMutation.mutate({ id: selectedContractor.id, ...formData });
    }
  };

  const ContractorForm = ({ onSubmit, isNew }: { onSubmit: () => void; isNew: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Company Name *</label>
          <Input
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            data-testid="input-contractor-company"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contact Person *</label>
          <Input
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            data-testid="input-contractor-contact"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            data-testid="input-contractor-email"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone *</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            data-testid="input-contractor-phone"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Trade License *</label>
          <Input
            value={formData.tradeLicense}
            onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
            data-testid="input-contractor-license"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Emirate *</label>
          <Select value={formData.emirate} onValueChange={(v) => setFormData({ ...formData, emirate: v })}>
            <SelectTrigger data-testid="select-contractor-emirate">
              <SelectValue placeholder="Select emirate" />
            </SelectTrigger>
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
          <label className="text-sm font-medium">Contract Start Date</label>
          <Input
            type="date"
            value={formData.contractStartDate}
            onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
            data-testid="input-contractor-start"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contract End Date</label>
          <Input
            type="date"
            value={formData.contractEndDate}
            onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
            data-testid="input-contractor-end"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Insurance Coverage</label>
          <Input
            value={formData.insuranceCoverage}
            onChange={(e) => setFormData({ ...formData, insuranceCoverage: e.target.value })}
            placeholder="e.g., Comprehensive"
            data-testid="input-contractor-insurance"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Insurance Expiry</label>
          <Input
            type="date"
            value={formData.insuranceExpiry}
            onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
            data-testid="input-contractor-insurance-expiry"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger data-testid="select-contractor-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          data-testid="textarea-contractor-notes"
        />
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="bg-[#F56A07] hover:bg-[#d55a06]"
        data-testid={isNew ? "button-create-contractor" : "button-update-contractor"}
      >
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : isNew ? "Add Contractor" : "Update Contractor"}
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Contractors</h1>
          <p className="text-gray-500 mt-1">Manage partner fleet contractors</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#F56A07] hover:bg-[#d55a06]"
              onClick={() => setFormData(emptyContractor)}
              data-testid="button-add-contractor"
            >
              <Plus size={16} className="mr-2" />
              Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Contractor</DialogTitle>
            </DialogHeader>
            <ContractorForm onSubmit={handleCreate} isNew={true} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : contractors?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No active contractors yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contractors?.map((contractor) => (
            <Card key={contractor.id} className="hover:shadow-md transition-shadow" data-testid={`card-contractor-${contractor.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 size={20} className="text-gray-400" />
                      <h3 className="text-lg font-semibold">{contractor.companyName}</h3>
                      <Badge className={statusColors[contractor.status || "active"]}>
                        {contractor.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{contractor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{contractor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{contractor.emirate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        License: {contractor.tradeLicense}
                      </span>
                      <span>Contact: {contractor.contactPerson}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => openEditDialog(contractor)}
                          data-testid={`button-edit-contractor-${contractor.id}`}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Contractor</DialogTitle>
                        </DialogHeader>
                        {selectedContractor && <ContractorForm onSubmit={handleUpdate} isNew={false} />}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteMutation.mutate(contractor.id)}
                      data-testid={`button-delete-contractor-${contractor.id}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
