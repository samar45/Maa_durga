import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import T from '@/components/T'
import type { Photo } from '@/types'

export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  const { data: latestYear } = await supabase
    .from('years')
    .select('id, year, theme, year_photos:photos!year_id(id, cloudinary_url, caption)')
    .order('year', { ascending: false })
    .limit(1)
    .maybeSingle()

  const photos: Photo[] = (latestYear as unknown as { year_photos: Photo[] } | null)?.year_photos ?? []

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-crimson overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, #D4AF37 1px, transparent 1px),
                              radial-gradient(circle at 75% 50%, #D4AF37 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative text-center px-4 py-16">
          <p className="text-gold-light text-base tracking-[0.3em] uppercase mb-4">
            <T k="hero_mantra" />
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-amber-50 mb-4">
            Durga Maa Puja
          </h1>
          <p className="text-amber-200 text-lg mb-10 max-w-md mx-auto">
            <T k="hero_tagline" />
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/gallery" className="bg-gold text-white px-7 py-3 rounded font-semibold hover:bg-gold-light transition-colors">
              <T k="hero_gallery_btn" />
            </Link>
            <Link href="/history" className="border border-amber-400 text-amber-100 px-7 py-3 rounded font-semibold hover:bg-crimson-dark transition-colors">
              <T k="hero_history_btn" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Year Photos */}
      {latestYear && (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest"><T k="latest" /></span>
            <h2 className="text-3xl font-bold text-crimson mt-1">Puja {latestYear.year}</h2>
            {latestYear.theme && <p className="text-amber-700 mt-2 italic">Theme: {latestYear.theme}</p>}
          </div>

          {photos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.slice(0, 6).map((photo) => (
                  <div key={photo.id} className="aspect-square relative overflow-hidden rounded-lg shadow">
                    <Image
                      src={photo.cloudinary_url}
                      alt={photo.caption ?? `Puja ${latestYear.year}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={`/gallery/${latestYear.year}`}
                  className="inline-block bg-crimson text-white px-6 py-2.5 rounded hover:bg-crimson-dark transition-colors"
                >
                  {photos.length > 6 ? `View All ${photos.length} Photos` : 'View Full Gallery'}
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Photos coming soon.</p>
          )}
        </section>
      )}

      {!latestYear && (
        <section className="py-24 text-center text-gray-500">
          <p className="text-lg">Gallery coming soon. Check back after the puja!</p>
        </section>
      )}

      {/* Donate CTA */}
      <section className="bg-crimson-dark py-14 px-4 text-center text-white">
        <p className="text-gold-light text-sm uppercase tracking-widest mb-2">Support the Celebration</p>
        <h2 className="text-3xl font-bold mb-3">Contribute to the Puja</h2>
        <p className="text-amber-200 text-sm mb-7 max-w-sm mx-auto">
          Help us keep this tradition alive. Every donation goes directly to the puja committee.
        </p>
        <Link
          href="/donate"
          className="inline-block bg-gold hover:bg-gold-light text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Donate Now
        </Link>
      </section>
    </>
  )
}
