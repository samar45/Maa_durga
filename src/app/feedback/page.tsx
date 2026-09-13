import Link from 'next/link'
import { submitFeedback } from '@/app/actions/feedback'

export const metadata = {
  title: 'Feedback — Durga Maa Puja',
  description: 'Tell us how we can make the puja better.',
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const { sent } = await searchParams

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">We&apos;re Listening</p>
        <h1 className="text-4xl font-bold text-crimson mb-3">Your Feedback</h1>
        <p className="text-gray-600 text-sm">Tell us how we can make the puja better.</p>
      </div>

      {sent ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold text-crimson mb-2">Thank you for your feedback! 🙏</h2>
          <Link href="/feedback" className="inline-block mt-4 text-sm text-crimson underline">
            Submit another
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <form action={submitFeedback} className="space-y-5">
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
              <input
                type="text"
                name="name"
                maxLength={80}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">Rating (optional)</legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className="cursor-pointer rounded-lg border-2 border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 hover:border-crimson hover:text-crimson has-checked:border-crimson has-checked:bg-crimson has-checked:text-white"
                  >
                    <input type="radio" name="rating" value={n} className="sr-only" />
                    {n}★
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                maxLength={1000}
                placeholder="What did you love? What could be better?"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-crimson hover:bg-crimson-dark text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              Send Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
