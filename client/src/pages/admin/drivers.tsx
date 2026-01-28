import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Mail, Phone, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Driver } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

const emptyDriver = {
  fullName: "",
  email: "",
  phone: "",
  nationality: "",
  emirate: "",
  visaStatus: "",
  licenseNumber: "",
  licenseType: "",
  licenseExpiry: "",
  vehicleType: "",
  employeeId: "",
  joiningDate: "",
  status: "active",
  notes: "",
};

export default function DriversAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyDriver);

  const { data: drivers, isLoading } = useQuery<Driver[]>({
    queryKey: ["/api/admin/drivers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyDriver) => {
      return apiRequest("POST", "/api/admin/drivers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drivers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Driver added successfully" });
      setIsCreating(false);
      setFormData(emptyDriver);
    },
    onError: () => {
      toast({ title: "Failed to add driver", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof emptyDriver>) => {
      return apiRequest("PATCH", `/api/admin/drivers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drivers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Driver updated successfully" });
      setSelectedDriver(null);
    },
    onError: () => {
      toast({ title: "Failed to update driver", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/drivers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drivers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Driver removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove driver", variant: "destructive" });
    },
  });

  const openEditDialog = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      fullName: driver.fullName,
      email: driver.email,
      phone: driver.phone,
      nationality: driver.nationality,
      emirate: driver.emirate,
      visaStatus: driver.visaStatus,
      licenseNumber: driver.licenseNumber || "",
      licenseType: driver.licenseType || "",
      licenseExpiry: driver.licenseExpiry || "",
      vehicleType: driver.vehicleType,
      employeeId: driver.employeeId || "",
      joiningDate: driver.joiningDate || "",
      status: driver.status,
      notes: driver.notes || "",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedDriver) {
      updateMutation.mutate({ id: selectedDriver.id, ...formData });
    }
  };

  const DriverForm = ({ onSubmit, isNew }: { onSubmit: () => void; isNew: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            data-testid="input-driver-name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            data-testid="input-driver-email"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone *</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            data-testid="input-driver-phone"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Nationality *</label>
          <Input
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            data-testid="input-driver-nationality"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Emirate *</label>
          <Select value={formData.emirate} onValueChange={(v) => setFormData({ ...formData, emirate: v })}>
            <SelectTrigger data-testid="select-driver-emirate">
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
          <label className="text-sm font-medium">Visa Status *</label>
          <Select value={formData.visaStatus} onValueChange={(v) => setFormData({ ...formData, visaStatus: v })}>
            <SelectTrigger data-testid="select-driver-visa">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Employment Visa">Employment Visa</SelectItem>
              <SelectItem value="Visit Visa">Visit Visa</SelectItem>
              <SelectItem value="UAE National">UAE National</SelectItem>
              <SelectItem value="Freelance Visa">Freelance Visa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">License Number</label>
          <Input
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            data-testid="input-driver-license"
          />
        </div>
        <div>
          <label className="text-sm font-medium">License Type</label>
          <Select value={formData.licenseType} onValueChange={(v) => setFormData({ ...formData, licenseType: v })}>
            <SelectTrigger data-testid="select-driver-license-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              <SelectItem value="Light Vehicle">Light Vehicle</SelectItem>
              <SelectItem value="Heavy Vehicle">Heavy Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">License Expiry</label>
          <Input
            type="date"
            value={formData.licenseExpiry}
            onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
            data-testid="input-driver-license-expiry"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Vehicle Type *</label>
          <Select value={formData.vehicleType} onValueChange={(v) => setFormData({ ...formData, vehicleType: v })}>
            <SelectTrigger data-testid="select-driver-vehicle">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              <SelectItem value="Car">Car</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Bicycle">Bicycle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Employee ID</label>
          <Input
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            data-testid="input-driver-employee-id"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Joining Date</label>
          <Input
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            data-testid="input-driver-joining"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger data-testid="select-driver-status">
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
          data-testid="textarea-driver-notes"
        />
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="bg-[#F56A07] hover:bg-[#d55a06]"
        data-testid={isNew ? "button-create-driver" : "button-update-driver"}
      >
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : isNew ? "Add Driver" : "Update Driver"}
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Drivers</h1>
          <p className="text-gray-500 mt-1">Manage onboarded delivery drivers</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#F56A07] hover:bg-[#d55a06]"
              onClick={() => setFormData(emptyDriver)}
              data-testid="button-add-driver"
            >
              <Plus size={16} className="mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <DriverForm onSubmit={handleCreate} isNew={true} />
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
      ) : drivers?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No active drivers yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {drivers?.map((driver) => (
            <Card key={driver.id} className="hover:shadow-md transition-shadow" data-testid={`card-driver-${driver.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{driver.fullName}</h3>
                      <Badge className={statusColors[driver.status || "active"]}>
                        {driver.status}
                      </Badge>
                      <Badge variant="outline">{driver.vehicleType}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{driver.emirate}</span>
                      </div>
                    </div>
                    {driver.employeeId && (
                      <div className="text-xs text-gray-400 mt-2">
                        Employee ID: {driver.employeeId}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => openEditDialog(driver)}
                          data-testid={`button-edit-driver-${driver.id}`}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Driver</DialogTitle>
                        </DialogHeader>
                        {selectedDriver && <DriverForm onSubmit={handleUpdate} isNew={false} />}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteMutation.mutate(driver.id)}
                      data-testid={`button-delete-driver-${driver.id}`}
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
