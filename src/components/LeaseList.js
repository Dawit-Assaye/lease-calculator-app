"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import LeaseForm from "~/components/LeaseForm";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import { Card } from "~/components/ui/card";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";

export default function LeaseList({ leases }) {
  const [editingLease, setEditingLease] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leaseToDelete, setLeaseToDelete] = useState(null);

  const handleEdit = (lease, e) => {
    e.stopPropagation();
    setEditingLease({
      id: lease.id,
      ...lease,
    });
    setIsModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsModalOpen(false);
    setEditingLease(null);
    window.location.reload();
  };

  const handleDeleteClick = (lease, e) => {
    e.stopPropagation();
    setLeaseToDelete(lease);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/leases/api/${leaseToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lease");
      }

      setIsDeleteModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting lease:", error);
    }
  };

  const leasesArray = Array.isArray(leases) ? leases : [];

  return (
    <>
      <Accordion type="single" collapsible className="space-y-2">
        {leasesArray.map((lease) => (
          <AccordionItem key={lease.id} value={lease.id.toString()}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    #{lease.id}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {new Date(lease.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-base font-semibold text-primary">
                    ${lease.monthlyRent}
                    <span className="text-xs text-primary/70">/month</span>
                  </span>
                  <span className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-md">
                    {lease.leaseType}
                  </span>
                  <div className="flex gap-2 ml-6 mr-4">
                    <Button
                      onClick={(e) => handleEdit(lease, e)}
                      className="p-2 bg-transparent hover:h-fit hover:w-fit hover:bg-primary/10 rounded-full transition-colors text-primary hover:scale-105 active:scale-95"
                      title="Edit"
                    >
                      <Icon icon="solar:pen-bold" width="16" />
                    </Button>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-transparent hover:h-fit hover:w-fit hover:bg-primary/10 rounded-full transition-colors text-primary hover:scale-105 active:scale-95"
                      title="Share"
                    >
                      <Icon icon="solar:share-bold" width="16" />
                    </Button>
                    <button
                      onClick={(e) => handleDeleteClick(lease, e)}
                      className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-destructive hover:scale-105 active:scale-95"
                      title="Delete"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" width="16" />
                    </button>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <Card className="bg-white border-dashed border-2 p-6 max-w-2xl mx-auto">
                <div className="text-center mb-6 border-b pb-4">
                  <h3 className="text-xl font-bold">LEASE AGREEMENT</h3>
                  <p className="text-sm text-muted-foreground">
                    Document #{lease.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(lease.startDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold border-b mb-3 pb-2">
                      PRIMARY CHARGES
                    </h4>
                    <div className="space-y-2">
                      <p className="flex justify-between text-sm">
                        <span>Monthly Rent</span>
                        <span className="font-mono">${lease.monthlyRent}</span>
                      </p>
                      <p className="flex justify-between text-sm">
                        <span>Security Deposit</span>
                        <span className="font-mono">
                          ${lease.securityDeposit}
                        </span>
                      </p>
                      <p className="flex justify-between text-sm">
                        <span>Additional Charges</span>
                        <span className="font-mono">
                          ${lease.additionalCharges}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold border-b mb-3 pb-2">
                      TERMS & CONDITIONS
                    </h4>
                    <div className="space-y-2">
                      <p className="flex justify-between text-sm">
                        <span>Lease Type</span>
                        <span className="font-medium">{lease.leaseType}</span>
                      </p>
                      <p className="flex justify-between text-sm">
                        <span>Annual Increase</span>
                        <span className="font-medium">
                          {lease.annualRentIncrease}%
                        </span>
                      </p>
                      <p className="flex justify-between text-sm">
                        <span>Utilities Included</span>
                        <span className="font-medium">
                          {lease.utilitiesIncluded ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold border-b mb-3 pb-2">
                      ADDITIONAL FEES
                    </h4>
                    <div className="space-y-2">
                      <p className="flex justify-between text-sm">
                        <span>Maintenance Fees</span>
                        <span className="font-mono">
                          ${lease.maintenanceFees}
                        </span>
                      </p>
                      <p className="flex justify-between text-sm">
                        <span>Late Payment Penalty</span>
                        <span className="font-mono">
                          ${lease.latePaymentPenalty}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <LeaseForm
            mode="update"
            initialData={editingLease}
            onSuccess={handleUpdateSuccess}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="text-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lease and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
