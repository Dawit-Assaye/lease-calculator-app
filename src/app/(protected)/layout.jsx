"use client";
import { useSession, SessionProvider, signOut } from "next-auth/react";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import LeaseForm from "~/components/LeaseForm";
import { toast } from "react-hot-toast";

function LayoutContent({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleLeaseSuccess = () => {
    setOpen(false);
    toast({
      title: "Success",
      description: "Lease created successfully",
      variant: "success",
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute top-6 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:user-line-duotone"
            className="text-primary font-extrabold h-6 w-6"
          />
          <span className="text-primary">{session?.user?.email}</span>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-transparent text-primary border-2 hover:text-card hover:border-primary px-4 py-2 rounded-md"
        >
          <Icon icon="mdi:logout" />
        </Button>
      </div>
      <div className="absolute top-6 right-4"></div>
      <div className="h-[85vh] w-full max-w-5xl  px-4 py-8">
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-primary font-bold">Leases</h1>
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
              {pathname.startsWith("/leases") && (
                <>
                  <Link href="/leases" className="hover:text-secondary">
                    Leases
                  </Link>
                  {pathname !== "/leases" && (
                    <Icon icon="mdi:chevron-right" className="h-4 w-4" />
                  )}
                </>
              )}
              <span className="text-secondary">
                {pathname === "/leases"
                  ? ""
                  : pathname === "/leases/shared"
                  ? "Shared Leases"
                  : "Shared with me"}
              </span>
            </nav>
          </div>
          <Dialog open={open} onOpenChange={setOpen} className="text-primary">
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Icon icon="mdi:plus" className="mr-2 font-bold" />
                Add New Lease
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <LeaseForm mode="new" onSuccess={handleLeaseSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-12">
          <nav className="flex gap-8">
            <Link
              href="/leases"
              className={`pb-4 ${
                pathname === "/leases"
                  ? "border-b-2 border-secondary font-semibold text-secondary"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              All
            </Link>
            <Link
              href="/leases/shared"
              className={`pb-4 ${
                pathname === "/leases/shared"
                  ? "border-b-2 border-secondary font-semibold text-secondary"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              Shared
            </Link>
            <Link
              href="/leases/shared-with-me"
              className={`pb-4 ${
                pathname === "/leases/shared-with-me"
                  ? "border-b-2 border-secondary font-semibold text-secondary"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              Shared with me
            </Link>
          </nav>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}
