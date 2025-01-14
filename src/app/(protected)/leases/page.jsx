"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import LeaseList from "~/components/LeaseList";
import { Loader2 } from "lucide-react";

const fetchLeases = async () => {
  const { data } = await axiosInstance.get("/leases/api");
  return data;
};

export default function LeasesPage() {
  const {
    data: leases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leases"],
    queryFn: fetchLeases,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Failed to load leases</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <LeaseList leases={leases} />
    </div>
  );
}
