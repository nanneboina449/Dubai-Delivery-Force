import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RiderApplication, ApplicationStatus } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  onboarding: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
};

export default function RidersAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState<RiderApplication | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const { data: riders, isLoading } = useQuery<RiderApplication[]>({
    queryKey: ["/api/admin/rider-applications"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) => {
      return apiRequest("PATCH", `/api/admin/rider-applications/${id}`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rider-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Application updated successfully" });
      setSelectedRider(null);
    },
    onError: () => {
      toast({ title: "Failed to update application", variant: "destructive" });
    },
  });

  const openDetailDialog = (rider: RiderApplication) => {
    setSelectedRider(rider);
    setEditStatus(rider.status || "pending");
    setEditNotes(rider.adminNotes || "");
  };

  const handleUpdate = () => {
    if (selectedRider) {
      updateMutation.mutate({
        id: selectedRider.id,
        status: editStatus,
        adminNotes: editNotes,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rider Applications</h1>
        <p className="text-gray-500 mt-1">Manage delivery rider applications</p>
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
      ) : riders?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No rider applications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {riders?.map((rider) => (
            <Card key={rider.id} className="hover:shadow-md transition-shadow" data-testid={`card-rider-${rider.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{rider.fullName}</h3>
                      <Badge className={statusColors[rider.status || "pending"]}>
                        {rider.status || "pending"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{rider.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{rider.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{rider.currentLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>Applied: {rider.createdAt ? new Date(rider.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => openDetailDialog(rider)}
                        data-testid={`button-view-rider-${rider.id}`}
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Rider Application Details</DialogTitle>
                      </DialogHeader>
                      {selectedRider && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Full Name</label>
                              <p className="font-medium">{selectedRider.fullName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p>{selectedRider.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Phone</label>
                              <p>{selectedRider.phone}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Nationality</label>
                              <p>{selectedRider.nationality}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Current Location</label>
                              <p>{selectedRider.currentLocation}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Visa Status</label>
                              <p>{selectedRider.visaStatus}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">UAE Driving License</label>
                              <p>{selectedRider.hasUaeDrivingLicense}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">License Type</label>
                              <p>{selectedRider.licenseType || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Experience</label>
                              <p>{selectedRider.yearsOfExperience} years</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                              <p>{selectedRider.vehicleType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Owns Vehicle</label>
                              <p>{selectedRider.ownsVehicle}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Available to Start</label>
                              <p>{selectedRider.availableToStart}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Preferred Work Area</label>
                              <p>{selectedRider.preferredWorkArea}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">English Proficiency</label>
                              <p>{selectedRider.englishProficiency}</p>
                            </div>
                          </div>

                          {selectedRider.additionalNotes && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Applicant Notes</label>
                              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedRider.additionalNotes}</p>
                            </div>
                          )}

                          <div className="border-t pt-4 space-y-4">
                            <h4 className="font-semibold">Update Application</h4>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Status</label>
                              <Select value={editStatus} onValueChange={setEditStatus}>
                                <SelectTrigger data-testid="select-rider-status">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="reviewing">Reviewing</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="onboarding">Onboarding</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Admin Notes</label>
                              <Textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Add internal notes about this application..."
                                data-testid="textarea-rider-notes"
                              />
                            </div>
                            <Button 
                              onClick={handleUpdate} 
                              disabled={updateMutation.isPending}
                              className="bg-[#F56A07] hover:bg-[#d55a06]"
                              data-testid="button-update-rider"
                            >
                              {updateMutation.isPending ? "Updating..." : "Update Application"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
