import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Plus, Edit, Trash2, Building2, Calendar } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessClient } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

const emptyClient = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  industry: "",
  emirate: "",
  address: "",
  contractStartDate: "",
  contractEndDate: "",
  deliveryVolume: "",
  status: "active",
  notes: "",
};

export default function BusinessClientsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<BusinessClient | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyClient);

  const { data: clients, isLoading } = useQuery<BusinessClient[]>({
    queryKey: ["/api/admin/business-clients"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyClient) => {
      return apiRequest("POST", "/api/admin/business-clients", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Client added successfully" });
      setIsCreating(false);
      setFormData(emptyClient);
    },
    onError: () => {
      toast({ title: "Failed to add client", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof emptyClient>) => {
      return apiRequest("PATCH", `/api/admin/business-clients/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Client updated successfully" });
      setSelectedClient(null);
    },
    onError: () => {
      toast({ title: "Failed to update client", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/business-clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Client removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove client", variant: "destructive" });
    },
  });

  const openEditDialog = (client: BusinessClient) => {
    setSelectedClient(client);
    setFormData({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      industry: client.industry,
      emirate: client.emirate,
      address: client.address || "",
      contractStartDate: client.contractStartDate || "",
      contractEndDate: client.contractEndDate || "",
      deliveryVolume: client.deliveryVolume || "",
      status: client.status,
      notes: client.notes || "",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedClient) {
      updateMutation.mutate({ id: selectedClient.id, ...formData });
    }
  };

  const ClientForm = ({ onSubmit, isNew }: { onSubmit: () => void; isNew: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Company Name *</label>
          <Input
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            data-testid="input-client-company"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contact Person *</label>
          <Input
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            data-testid="input-client-contact"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            data-testid="input-client-email"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone *</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            data-testid="input-client-phone"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Industry *</label>
          <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
            <SelectTrigger data-testid="select-client-industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Emirate *</label>
          <Select value={formData.emirate} onValueChange={(v) => setFormData({ ...formData, emirate: v })}>
            <SelectTrigger data-testid="select-client-emirate">
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
        <div className="col-span-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Full business address"
            data-testid="input-client-address"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contract Start Date</label>
          <Input
            type="date"
            value={formData.contractStartDate}
            onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
            data-testid="input-client-start"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contract End Date</label>
          <Input
            type="date"
            value={formData.contractEndDate}
            onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
            data-testid="input-client-end"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Delivery Volume</label>
          <Select value={formData.deliveryVolume} onValueChange={(v) => setFormData({ ...formData, deliveryVolume: v })}>
            <SelectTrigger data-testid="select-client-volume">
              <SelectValue placeholder="Select volume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50 per day</SelectItem>
              <SelectItem value="51-200">51-200 per day</SelectItem>
              <SelectItem value="201-500">201-500 per day</SelectItem>
              <SelectItem value="500+">500+ per day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger data-testid="select-client-status">
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
          data-testid="textarea-client-notes"
        />
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="bg-[#F56A07] hover:bg-[#d55a06]"
        data-testid={isNew ? "button-create-client" : "button-update-client"}
      >
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : isNew ? "Add Client" : "Update Client"}
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Clients</h1>
          <p className="text-gray-500 mt-1">Manage active business partnerships</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#F56A07] hover:bg-[#d55a06]"
              onClick={() => setFormData(emptyClient)}
              data-testid="button-add-client"
            >
              <Plus size={16} className="mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Business Client</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={handleCreate} isNew={true} />
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
      ) : clients?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No business clients yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {clients?.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow" data-testid={`card-client-${client.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 size={20} className="text-gray-400" />
                      <h3 className="text-lg font-semibold">{client.companyName}</h3>
                      <Badge className={statusColors[client.status || "active"]}>
                        {client.status}
                      </Badge>
                      <Badge variant="outline">{client.industry}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{client.emirate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                      <span>Contact: {client.contactPerson}</span>
                      {client.deliveryVolume && (
                        <span>Volume: {client.deliveryVolume}/day</span>
                      )}
                      {client.contractEndDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Contract ends: {client.contractEndDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => openEditDialog(client)}
                          data-testid={`button-edit-client-${client.id}`}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Business Client</DialogTitle>
                        </DialogHeader>
                        {selectedClient && <ClientForm onSubmit={handleUpdate} isNew={false} />}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteMutation.mutate(client.id)}
                      data-testid={`button-delete-client-${client.id}`}
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
