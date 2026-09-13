'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function setCoverPhoto(yearId: string, photoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!role) throw new Error('Unauthorized')

  await supabase.from('years').update({ cover_photo_id: photoId }).eq('id', yearId)

  revalidatePath('/gallery')
}
