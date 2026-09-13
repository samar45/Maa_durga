import LoginForm from '@/components/LoginForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/admin')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-crimson">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to upload photos</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
