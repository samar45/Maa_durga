import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Hit daily by Vercel cron (vercel.json) so the Supabase free project never
// goes 7 days without activity and gets paused.
export async function GET() {
  const supabase = await createClient()
  const { error } = await supabase.from('years').select('id').limit(1)
  return NextResponse.json({ ok: !error, error: error?.message ?? null })
}
