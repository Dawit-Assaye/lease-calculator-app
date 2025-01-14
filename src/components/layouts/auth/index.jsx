import React from "react";
import Image from "next/image";

import { CopyRight } from "~/components/ui/CopyRight";

export default function OnboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full flex-row">
      <div className="left-side hidden h-screen w-1/2 flex-col items-end justify-between bg-primary lg:flex">
        <div className="mt-40 flex w-full flex-col px-24 text-primary-foreground">
          <h1 className="truncate text-3xl font-bold">Lease App</h1>
          <h2 className="pt-4 text-xl text-dark-200">
            Lease calculator and management for your business
          </h2>
        </div>
        <div className="relative w-full">
          <div className="relative h-[500px] w-full">
            <Image
              fill
              src="/auth-left-side.png"
              className="hidden md:block"
              alt="Car Image"
            />
          </div>
        </div>
        <CopyRight />
      </div>
      <div className="right-side flex h-screen w-full items-center justify-center bg-card">
        <div className="sm:11/12 mx-2 flex h-auto w-full flex-col rounded-xl bg-primary-foreground p-8 pb-12 text-primary sm:mx-4 md:w-5/6 xl:w-3/4 2xl:w-3/5 min-[2000px]:w-5/12">
          {children}
        </div>
      </div>
    </div>
  );
}
