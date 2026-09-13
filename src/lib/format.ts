export function fmtTime(t: string | null) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function fmtRange(start: string | null, end: string | null) {
  if (!start) return ''
  return end ? `${fmtTime(start)} - ${fmtTime(end)}` : fmtTime(start)
}

export function fmtDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Today's date as YYYY-MM-DD in India, regardless of server timezone. */
export function todayIST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}
