import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!roleData) redirect('/?error=not_authorized')

  const isSuperAdmin = roleData.role === 'super_admin'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson-dark text-white px-4 py-3 flex flex-wrap items-center justify-between gap-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="font-semibold">Admin Panel</span>
          <Link href="/admin/upload" className="text-amber-200 hover:text-white transition-colors">
            Upload Photos
          </Link>
          <Link href="/admin/years" className="text-amber-200 hover:text-white transition-colors">
            Manage Years
          </Link>
          <Link href="/admin/photos" className="text-amber-200 hover:text-white transition-colors">
            Delete Photos
          </Link>
          <Link href="/admin/history" className="text-amber-200 hover:text-white transition-colors">
            Edit History
          </Link>
          <Link href="/admin/schedule" className="text-amber-200 hover:text-white transition-colors">
            Schedule
          </Link>
          <Link href="/admin/feedback" className="text-amber-200 hover:text-white transition-colors">
            Feedback
          </Link>
          {isSuperAdmin && (
            <Link href="/admin/users" className="text-amber-200 hover:text-white transition-colors">
              Users
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 text-amber-200 text-xs">
          <span>{roleData.name ?? user.email}</span>
          <span className="bg-gold/40 px-2 py-0.5 rounded text-white capitalize">{roleData.role.replace('_', ' ')}</span>
          <LogoutButton />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">{children}</div>
    </div>
  )
}
