import { createClient } from '@/lib/supabase/server'
import { deleteFeedback } from '@/app/actions/feedback'
import type { Feedback } from '@/types'

export default async function AdminFeedbackPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  const items = (data ?? []) as Feedback[]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-crimson mb-1">Feedback</h1>
      <p className="text-gray-400 text-sm mb-6">{items.length} total</p>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No feedback yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="bg-white rounded-lg shadow px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800">{f.name ?? 'Anonymous'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {f.rating ? <span className="text-gold mr-2">{'★'.repeat(f.rating)}</span> : null}
                    {new Date(f.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <form
                  action={async () => {
                    'use server'
                    await deleteFeedback(f.id)
                  }}
                >
                  <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                </form>
              </div>
              <p className="text-gray-700 text-sm mt-3 whitespace-pre-line">{f.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
