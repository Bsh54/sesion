// Booked tickets, stored locally on the device.
// A ticket is created when a session payment succeeds.

const KEY = 'sesion.tickets.v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return []
}

function persist(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

export function getTickets() {
  return load()
}

export function addTicket({ sessionId, code }) {
  const ticket = { id: 't' + Date.now(), sessionId, code, createdAt: Date.now() }
  persist([ticket, ...load()])
  return ticket
}
