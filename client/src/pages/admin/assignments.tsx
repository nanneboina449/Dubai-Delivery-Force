import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, User, Building2, Car, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DriverAssignment, Driver, BusinessClient, FleetVehicle } from "@shared/schema";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const emptyAssignment = {
  driverId: "",
  businessClientId: "",
  vehicleId: "",
  startDate: "",
  endDate: "",
  shiftType: "",
  status: "active",
  notes: "",
};

export default function AssignmentsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssignment, setSelectedAssignment] = useState<DriverAssignment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyAssignment);

  const { data: assignments, isLoading } = useQuery<DriverAssignment[]>({
    queryKey: ["/api/admin/driver-assignments"],
  });

  const { data: drivers } = useQuery<Driver[]>({
    queryKey: ["/api/admin/drivers"],
  });

  const { data: clients } = useQuery<BusinessClient[]>({
    queryKey: ["/api/admin/business-clients"],
  });

  const { data: vehicles } = useQuery<FleetVehicle[]>({
    queryKey: ["/api/admin/fleet-vehicles"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyAssignment) => {
      return apiRequest("POST", "/api/admin/driver-assignments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/driver-assignments"] });
      toast({ title: "Assignment created successfully" });
      setIsCreating(false);
      setFormData(emptyAssignment);
    },
    onError: () => {
      toast({ title: "Failed to create assignment", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof emptyAssignment>) => {
      return apiRequest("PATCH", `/api/admin/driver-assignments?id=${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/driver-assignments"] });
      toast({ title: "Assignment updated successfully" });
      setSelectedAssignment(null);
    },
    onError: () => {
      toast({ title: "Failed to update assignment", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/driver-assignments?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/driver-assignments"] });
      toast({ title: "Assignment removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove assignment", variant: "destructive" });
    },
  });

  const openEditDialog = (assignment: DriverAssignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      driverId: assignment.driverId,
      businessClientId: assignment.businessClientId,
      vehicleId: assignment.vehicleId || "",
      startDate: assignment.startDate,
      endDate: assignment.endDate || "",
      shiftType: assignment.shiftType || "",
      status: assignment.status,
      notes: assignment.notes || "",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (selectedAssignment) {
      updateMutation.mutate({ id: selectedAssignment.id, ...formData });
    }
  };

  const getDriverName = (id: string) => drivers?.find(d => d.id === id)?.fullName || "Unknown Driver";
  const getClientName = (id: string) => clients?.find(c => c.id === id)?.companyName || "Unknown Client";
  const getVehiclePlate = (id: string) => vehicles?.find(v => v.id === id)?.plateNumber || null;

  const AssignmentForm = ({ onSubmit, isNew }: { onSubmit: () => void; isNew: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Driver *</label>
          <Select value={formData.driverId} onValueChange={(v) => setFormData({ ...formData, driverId: v })}>
            <SelectTrigger data-testid="select-assignment-driver">
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              {drivers?.filter(d => d.status === "active").map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.fullName} - {driver.vehicleType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Business Client *</label>
          <Select value={formData.businessClientId} onValueChange={(v) => setFormData({ ...formData, businessClientId: v })}>
            <SelectTrigger data-testid="select-assignment-client">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients?.filter(c => c.status === "active").map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.companyName} - {client.emirate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Vehicle (Optional)</label>
          <Select value={formData.vehicleId} onValueChange={(v) => setFormData({ ...formData, vehicleId: v })}>
            <SelectTrigger data-testid="select-assignment-vehicle">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Vehicle</SelectItem>
              {vehicles?.filter(v => v.status === "available" || v.status === "assigned").map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.vehicleType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Shift Type</label>
          <Select value={formData.shiftType} onValueChange={(v) => setFormData({ ...formData, shiftType: v })}>
            <SelectTrigger data-testid="select-assignment-shift">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
              <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
              <SelectItem value="full-day">Full Day</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Start Date *</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            data-testid="input-assignment-start"
          />
        </div>
        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            data-testid="input-assignment-end"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger data-testid="select-assignment-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this assignment..."
          data-testid="textarea-assignment-notes"
        />
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="bg-[#F56A07] hover:bg-[#d55a06]"
        data-testid={isNew ? "button-create-assignment" : "button-update-assignment"}
      >
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : isNew ? "Create Assignment" : "Update Assignment"}
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Assignments</h1>
          <p className="text-gray-500 mt-1">Assign drivers to business clients</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#F56A07] hover:bg-[#d55a06]"
              onClick={() => setFormData(emptyAssignment)}
              data-testid="button-add-assignment"
            >
              <Plus size={16} className="mr-2" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <AssignmentForm onSubmit={handleCreate} isNew={true} />
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
      ) : assignments?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No driver assignments yet</p>
            <p className="text-sm text-gray-400 mt-2">Create assignments to link drivers with business clients</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments?.map((assignment) => {
            const vehiclePlate = assignment.vehicleId ? getVehiclePlate(assignment.vehicleId) : null;
            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow" data-testid={`card-assignment-${assignment.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                          <User size={16} className="text-gray-500" />
                          <span className="font-medium">{getDriverName(assignment.driverId)}</span>
                        </div>
                        <ArrowRight size={16} className="text-gray-400" />
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                          <Building2 size={16} className="text-blue-600" />
                          <span className="font-medium text-blue-700">{getClientName(assignment.businessClientId)}</span>
                        </div>
                        <Badge className={statusColors[assignment.status || "active"]}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {assignment.startDate}
                            {assignment.endDate && ` - ${assignment.endDate}`}
                          </span>
                        </div>
                        {assignment.shiftType && (
                          <span className="capitalize">Shift: {assignment.shiftType}</span>
                        )}
                        {vehiclePlate && (
                          <div className="flex items-center gap-1">
                            <Car size={14} />
                            <span>{vehiclePlate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => openEditDialog(assignment)}
                            data-testid={`button-edit-assignment-${assignment.id}`}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Assignment</DialogTitle>
                          </DialogHeader>
                          {selectedAssignment && <AssignmentForm onSubmit={handleUpdate} isNew={false} />}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(assignment.id)}
                        data-testid={`button-delete-assignment-${assignment.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
