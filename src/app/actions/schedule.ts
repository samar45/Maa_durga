'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ScheduleKind } from '@/types'

const KINDS: ScheduleKind[] = ['puja', 'aarti', 'breakfast', 'lunch', 'dinner', 'other']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!role) throw new Error('Unauthorized')

  return supabase
}

export async function saveScheduleItem(formData: FormData) {
  const supabase = await requireAdmin()

  const id = formData.get('id') as string | null
  const day_date = formData.get('day_date') as string
  const title = formData.get('title') as string
  const kind = formData.get('kind') as ScheduleKind

  if (!day_date || !title?.trim()) throw new Error('Date and title are required')
  if (!KINDS.includes(kind)) throw new Error('Invalid kind')

  const row = {
    day_date,
    day_label: (formData.get('day_label') as string) || null,
    kind,
    title: title.trim(),
    start_time: (formData.get('start_time') as string) || null,
    end_time: (formData.get('end_time') as string) || null,
    details: (formData.get('details') as string) || null,
  }

  const { error } = id
    ? await supabase.from('schedule').update(row).eq('id', id)
    : await supabase.from('schedule').insert(row)
  if (error) redirect(`/admin/schedule?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/schedule')
  redirect('/admin/schedule?success=1')
}

export async function deleteScheduleItem(id: string) {
  const supabase = await requireAdmin()

  const { error } = await supabase.from('schedule').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
}
