// User profiles, attendees and ticket check-in (server-backed, keyed by wallet).
const API = import.meta.env.VITE_API_URL || 'https://vps122470.serveur-vps.net/sesion-api'

export async function getProfile(wallet) {
  if (!wallet) return { name: null, avatar: null }
  try {
    const res = await fetch(`${API}/profile?wallet=${encodeURIComponent(wallet)}`)
    return res.ok ? await res.json() : { name: null, avatar: null }
  } catch {
    return { name: null, avatar: null }
  }
}

export async function saveProfile({ wallet, name, avatar }) {
  const body = { wallet }
  if (name !== undefined) body.name = name
  if (avatar !== undefined) body.avatar = avatar
  const res = await fetch(`${API}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Could not save profile')
  return res.json()
}

export async function getAttendees(sessionId) {
  try {
    const res = await fetch(`${API}/attendees?sessionId=${encodeURIComponent(sessionId)}`)
    return res.ok ? await res.json() : []
  } catch {
    return []
  }
}

// Verify a scanned ticket QR against real bookings, and mark it checked in.
export async function checkinTicket(sessionId, code) {
  try {
    const res = await fetch(`${API}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, code }),
    })
    return res.ok ? await res.json() : { valid: false }
  } catch {
    return { valid: false }
  }
}
