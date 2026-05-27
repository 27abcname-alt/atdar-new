"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/dashboard/actions";

export function useProfile(initialProfile: { full_name: string; phone_number: string } | null) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateProfile = async (formData: FormData) => {
    setError(null);
    setSuccess(false);
    
    startTransition(async () => {
      try {
        await updateProfile(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
      }
    });
  };

  return {
    isPending,
    error,
    success,
    handleUpdateProfile,
  };
}
