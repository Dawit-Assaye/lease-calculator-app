"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import LeaseList from "~/components/LeaseList";
import { Loader2 } from "lucide-react";

const fetchSharedWithMeLeases = async () => {
  const { data } = await axiosInstance.get("/leases/shared-with-me/api");
  return data;
};

export default function SharedWithMeLeasesPage() {
  const {
    data: sharedLeases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shared-with-me-leases"],
    queryFn: fetchSharedWithMeLeases,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Failed to load shared leases</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <LeaseList
        mode="shared-with-me"
        leases={sharedLeases.map((lease) => ({
          ...lease.lease,
          sharedByEmail: lease.sharedByEmail,
        }))}
      />
    </div>
  );
}
