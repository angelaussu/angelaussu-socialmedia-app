"use client";

import { InputHTMLAttributes, useState, forwardRef } from "react";
import { Eye, EyeSlash } from "iconsax-react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm-bold text-neutral-25">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full h-12 px-4 rounded-xl bg-neutral-950 border border-neutral-900",
              "text-md-regular text-neutral-25 placeholder:text-neutral-600",
              "outline-none focus:border-brand-200 transition-colors",
              isPassword && "pr-12",
              error && "border-red-500",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              {showPassword ? (
                <EyeSlash size={20} color="currentColor" />
              ) : (
                <Eye size={20} color="currentColor" />
              )}
            </button>
          )}
        </div>
        {error && (
          <span className="text-sm-regular text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
