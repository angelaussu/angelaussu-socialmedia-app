"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/schemas";
import { authApi, setToken } from "@/lib/api";
import { setUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { AuthResponse } from "@/types";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

function SocialityLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    try {
      const { confirmPassword: _, ...payload } = data;
      const res = (await authApi.register(payload)) as AuthResponse;
      setToken(res.token);
      dispatch(setUser(res.user));
      router.push("/feed");
    } catch (err: unknown) {
      const apiErr = err as {
        message?: string;
        errors?: Record<string, string[]>;
        data?: Array<{ path: string; msg: string }>;
      };
      if (Array.isArray(apiErr?.data) && apiErr.data.length > 0) {
        setServerError(apiErr.data.map((e) => e.msg).join(" | "));
      } else if (apiErr?.errors) {
        const details = Object.entries(apiErr.errors)
          .map(([f, msgs]) => `${f}: ${(msgs as string[]).join(", ")}`)
          .join(" | ");
        setServerError(details);
      } else {
        setServerError(apiErr?.message || "Registration failed. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-base-black flex items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Decorative blobs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-300 opacity-15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-brand-200 opacity-10 blur-[100px] rounded-full pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[523px] bg-neutral-950/80 border border-neutral-900 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <SocialityLogo />
            <span className="text-display-xs text-neutral-25">Sociality</span>
          </div>
          <h1 className="text-xl-bold text-neutral-25">Register</h1>
        </div>

        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm-regular text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <InputField
            label="Name"
            type="text"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register("name")}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
          <InputField
            label="Username"
            type="text"
            placeholder="Enter your username"
            error={errors.username?.message}
            {...register("username")}
          />
          <InputField
            label="Number Phone"
            type="tel"
            placeholder="Enter your number phone"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Enter your confirm password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
            Submit
          </Button>
        </form>

        <p className="text-md-regular text-neutral-400 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-200 text-md-bold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
