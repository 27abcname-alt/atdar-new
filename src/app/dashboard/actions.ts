'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string, imageUrl: string | null) {
  const supabase = await createClient()

  // 1. Delete from database
  const { error: dbError } = await supabase
    .from('listings')
    .delete()
    .eq('id', productId)

  if (dbError) throw new Error(dbError.message)

  // 2. Delete from storage if image exists
  if (imageUrl) {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";
    // Extract path from URL (assuming storage structure)
    // Example URL: .../storage/v1/object/public/products/filename.jpg
    const path = imageUrl.split('/').pop()
    if (path) {
      const { error: storageError } = await supabase.storage.from(bucketName).remove([`products/${path}`])
      if (storageError) {
        console.error("Storage error details (Delete):", storageError)
      }
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/products')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const fullName = formData.get('full_name') as string
  const phoneNumber = formData.get('phone_number') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone_number: phoneNumber,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}
