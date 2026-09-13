'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitFeedback(formData: FormData) {
  // Honeypot — bots fill it, humans never see it.
  if ((formData.get('website') as string)?.trim()) redirect('/feedback?sent=1')

  const message = ((formData.get('message') as string) || '').trim()
  if (!message || message.length > 1000) throw new Error('Message must be 1–1000 characters')

  const name = ((formData.get('name') as string) || '').trim().slice(0, 80) || null

  const ratingRaw = parseInt(formData.get('rating') as string)
  const rating = ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null

  const supabase = await createClient()
  const { error } = await supabase.from('feedback').insert({ name, message, rating })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/feedback')
  redirect('/feedback?sent=1')
}

export async function deleteFeedback(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!role) throw new Error('Unauthorized')

  await supabase.from('feedback').delete().eq('id', id)

  revalidatePath('/admin/feedback')
}
