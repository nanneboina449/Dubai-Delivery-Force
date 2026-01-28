import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Mail, Phone, MapPin, Calendar, Building } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContractorApplication } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  onboarding: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
};

export default function ContractorsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContractor, setSelectedContractor] = useState<ContractorApplication | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const { data: contractors, isLoading } = useQuery<ContractorApplication[]>({
    queryKey: ["/api/admin/contractor-applications"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) => {
      return apiRequest("PATCH", `/api/admin/contractor-applications/${id}`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contractor-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Application updated successfully" });
      setSelectedContractor(null);
    },
    onError: () => {
      toast({ title: "Failed to update application", variant: "destructive" });
    },
  });

  const openDetailDialog = (contractor: ContractorApplication) => {
    setSelectedContractor(contractor);
    setEditStatus(contractor.status || "pending");
    setEditNotes(contractor.adminNotes || "");
  };

  const handleUpdate = () => {
    if (selectedContractor) {
      updateMutation.mutate({
        id: selectedContractor.id,
        status: editStatus,
        adminNotes: editNotes,
      });
    }
  };

  const getTotalFleet = (c: ContractorApplication) => {
    return (c.fleetMotorcycles || 0) + (c.fleetCars || 0) + (c.fleetVans || 0) + (c.fleetTrucks || 0);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contractor Applications</h1>
        <p className="text-gray-500 mt-1">Manage fleet partner registrations</p>
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
            <p className="text-gray-500">No contractor applications yet</p>
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
                      <h3 className="text-lg font-semibold">{contractor.companyName}</h3>
                      <Badge className={statusColors[contractor.status || "pending"]}>
                        {contractor.status || "pending"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building size={14} />
                        <span>{contractor.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{contractor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{contractor.emirate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Fleet: {getTotalFleet(contractor)} vehicles</span>
                      <span>Drivers: {contractor.totalDrivers}</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Applied: {contractor.createdAt ? new Date(contractor.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => openDetailDialog(contractor)}
                        data-testid={`button-view-contractor-${contractor.id}`}
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Contractor Application Details</DialogTitle>
                      </DialogHeader>
                      {selectedContractor && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Company Name</label>
                              <p className="font-medium">{selectedContractor.companyName || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Contact Person</label>
                              <p>{selectedContractor.contactPerson || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p>{selectedContractor.email || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Phone</label>
                              <p>{selectedContractor.phone || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Trade License</label>
                              <p>{selectedContractor.tradeLicense || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Emirate</label>
                              <p>{selectedContractor.emirate || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Years in Business</label>
                              <p>{selectedContractor.yearsInBusiness != null ? `${selectedContractor.yearsInBusiness} years` : "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Total Drivers</label>
                              <p>{selectedContractor.totalDrivers ?? "N/A"}</p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-500">Fleet Composition</label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <div className="p-3 bg-gray-50 rounded text-center">
                                <p className="text-lg font-bold">{selectedContractor.fleetMotorcycles ?? 0}</p>
                                <p className="text-xs text-gray-500">Motorcycles</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded text-center">
                                <p className="text-lg font-bold">{selectedContractor.fleetCars ?? 0}</p>
                                <p className="text-xs text-gray-500">Cars</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded text-center">
                                <p className="text-lg font-bold">{selectedContractor.fleetVans ?? 0}</p>
                                <p className="text-xs text-gray-500">Vans</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded text-center">
                                <p className="text-lg font-bold">{selectedContractor.fleetTrucks ?? 0}</p>
                                <p className="text-xs text-gray-500">Trucks</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Insurance Coverage</label>
                              <p>{selectedContractor.insuranceCoverage || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Current Clients</label>
                              <p>{selectedContractor.currentClients || "N/A"}</p>
                            </div>
                          </div>

                          {selectedContractor.additionalServices && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Additional Services</label>
                              <p className="mt-1">{selectedContractor.additionalServices}</p>
                            </div>
                          )}

                          {selectedContractor.additionalNotes && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Applicant Notes</label>
                              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedContractor.additionalNotes}</p>
                            </div>
                          )}

                          <div className="border-t pt-4 space-y-4">
                            <h4 className="font-semibold">Update Application</h4>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Status</label>
                              <Select value={editStatus} onValueChange={setEditStatus}>
                                <SelectTrigger data-testid="select-contractor-status">
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
                                data-testid="textarea-contractor-notes"
                              />
                            </div>
                            <Button 
                              onClick={handleUpdate} 
                              disabled={updateMutation.isPending}
                              className="bg-[#F56A07] hover:bg-[#d55a06]"
                              data-testid="button-update-contractor"
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
