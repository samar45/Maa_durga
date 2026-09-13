'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export async function uploadPhotos(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!role) throw new Error('Unauthorized')

  const yearId = formData.get('year_id') as string
  const caption = (formData.get('caption') as string) || null
  const files = formData.getAll('photos') as File[]

  for (const file of files) {
    if (!file.size) continue
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImage(buffer)

    await supabase.from('photos').insert({
      year_id: yearId,
      cloudinary_url: result.secure_url,
      public_id: result.public_id,
      caption,
      uploaded_by: user.id,
    })
  }

  revalidatePath('/gallery')
  revalidatePath('/')
  redirect('/admin/upload?success=1')
}

export async function deletePhoto(photoId: string, publicId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!role) throw new Error('Unauthorized')

  await deleteImage(publicId)
  await supabase.from('photos').delete().eq('id', photoId)

  revalidatePath('/gallery')
  revalidatePath('/')
}
