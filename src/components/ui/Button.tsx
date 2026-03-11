import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "h-12 px-6 rounded-full text-md-bold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-brand-300 text-white",
        variant === "outline" && "border border-neutral-900 text-neutral-25 bg-transparent",
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
