import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import T from '@/components/T'

export const revalidate = 3600

export default async function HistoryPage() {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('history')
    .select('*')
    .order('year', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-crimson"><T k="history_title" /></h1>
        <p className="text-amber-700 mt-2"><T k="history_subtitle" /></p>
      </div>

      {!entries?.length ? (
        <p className="text-center text-gray-500 py-20"><T k="history_empty" /></p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/40 hidden md:block" />

          <div className="space-y-14">
            {entries.map((entry) => (
              <div key={entry.id} className="md:pl-16 relative">
                {/* Year dot */}
                <div className="hidden md:flex absolute left-0 top-1 w-12 h-12 rounded-full bg-crimson text-white items-center justify-center font-bold text-sm shadow-lg">
                  {entry.year}
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
                  {/* Mobile year badge */}
                  <div className="md:hidden bg-crimson text-white px-4 py-2 text-sm font-bold">
                    {entry.year}
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-crimson mb-3">{entry.title}</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{entry.story_text}</p>
                  </div>

                  {entry.image_urls?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 pt-0 border-t border-amber-50">
                      {entry.image_urls.map((url: string, i: number) => (
                        <div key={i} className="aspect-video relative overflow-hidden rounded-lg">
                          <Image
                            src={url}
                            alt={`${entry.title} - ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
