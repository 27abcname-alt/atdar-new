'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function approveListing(listingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Avtorizatsiyadan o'ting")

  // Check if moderator
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, successful_reviews_count')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'moderator') throw new Error("Ruxsat yo'q")

  // Update listing
  const { error: listingError } = await supabase
    .from('listings')
    .update({ 
      status: 'approved', 
      moderator_id: user.id, 
      is_verified: true,
      updated_at: new Date().toISOString() 
    })
    .eq('id', listingId)

  if (listingError) throw listingError

  // Update moderator stats
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      successful_reviews_count: (profile.successful_reviews_count || 0) + 1 
    })
    .eq('id', user.id)

  if (profileError) console.error("Profile update error:", profileError)

  revalidatePath('/moderator')
  revalidatePath(`/products/${listingId}`)
  redirect('/moderator')
}

export async function rejectListing(listingId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Avtorizatsiyadan o'ting")

  // Check if moderator
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'moderator') throw new Error("Ruxsat yo'q")

  // Update listing
  const { error } = await supabase
    .from('listings')
    .update({ 
      status: 'rejected', 
      moderator_id: user.id, 
      rejection_reason: reason,
      is_verified: false,
      updated_at: new Date().toISOString() 
    })
    .eq('id', listingId)

  if (error) throw error

  revalidatePath('/moderator')
  revalidatePath(`/products/${listingId}`)
  redirect('/moderator')
}
