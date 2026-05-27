import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditListingForm } from "./edit-listing-form";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  // Only the owner can edit
  if (product.user_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 min-h-screen">
      <EditListingForm initialData={product} />
    </div>
  );
}
