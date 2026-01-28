import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Car, Bike, Truck } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FleetVehicle } from "@shared/schema";

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  assigned: "bg-blue-100 text-blue-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  retired: "bg-gray-100 text-gray-800",
};

const ownershipColors: Record<string, string> = {
  company: "bg-purple-100 text-purple-800",
  contractor: "bg-orange-100 text-orange-800",
  driver: "bg-cyan-100 text-cyan-800",
};

const vehicleIcons: Record<string, any> = {
  motorcycle: Bike,
  car: Car,
  van: Truck,
  truck: Truck,
  bicycle: Bike,
};

const emptyVehicle = {
  vehicleType: "",
  make: "",
  model: "",
  year: "",
  plateNumber: "",
  registrationExpiry: "",
  insuranceExpiry: "",
  ownership: "company",
  status: "available",
  notes: "",
};

export default function FleetVehiclesAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyVehicle);

  const { data: vehicles, isLoading } = useQuery<FleetVehicle[]>({
    queryKey: ["/api/admin/fleet-vehicles"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyVehicle) => {
      return apiRequest("POST", "/api/admin/fleet-vehicles", {
        ...data,
        year: data.year ? parseInt(data.year) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fleet-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Vehicle added successfully" });
      setIsCreating(false);
      setFormData(emptyVehicle);
    },
    onError: () => {
      toast({ title: "Failed to add vehicle", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof emptyVehicle>) => {
      return apiRequest("PATCH", `/api/admin/fleet-vehicles/${id}`, {
        ...data,
        year: data.year ? parseInt(data.year) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fleet-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Vehicle updated successfully" });
      setSelectedVehicle(null);
    },
    onError: () => {
      toast({ title: "Failed to update vehicle", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/fleet-vehicles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fleet-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Vehicle removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove vehicle", variant: "destructive" });
    },
  });

  const openEditDialog = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      vehicleType: vehicle.vehicleType,
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year?.toString() || "",
      plateNumber: vehicle.plateNumber,
      registrationExpiry: vehicle.registrationExpiry || "",
      insuranceExpiry: vehicle.insuranceExpiry || "",
      ownership: vehicle.ownership,
      status: vehicle.status,
      notes: vehicle.notes || "",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedVehicle) {
      updateMutation.mutate({ id: selectedVehicle.id, ...formData });
    }
  };

  const VehicleForm = ({ onSubmit, isNew }: { onSubmit: () => void; isNew: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Vehicle Type *</label>
          <Select value={formData.vehicleType} onValueChange={(v) => setFormData({ ...formData, vehicleType: v })}>
            <SelectTrigger data-testid="select-vehicle-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="bicycle">Bicycle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Plate Number *</label>
          <Input
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            placeholder="e.g., DXB A 12345"
            data-testid="input-vehicle-plate"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Make</label>
          <Input
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            placeholder="e.g., Toyota"
            data-testid="input-vehicle-make"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Model</label>
          <Input
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="e.g., Hiace"
            data-testid="input-vehicle-model"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Year</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="e.g., 2023"
            data-testid="input-vehicle-year"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Ownership *</label>
          <Select value={formData.ownership} onValueChange={(v) => setFormData({ ...formData, ownership: v })}>
            <SelectTrigger data-testid="select-vehicle-ownership">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">Company Owned</SelectItem>
              <SelectItem value="contractor">Contractor Owned</SelectItem>
              <SelectItem value="driver">Driver Owned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Registration Expiry</label>
          <Input
            type="date"
            value={formData.registrationExpiry}
            onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
            data-testid="input-vehicle-reg-expiry"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Insurance Expiry</label>
          <Input
            type="date"
            value={formData.insuranceExpiry}
            onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
            data-testid="input-vehicle-ins-expiry"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger data-testid="select-vehicle-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
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
          data-testid="textarea-vehicle-notes"
        />
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="bg-[#F56A07] hover:bg-[#d55a06]"
        data-testid={isNew ? "button-create-vehicle" : "button-update-vehicle"}
      >
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : isNew ? "Add Vehicle" : "Update Vehicle"}
      </Button>
    </div>
  );

  const getVehicleIcon = (type: string) => {
    const Icon = vehicleIcons[type.toLowerCase()] || Car;
    return <Icon size={20} className="text-gray-400" />;
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Vehicles</h1>
          <p className="text-gray-500 mt-1">Manage company and contractor vehicles</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#F56A07] hover:bg-[#d55a06]"
              onClick={() => setFormData(emptyVehicle)}
              data-testid="button-add-vehicle"
            >
              <Plus size={16} className="mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <VehicleForm onSubmit={handleCreate} isNew={true} />
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
      ) : vehicles?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No fleet vehicles yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles?.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-md transition-shadow" data-testid={`card-vehicle-${vehicle.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getVehicleIcon(vehicle.vehicleType)}
                    <div>
                      <h3 className="font-semibold capitalize">{vehicle.vehicleType}</h3>
                      <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={statusColors[vehicle.status || "available"]}>
                      {vehicle.status}
                    </Badge>
                    <Badge className={ownershipColors[vehicle.ownership || "company"]} variant="outline">
                      {vehicle.ownership}
                    </Badge>
                  </div>
                </div>
                
                {(vehicle.make || vehicle.model) && (
                  <p className="text-sm text-gray-600 mb-2">
                    {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(vehicle)}
                        data-testid={`button-edit-vehicle-${vehicle.id}`}
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                      </DialogHeader>
                      {selectedVehicle && <VehicleForm onSubmit={handleUpdate} isNew={false} />}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate(vehicle.id)}
                    data-testid={`button-delete-vehicle-${vehicle.id}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
