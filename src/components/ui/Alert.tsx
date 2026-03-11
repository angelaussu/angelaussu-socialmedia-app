"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideAlert } from "@/store/uiSlice";
import { cn } from "@/lib/utils";
import { TickCircle, CloseCircle } from "iconsax-react";

export default function Alert() {
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.ui.alert);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => dispatch(hideAlert()), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, dispatch]);

  if (!alert) return null;

  return (
    <div
      className={cn(
        "fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full",
        "text-sm-regular text-white shadow-lg",
        alert.type === "success" ? "bg-green-600" : "bg-red-600"
      )}
    >
      {alert.type === "success" ? (
        <TickCircle size={18} color="white" variant="Bold" />
      ) : (
        <CloseCircle size={18} color="white" variant="Bold" />
      )}
      {alert.message}
    </div>
  );
}
