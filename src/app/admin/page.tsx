import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: photoCount }, { count: yearCount }] = await Promise.all([
    supabase.from('photos').select('*', { count: 'exact', head: true }),
    supabase.from('years').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-crimson mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-crimson">
          <p className="text-3xl font-bold text-crimson">{photoCount ?? 0}</p>
          <p className="text-gray-500 text-sm mt-1">Total Photos</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-gold">
          <p className="text-3xl font-bold text-gold">{yearCount ?? 0}</p>
          <p className="text-gray-500 text-sm mt-1">Puja Years</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/upload" className="block bg-crimson text-white rounded-xl p-6 hover:bg-crimson-dark transition-colors text-center font-semibold">
          Upload Photos
        </Link>
        <Link href="/admin/years" className="block bg-gold text-white rounded-xl p-6 hover:bg-gold-light transition-colors text-center font-semibold">
          Manage Years
        </Link>
        <Link href="/admin/history" className="block bg-amber-700 text-white rounded-xl p-6 hover:bg-amber-800 transition-colors text-center font-semibold">
          Edit History
        </Link>
        <Link href="/admin/schedule" className="block bg-crimson text-white rounded-xl p-6 hover:bg-crimson-dark transition-colors text-center font-semibold">
          Schedule
        </Link>
      </div>
    </div>
  )
}
