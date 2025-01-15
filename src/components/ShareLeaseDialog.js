import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ErrorMessage from "./ui/helpers/ErrorMessage";
import { toast } from "react-hot-toast";

export default function ShareLeaseDialog({ lease, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/leases/share/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaseId: lease.id,
          sharedWithEmail: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toast.success(`Lease successfully shared with ${data.email}`);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to share lease");
      return Promise.reject(error.message);
    }
  };

  return (
    <DialogContent className="text-primary">
      <DialogHeader>
        <DialogTitle>Share Lease #{lease.id}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && <ErrorMessage message={errors.email.message} />}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sharing..." : "Share Lease"}
        </Button>
      </form>
    </DialogContent>
  );
}
