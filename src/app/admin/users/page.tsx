import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addUser, removeUser } from '@/app/actions/users'

export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: myRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (myRole?.role !== 'super_admin') redirect('/admin')

  const { data: users } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-crimson mb-6">Manage Users</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
          Done!
        </div>
      )}

      {/* Add user */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Add Admin User</h2>
        <form action={addUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
            />
          </div>
          <button
            type="submit"
            className="bg-crimson text-white px-6 py-2 rounded font-semibold hover:bg-crimson-dark transition-colors text-sm"
          >
            Add User
          </button>
        </form>
      </div>

      {/* User list */}
      <div className="space-y-3">
        {users?.map((u) => (
          <div key={u.id} className="bg-white rounded-lg shadow px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{u.name ?? '—'}</p>
              <p className="text-gray-400 text-xs mt-0.5 capitalize">{u.role.replace('_', ' ')}</p>
            </div>
            {u.user_id !== user.id && (
              <form
                action={async () => {
                  'use server'
                  await removeUser(u.user_id)
                }}
              >
                <button
                  type="submit"
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
