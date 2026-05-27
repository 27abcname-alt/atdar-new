import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CheckerDetailClient } from "../checker-detail-client";

export default async function ModeratorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check moderator role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "moderator") redirect("/dashboard");

  // Fetch listing with images
  const { data: listing } = await supabase
    .from("listings")
    .select("*, images(*)")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  return <CheckerDetailClient listing={listing} images={listing.images || []} />;
}
