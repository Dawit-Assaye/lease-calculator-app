import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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

export default function LeaseForm() {
  const [totalCost, setTotalCost] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      utilitiesIncluded: false,
    },
  });

  const watchFields = watch([
    "startDate",
    "endDate",
    "monthlyRent",
    "maintenanceFees",
  ]);

  useEffect(() => {
    if (watchFields.startDate && watchFields.endDate) {
      const start = new Date(watchFields.startDate);
      const end = new Date(watchFields.endDate);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        end.getMonth() -
        start.getMonth();
      setDuration(months > 0 ? months : 0);
    }
  }, [watchFields.startDate, watchFields.endDate]);

  useEffect(() => {
    const rentTotal = (watchFields.monthlyRent || 0) * duration;
    const maintenanceTotal = (watchFields.maintenanceFees || 0) * duration;
    setTotalCost(rentTotal + maintenanceTotal);
  }, [duration, watchFields.monthlyRent, watchFields.maintenanceFees]);

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/leases", data);
      alert("Lease saved successfully!");
    } catch (error) {
      alert("Error saving lease.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 max-w-md mx-auto"
    >
      <label>
        Start Date:
        <input
          type="date"
          {...register("startDate")}
          className="block w-full"
        />
        {errors.startDate && (
          <p className="text-red-500">{errors.startDate.message}</p>
        )}
      </label>

      <label>
        End Date:
        <input type="date" {...register("endDate")} className="block w-full" />
        {errors.endDate && (
          <p className="text-red-500">{errors.endDate.message}</p>
        )}
      </label>

      <label>
        Monthly Rent Amount:
        <input
          type="number"
          {...register("monthlyRent")}
          className="block w-full"
        />
        {errors.monthlyRent && (
          <p className="text-red-500">{errors.monthlyRent.message}</p>
        )}
      </label>

      <label>
        Security Deposit:
        <input
          type="number"
          {...register("securityDeposit")}
          className="block w-full"
        />
        {errors.securityDeposit && (
          <p className="text-red-500">{errors.securityDeposit.message}</p>
        )}
      </label>

      <label>
        Additional Charges:
        <input
          type="number"
          {...register("additionalCharges")}
          className="block w-full"
        />
        {errors.additionalCharges && (
          <p className="text-red-500">{errors.additionalCharges.message}</p>
        )}
      </label>

      <label>
        Annual Rent Increase Percentage:
        <input
          type="number"
          step="0.01"
          {...register("annualRentIncrease")}
          className="block w-full"
        />
        {errors.annualRentIncrease && (
          <p className="text-red-500">{errors.annualRentIncrease.message}</p>
        )}
      </label>

      <label>
        Maintenance Fees (Monthly):
        <input
          type="number"
          {...register("maintenanceFees")}
          className="block w-full"
        />
        {errors.maintenanceFees && (
          <p className="text-red-500">{errors.maintenanceFees.message}</p>
        )}
      </label>

      <label>
        Late Payment Penalty:
        <input
          type="number"
          {...register("latePaymentPenalty")}
          className="block w-full"
        />
        {errors.latePaymentPenalty && (
          <p className="text-red-500">{errors.latePaymentPenalty.message}</p>
        )}
      </label>

      <label>
        Lease Type:
        <select {...register("leaseType")} className="block w-full">
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        {errors.leaseType && (
          <p className="text-red-500">{errors.leaseType.message}</p>
        )}
      </label>

      <label>
        Utilities Included:
        <input type="checkbox" {...register("utilitiesIncluded")} />
      </label>

      <p>Total Lease Cost: ${totalCost.toFixed(2)}</p>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save Lease
      </button>
    </form>
  );
}
