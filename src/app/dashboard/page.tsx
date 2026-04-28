import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch listings
  const { data: listings } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Calculate stats
  const stats = {
    total: listings?.length || 0,
    verified: listings?.filter(l => l.is_verified).length || 0,
    views: listings?.reduce((acc, curr) => acc + (curr.views_count || 0), 0) || 0
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Dashboard</h1>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-slate-500 font-medium">Xush kelibsiz, {profile?.full_name || user.email}</p>
            <div className="h-1 w-1 rounded-full bg-slate-300" />
            <p className="text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              Jami {listings?.length || 0} ta e&apos;lon
            </p>
          </div>
        </div>
      </div>

      <DashboardClient 
        listings={listings || []} 
        profile={profile} 
        stats={stats} 
      />
    </div>
  )
}
