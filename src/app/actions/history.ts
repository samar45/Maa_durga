'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/cloudinary'

export async function saveHistoryEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!role) throw new Error('Unauthorized')

  const id = formData.get('id') as string | null
  const year = parseInt(formData.get('year') as string)
  const title = formData.get('title') as string
  const story_text = formData.get('story_text') as string
  const files = formData.getAll('images') as File[]

  const image_urls: string[] = []
  for (const file of files) {
    if (!file.size) continue
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImage(buffer, 'durga-maa-puja/history')
    image_urls.push(result.secure_url)
  }

  if (id) {
    const { data: existing } = await supabase.from('history').select('image_urls').eq('id', id).single()
    const merged = [...(existing?.image_urls ?? []), ...image_urls]
    await supabase.from('history').update({ year, title, story_text, image_urls: merged }).eq('id', id)
  } else {
    await supabase.from('history').insert({ year, title, story_text, image_urls })
  }

  revalidatePath('/history')
  redirect('/admin/history?success=1')
}

export async function removeHistoryImage(id: string, url: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: role } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
  if (!role) throw new Error('Unauthorized')

  const { data: existing } = await supabase.from('history').select('image_urls').eq('id', id).single()
  const image_urls = (existing?.image_urls ?? []).filter((u: string) => u !== url)
  // ponytail: only unlinks from the entry; the Cloudinary file stays (free tier is 25 GB). Delete there if space matters.
  await supabase.from('history').update({ image_urls }).eq('id', id)

  revalidatePath('/history')
  revalidatePath('/admin/history')
}
