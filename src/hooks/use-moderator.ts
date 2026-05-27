"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { approveListing, rejectListing } from "@/app/moderator/actions";

const rejectionSchema = z.object({
  reason: z.string().min(5, "Iltimos, rad etish sababini batafsilroq yozing (kamida 5 ta harf)"),
});

type RejectionValues = z.infer<typeof rejectionSchema>;

export function useModerator(listingId: string) {
  const [loading, setLoading] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectionValues>({
    resolver: zodResolver(rejectionSchema),
  });

  const handleApprove = async () => {
    if (!confirm("Ushbu e'lonni tasdiqlashni xohlaysizmi?")) return;
    setLoading(true);
    try {
      await approveListing(listingId);
    } catch (error) {
      alert("Xatolik yuz berdi");
      setLoading(false);
    }
  };

  const onRejectSubmit = async (data: RejectionValues) => {
    setLoading(true);
    try {
      await rejectListing(listingId, data.reason);
    } catch (error) {
      alert("Xatolik yuz berdi");
      setLoading(false);
    }
  };

  return {
    loading,
    isRejecting,
    setIsRejecting,
    handleApprove,
    handleReject: handleSubmit(onRejectSubmit),
    rejectionForm: {
      register,
      errors,
    },
  };
}
