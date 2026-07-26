// Host ratings — only people who booked a session can rate it.
const API = import.meta.env.VITE_API_URL || 'https://vps122470.serveur-vps.net/sesion-api'

export async function rateSession({ sessionId, rater, stars, noShow }) {
  const res = await fetch(`${API}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, rater, stars, noShow: !!noShow }),
  })
  if (!res.ok) throw new Error('Could not submit rating')
  return res.json()
}

export async function getMyRating(sessionId, rater) {
  if (!rater) return null
  try {
    const res = await fetch(
      `${API}/rating?sessionId=${encodeURIComponent(sessionId)}&rater=${encodeURIComponent(rater)}`,
    )
    if (!res.ok) return null
    const data = await res.json()
    return data && data.stars ? data : null
  } catch {
    return null
  }
}
