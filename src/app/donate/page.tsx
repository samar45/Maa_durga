import DonateForm from '@/components/DonateForm'

export const metadata = {
  title: 'Donate — Durga Maa Puja',
  description: 'Support our annual Durga Maa Puja celebration with your donation.',
}

export default function DonatePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Support the Puja</p>
        <h1 className="text-4xl font-bold text-crimson mb-3">Make a Donation</h1>
        <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
          Your contribution helps us celebrate this sacred tradition — from the idol and decorations
          to prasad for everyone. Every rupee is an act of devotion.
        </p>
      </div>

      {/* What your donation covers */}
      <div className="grid grid-cols-3 gap-4 mb-10 text-center">
        {[
          { amount: '₹51', label: 'Flowers & Diyas' },
          { amount: '₹251', label: 'Prasad for all' },
          { amount: '₹1001', label: 'Idol decoration' },
        ].map(({ amount, label }) => (
          <div key={amount} className="bg-amber-50 rounded-xl px-3 py-4 border border-amber-100">
            <p className="text-crimson font-bold text-lg">{amount}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Donation form */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <DonateForm />
      </div>

      {/* Note */}
      <p className="text-center text-xs text-gray-400 mt-6">
        All donations go directly to the puja committee. No transaction fees — 100% reaches the cause.
      </p>
    </div>
  )
}
