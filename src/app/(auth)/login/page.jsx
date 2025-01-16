"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ErrorMessage from "~/components/ui/helpers/ErrorMessage";
import Link from "next/link";

const authSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email format"),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: "all",
  });

  const handleLogin = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setGlobalError("Invalid email or password");
    } else {
      router.push("/leases");
      router.refresh();
      setGlobalError("");
    }
  };

  const handlePasswordVisibleToggle = () =>
    setVisiblePassword(!visiblePassword);

  return (
    <form
      className="flex w-full flex-col gap-8 max-w-md mx-auto p-8"
      onSubmit={handleSubmit(handleLogin)}
    >
      <div className="flex flex-grow flex-row items-center gap-1">
        <span className="text-xl font-medium">Welcome to</span>
        <span className="text-secondary text-xl font-bold">Lease App</span>
      </div>

      <h1 className="text-3xl font-bold text-title">Signin</h1>

      {globalError && <ErrorMessage message={globalError} />}

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <Input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-secondary"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-secondary"
            type={visiblePassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={handlePasswordVisibleToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Icon
              icon={visiblePassword ? "mdi:eye-off" : "mdi:eye"}
              className="w-5 h-5 text-primary"
            />
          </button>
          {errors.password && (
            <ErrorMessage message={errors.password.message} />
          )}
        </div>
      </div>

      <Button
        className="w-full rounded-md bg-primary text-white py-3 hover:bg-primary/90 transition-colors"
        type="submit"
      >
        Signin
      </Button>
      <div className="flex flex-row items-center justify-end gap-2">
        <span className="text-md">Don't have an account?</span>
        <Link href={"/register"} className="text-md text-secondary underline">
          Signup
        </Link>
      </div>
    </form>
  );
}
