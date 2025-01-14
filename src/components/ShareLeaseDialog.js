import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ErrorMessage from "./ui/helpers/ErrorMessage";

export default function ShareLeaseDialog({ lease, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/leases/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaseId: lease.id, sharedWithEmail: email }),
      });

      if (!response.ok) throw new Error("Failed to share lease");
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share Lease #{lease.id}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleShare} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <ErrorMessage message={error} />}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sharing..." : "Share Lease"}
        </Button>
      </form>
    </DialogContent>
  );
}
