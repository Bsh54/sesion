// Session store.
// Backed by localStorage, seeded from the demo catalog on first run.
// The supply side (coaches, sessions) is curated for now; a coach onboarding
// flow with a shared backend is on the roadmap.
import { SESSIONS as SEED } from '../data/sessions'

const KEY = 'sesion.sessions.v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

function persist(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

// Returns all sessions, seeding demo content on first run.
export function getSessions() {
  let list = load()
  if (!list) {
    list = SEED
    persist(list)
  }
  return list
}

export function getSession(id) {
  return getSessions().find((s) => s.id === id) ?? null
}
