'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/types'

async function requireSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (role?.role !== 'super_admin') throw new Error('Forbidden')
  return supabase
}

export async function addUser(formData: FormData) {
  const supabase = await requireSuperAdmin()

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as UserRole
  const password = formData.get('password') as string

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) throw new Error(error.message)

  const { error: roleError } = await supabase.from('user_roles').insert({
    user_id: data.user.id,
    role,
    name,
  })
  if (roleError) {
    await admin.auth.admin.deleteUser(data.user.id) // don't leave an orphan auth user
    throw new Error(roleError.message)
  }

  revalidatePath('/admin/users')
  redirect('/admin/users?success=1')
}

export async function removeUser(userId: string) {
  const supabase = await requireSuperAdmin()

  await supabase.from('user_roles').delete().eq('user_id', userId)
  await createAdminClient().auth.admin.deleteUser(userId)

  revalidatePath('/admin/users')
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await requireSuperAdmin()
  await supabase.from('user_roles').update({ role }).eq('user_id', userId)
  revalidatePath('/admin/users')
}
