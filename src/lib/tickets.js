// Booked tickets, stored server-side (keyed by the user's Nimiq wallet address).
const API = import.meta.env.VITE_API_URL || 'https://vps122470.serveur-vps.net/sesion-api'

// Fetch every ticket booked by a wallet.
export async function getTickets(wallet) {
  if (!wallet) return []
  try {
    const res = await fetch(`${API}/tickets?wallet=${encodeURIComponent(wallet)}`)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

// Persist a ticket after a successful payment.
export async function addTicket({ wallet, sessionId, code }) {
  const res = await fetch(`${API}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet, sessionId, code }),
  })
  if (!res.ok) throw new Error('Could not save ticket')
  return res.json()
}
