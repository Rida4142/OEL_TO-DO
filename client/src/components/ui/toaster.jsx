// src/components/ui/toaster.jsx
import React from "react";
import { useToast } from "@/contexts/ToastContext"; // or your useToast hook

export function Toaster() {
  const { toasts } = useToast(); // get your current toasts

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white text-black p-3 rounded shadow-md"
        >
          {toast.title || toast.message}
        </div>
      ))}
    </div>
  );
}
