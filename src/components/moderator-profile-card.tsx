import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Briefcase, CheckCircle2, ShieldCheck } from "lucide-react";
import { Profile } from "@/types/database";

export function ModeratorProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card className="group relative overflow-hidden rounded-[32px] border-none bg-white shadow-2xl transition-all hover:shadow-primary/10">
      <div className="absolute top-0 h-24 w-full bg-gradient-to-r from-primary to-blue-600 opacity-90" />
      
      <CardContent className="relative pt-12 px-8 pb-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-1 shadow-xl">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-3xl font-black text-primary">
                {profile.full_name?.[0] || "M"}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white shadow-lg ring-4 ring-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900">{profile.full_name || "Moderator"}</h3>
          <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3">
            Official Moderator
          </Badge>

          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 transition-colors group-hover:bg-primary/5">
              <div className="flex justify-center mb-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xl font-black text-slate-900">{profile.rating || "5.0"}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reyting</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 transition-colors group-hover:bg-primary/5">
              <div className="flex justify-center mb-1">
                <Briefcase className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xl font-black text-slate-900">{profile.experience_years || 0} yil</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tajriba</p>
            </div>
          </div>

          <div className="mt-4 w-full rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-900">Tekshiruvlar</span>
            </div>
            <span className="text-xl font-black text-emerald-700">{profile.successful_reviews_count || 0} ta</span>
          </div>

          <p className="mt-6 text-xs font-medium text-slate-400 leading-relaxed italic">
            &quot;Sifat va ishonch bizning asosiy mezonimiz. Har bir e&apos;lonni sinchkovlik bilan tekshiramiz.&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
