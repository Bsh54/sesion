// Session store.
// The catalog is curated (static seed) for now, so we read it directly.
// When a shared backend (coach onboarding) lands, these functions become the
// single place to swap in async data fetching.
import { SESSIONS } from '../data/sessions'

export function getSessions() {
  return SESSIONS
}

export function getSession(id) {
  return SESSIONS.find((s) => s.id === id) ?? null
}
