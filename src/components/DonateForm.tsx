'use client'

import { useState } from 'react'
import Image from 'next/image'

const PRESETS = [51, 101, 251, 501, 1001]
const UPI_ID = '7596892754@ybl'
const PAYEE_NAME = 'Durga Maa Puja'

export default function DonateForm() {
  const [selected, setSelected] = useState<number>(101)
  const [custom, setCustom] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [paid, setPaid] = useState(false)

  const amount = showCustom ? parseInt(custom) || 0 : selected

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR${amount > 0 ? `&am=${amount}` : ''}`

  if (paid) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="text-2xl font-bold text-crimson mb-2">Jai Maa Durga!</h2>
        <p className="text-gray-600">Thank you for your generous contribution.<br />May Maa bless you and your family.</p>
        <button onClick={() => { setPaid(false); setSelected(101); setCustom(''); setShowCustom(false) }}
          className="mt-6 text-sm text-crimson underline">
          Make another donation
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      {/* Amount presets */}
      <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Select Amount</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {PRESETS.map((amt) => (
          <button
            key={amt}
            onClick={() => { setSelected(amt); setShowCustom(false) }}
            className={`py-2.5 rounded-lg font-bold text-sm border-2 transition-colors ${
              !showCustom && selected === amt
                ? 'bg-crimson border-crimson text-white'
                : 'border-gray-200 text-gray-600 hover:border-crimson hover:text-crimson'
            }`}
          >
            ₹{amt}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(true)}
          className={`py-2.5 rounded-lg font-bold text-sm border-2 transition-colors ${
            showCustom
              ? 'bg-crimson border-crimson text-white'
              : 'border-gray-200 text-gray-600 hover:border-crimson hover:text-crimson'
          }`}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
          <input
            type="number"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Enter amount"
            autoFocus
            className="w-full border-2 border-crimson rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scan or Tap to Pay</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* QR Code */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white p-4 rounded-2xl shadow border border-gray-100">
          <Image
            src="/phonepe-qr.png"
            alt="PhonePe QR Code - Sanjay Kumar Mohanty"
            width={190}
            height={190}
            className="mx-auto"
          />
          <p className="text-xs text-gray-400 mt-2">Scan with PhonePe, GPay, Paytm</p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">SANJAY KUMAR MOHANTY</p>
          <p className="text-xs text-gray-400">{UPI_ID}</p>
        </div>
      </div>

      {/* UPI deep link — works on mobile */}
      <a
        href={upiLink}
        onClick={() => setTimeout(() => setPaid(true), 2000)}
        className="flex items-center justify-center gap-2 w-full bg-crimson hover:bg-crimson-dark text-white py-3.5 rounded-xl font-bold text-base transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
        Pay ₹{amount > 0 ? amount.toLocaleString('en-IN') : '—'} with UPI
      </a>
      <p className="text-center text-xs text-gray-400 mt-2">
        Opens PhonePe · GPay · Paytm · any UPI app
      </p>
    </div>
  )
}
