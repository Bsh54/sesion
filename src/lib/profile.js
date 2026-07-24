// User profiles and session attendees (server-backed, keyed by wallet).
const API = import.meta.env.VITE_API_URL || 'https://vps122470.serveur-vps.net/sesion-api'

export async function getProfile(wallet) {
  if (!wallet) return { name: null }
  try {
    const res = await fetch(`${API}/profile?wallet=${encodeURIComponent(wallet)}`)
    return res.ok ? await res.json() : { name: null }
  } catch {
    return { name: null }
  }
}

export async function saveProfile({ wallet, name }) {
  const res = await fetch(`${API}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet, name }),
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
