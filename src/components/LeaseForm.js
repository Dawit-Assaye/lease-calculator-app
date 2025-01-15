"use client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { Card } from "~/components/ui/card";

const leaseSchema = z.object({
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
  monthlyRent: z.number().min(0, "Monthly rent must be positive"),
  securityDeposit: z.number().min(0, "Security deposit must be positive"),
  additionalCharges: z.number().min(0, "Additional charges must be positive"),
  annualRentIncrease: z.number().min(0, "Annual increase must be positive"),
  maintenanceFees: z.number().min(0, "Maintenance fees must be positive"),
  latePaymentPenalty: z.number().min(0, "Penalty must be positive"),
  leaseType: z.enum(["Residential", "Commercial"]),
  utilitiesIncluded: z.boolean(),
});

export default function LeaseForm({
  mode = "new",
  initialData = null,
  onSuccess,
}) {
  const [calculations, setCalculations] = useState({
    totalRent: 0,
    totalMaintenance: 0,
    totalWithIncrease: 0,
    monthlyTotal: 0,
    duration: 0,
  });
  const mutation = useMutation({
    mutationFn: (data) => {
      if (mode === "new") {
        return axios.post("/leases/api", data);
      } else {
        return axios.put(`/leases/api/${initialData.id}`, {
          ...data,
          id: initialData.id,
        });
      }
    },
    onSuccess: () => {
      toast.success(
        mode === "new"
          ? "Lease saved successfully!"
          : "Lease updated successfully!"
      );
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        mode === "new" ? "Error saving lease." : "Error updating lease."
      );
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      utilitiesIncluded: false,
      monthlyRent: 0,
      maintenanceFees: 0,
      annualRentIncrease: 0,
      additionalCharges: 0,
      leaseType: "Residential",
      ...(initialData || {}), // Populate form with initialData if provided
    },
  });

  const watchAllFields = watch();

  const onSubmit = (data) => {
    console.log("Form data:", data);
    console.log("Form errors:", errors);
    const formData = {
      ...data,
    };
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (mode === "update" && initialData) {
      reset(initialData);
    }
  }, [initialData, mode, reset]);

  useEffect(() => {
    const calculateTotals = () => {
      const calculations = calculateLeaseTotals(watchAllFields);
      if (calculations) {
        setCalculations({
          totalRent: calculations.baseRent,
          totalMaintenance: calculations.totalMaintenance,
          totalWithIncrease: calculations.totalWithIncrease,
          monthlyTotal: calculations.monthlyAverage,
          duration: calculations.duration,
        });
      }
    };

    calculateTotals();
  }, [
    watchAllFields.startDate,
    watchAllFields.endDate,
    watchAllFields.monthlyRent,
    watchAllFields.maintenanceFees,
    watchAllFields.additionalCharges,
    watchAllFields.annualRentIncrease,
  ]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "new" ? "Create New Lease" : "Update Lease"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" {...register("startDate")} />
            {errors.startDate && (
              <span className="text-red-500 text-sm">
                {errors.startDate.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" {...register("endDate")} />
            {errors.endDate && (
              <span className="text-red-500 text-sm">
                {errors.endDate.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Monthly Rent ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("monthlyRent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Security Deposit ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("securityDeposit", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Charges ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("additionalCharges", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Annual Rent Increase (%)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("annualRentIncrease", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Maintenance Fees ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("maintenanceFees", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Late Payment Penalty ($)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("latePaymentPenalty", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Lease Type</Label>
            <Controller
              name="leaseType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center space-x-2 h-full">
            <Checkbox {...register("utilitiesIncluded")} />
            <Label>Utilities Included</Label>
          </div>
        </div>

        <Card className="p-4 bg-slate-50">
          <h3 className="font-semibold mb-2">Lease Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-semibold" suppressHydrationWarning>
                {calculations.duration} months
              </p>
            </div>
            <div>
              <p className="text-gray-600">Base Total Rent</p>
              <p className="font-semibold" suppressHydrationWarning>
                ${calculations.totalRent.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total with Increases</p>
              <p className="font-semibold" suppressHydrationWarning>
                ${calculations.totalWithIncrease.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Maintenance</p>
              <p className="font-semibold" suppressHydrationWarning>
                ${calculations.totalMaintenance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Average Monthly Cost</p>
              <p className="font-semibold" suppressHydrationWarning>
                ${calculations.monthlyTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading
              ? mode === "new"
                ? "Saving..."
                : "Updating..."
              : mode === "new"
              ? "Save Lease"
              : "Update Lease"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

const calculateLeaseTotals = (data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (!data.startDate || !data.endDate) return null;

  // 1. Duration Calculation
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = months / 12;

  // 2. Base Total Rent
  const baseRent = (data.monthlyRent || 0) * months;

  // 3. Annual Increase Calculation with Compound Interest
  let totalWithIncrease = baseRent;
  const annualIncrease = (data.annualRentIncrease || 0) / 100;

  for (let i = 1; i < years; i++) {
    totalWithIncrease += baseRent * Math.pow(1 + annualIncrease, i);
  }

  // 4. Total Maintenance
  const totalMaintenance = (data.maintenanceFees || 0) * months;

  // Additional Charges Total
  const additionalChargesTotal = (data.additionalCharges || 0) * months;

  // 5. Total Cost Calculation
  const totalCost =
    totalWithIncrease +
    totalMaintenance +
    additionalChargesTotal +
    (data.securityDeposit || 0);

  // Monthly Average
  const monthlyAverage = totalCost / months;

  return {
    duration: months,
    baseRent: baseRent,
    totalWithIncrease: totalWithIncrease,
    totalMaintenance: totalMaintenance,
    totalCost: totalCost,
    monthlyAverage: monthlyAverage,
    additionalChargesTotal: additionalChargesTotal,
    securityDeposit: data.securityDeposit || 0,
  };
};
