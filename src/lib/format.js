// Display helpers for prices and dates.

export function formatNim(nim) {
  return `${nim} NIM`
}

export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Spots left, and whether it is scarce enough to highlight in coral.
export function spotsInfo(session) {
  const left = session.capacity - session.booked
  return { left, scarce: left > 0 && left <= Math.ceil(session.capacity * 0.2) }
}
