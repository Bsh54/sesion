// Sessions, served by the backend (coaches create them, clients browse them).
const API = import.meta.env.VITE_API_URL || 'https://vps122470.serveur-vps.net/sesion-api'

export async function getSessions() {
  try {
    const res = await fetch(`${API}/sessions`)
    return res.ok ? await res.json() : []
  } catch {
    return []
  }
}

export async function getSession(id) {
  try {
    const res = await fetch(`${API}/session?id=${encodeURIComponent(id)}`)
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

// Create a session (coach side).
export async function createSession(payload) {
  const res = await fetch(`${API}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Could not create session')
  return res.json()
}

// Delete a session (only the coach who created it can).
export async function deleteSession(id, wallet) {
  const res = await fetch(`${API}/session/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wallet }),
  })
  if (!res.ok) throw new Error('Could not delete session')
  return res.json()
}

// Sessions hosted by a given coach wallet.
export async function getCoachSessions(wallet) {
  if (!wallet) return []
  try {
    const res = await fetch(`${API}/coach/sessions?wallet=${encodeURIComponent(wallet)}`)
    return res.ok ? await res.json() : []
  } catch {
    return []
  }
}
