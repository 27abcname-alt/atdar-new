import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ModeratorProfileCard } from "@/components/moderator-profile-card";

export default async function ModeratorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if user is moderator
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "moderator") {
    redirect("/dashboard");
  }

  // Fetch pending listings
  const { data: pendingListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Stats & Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Checker Dashboard</h1>
            <p className="mt-2 text-slate-500 font-medium">Xush kelibsiz, moderator!</p>
          </div>
          
          <ModeratorProfileCard profile={profile} />

          <Card className="rounded-[32px] border-none bg-primary/5 p-8 shadow-sm">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Navbatda turganlar</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary">{pendingListings?.length || 0}</span>
              <span className="text-lg font-bold text-primary/60">ta e&apos;lon</span>
            </div>
          </Card>
        </div>

        {/* Right: Listings Table */}
        <div className="lg:col-span-8">
          <Card className="rounded-[32px] border-slate-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                    <Clock className="h-5 w-5 text-primary" />
                    Tekshirilishi kutilayotgan e&apos;lonlar
                  </CardTitle>
                  <CardDescription>Yangi qo&apos;shilgan va tekshiruvga yuborilgan e&apos;lonlar ro&apos;yxati</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingListings && pendingListings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/30">
                        <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Mahsulot</th>
                        <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Kategoriya</th>
                        <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pendingListings.map((listing) => (
                        <tr key={listing.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-100">
                                <Image 
                                  src={listing.image_url || "/placeholder.png"} 
                                  alt={listing.name} 
                                  fill 
                                  className="object-cover" 
                                />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{listing.name}</p>
                                <p className="text-xs text-slate-400 font-medium">ID: {listing.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <Badge variant="secondary" className="rounded-lg font-bold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-600 border-none">
                              {listing.category}
                            </Badge>
                          </td>
                          <td className="p-6 text-right">
                            <Button asChild className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/10">
                              <Link href={`/moderator/${listing.id}`}>
                                Tekshirish
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Navbat bo&apos;sh!</h3>
                  <p className="text-slate-500 mt-2">Hozircha tekshirilishi kerak bo&apos;lgan e&apos;lonlar yo&apos;q.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
