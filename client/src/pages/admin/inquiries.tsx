import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Mail, Phone, MapPin, Calendar, Building, Users } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessInquiry } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  onboarding: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
};

export default function InquiriesAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<BusinessInquiry | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const { data: inquiries, isLoading } = useQuery<BusinessInquiry[]>({
    queryKey: ["/api/admin/business-inquiries"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) => {
      return apiRequest("PATCH", `/api/admin/business-inquiries?id=${id}`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Inquiry updated successfully" });
      setSelectedInquiry(null);
    },
    onError: () => {
      toast({ title: "Failed to update inquiry", variant: "destructive" });
    },
  });

  const openDetailDialog = (inquiry: BusinessInquiry) => {
    setSelectedInquiry(inquiry);
    setEditStatus(inquiry.status || "pending");
    setEditNotes(inquiry.adminNotes || "");
  };

  const handleUpdate = () => {
    if (selectedInquiry) {
      updateMutation.mutate({
        id: selectedInquiry.id,
        status: editStatus,
        adminNotes: editNotes,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Inquiries</h1>
        <p className="text-gray-500 mt-1">Manage business partnership requests</p>
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
      ) : inquiries?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No business inquiries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries?.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow" data-testid={`card-inquiry-${inquiry.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{inquiry.companyName}</h3>
                      <Badge className={statusColors[inquiry.status || "pending"]}>
                        {inquiry.status || "pending"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building size={14} />
                        <span>{inquiry.industry}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{inquiry.emirate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>Needs {inquiry.ridersNeeded} riders</span>
                      </div>
                      <span>Volume: {inquiry.deliveryVolume}</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Submitted: {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => openDetailDialog(inquiry)}
                        data-testid={`button-view-inquiry-${inquiry.id}`}
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Business Inquiry Details</DialogTitle>
                      </DialogHeader>
                      {selectedInquiry && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Company Name</label>
                              <p className="font-medium">{selectedInquiry.companyName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Contact Person</label>
                              <p>{selectedInquiry.contactPerson}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p>{selectedInquiry.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Phone</label>
                              <p>{selectedInquiry.phone}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Industry</label>
                              <p>{selectedInquiry.industry}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Company Size</label>
                              <p>{selectedInquiry.companySize}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Emirate</label>
                              <p>{selectedInquiry.emirate}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Delivery Volume</label>
                              <p>{selectedInquiry.deliveryVolume}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Vehicle Types Needed</label>
                              <p>{selectedInquiry.vehicleTypesNeeded}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Riders Needed</label>
                              <p>{selectedInquiry.ridersNeeded}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Start Date</label>
                              <p>{selectedInquiry.startDate}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Contract Duration</label>
                              <p>{selectedInquiry.contractDuration}</p>
                            </div>
                          </div>

                          {selectedInquiry.specialRequirements && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Special Requirements</label>
                              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedInquiry.specialRequirements}</p>
                            </div>
                          )}

                          {selectedInquiry.additionalNotes && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                              <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedInquiry.additionalNotes}</p>
                            </div>
                          )}

                          <div className="border-t pt-4 space-y-4">
                            <h4 className="font-semibold">Update Inquiry</h4>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Status</label>
                              <Select value={editStatus} onValueChange={setEditStatus}>
                                <SelectTrigger data-testid="select-inquiry-status">
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
                                placeholder="Add internal notes about this inquiry..."
                                data-testid="textarea-inquiry-notes"
                              />
                            </div>
                            <Button 
                              onClick={handleUpdate} 
                              disabled={updateMutation.isPending}
                              className="bg-[#F56A07] hover:bg-[#d55a06]"
                              data-testid="button-update-inquiry"
                            >
                              {updateMutation.isPending ? "Updating..." : "Update Inquiry"}
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
