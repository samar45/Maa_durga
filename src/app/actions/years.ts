'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function addYear(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const year = parseInt(formData.get('year') as string)
  const theme = (formData.get('theme') as string) || null
  const description = (formData.get('description') as string) || null

  if (isNaN(year)) throw new Error('Invalid year')

  const { error } = await supabase.from('years').insert({ year, theme, description })
  if (error) throw new Error(error.message)

  revalidatePath('/gallery')
  redirect('/admin/years?success=1')
}

export async function updateYear(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const theme = (formData.get('theme') as string) || null
  const description = (formData.get('description') as string) || null

  await supabase.from('years').update({ theme, description }).eq('id', id)

  revalidatePath('/gallery')
  redirect('/admin/years?success=1')
}
