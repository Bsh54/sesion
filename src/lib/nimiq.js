// Thin wrapper around the Nimiq Mini App SDK.
// Falls back to a mock provider when running outside Nimiq Pay (browser dev),
// so the whole UI stays usable during development and demos.
import { init } from '@nimiq/mini-app-sdk'

// 1 NIM = 100,000 luna.
export const LUNA_PER_NIM = 100_000
export const nimToLuna = (nim) => Math.round(nim * LUNA_PER_NIM)

let providerPromise = null

// Resolves to the injected NimiqProvider, or null when not inside Nimiq Pay.
export function getProvider() {
  if (!providerPromise) {
    providerPromise = init({ timeout: 3000 }).catch(() => null)
  }
  return providerPromise
}

export async function isInNimiqPay() {
  return (await getProvider()) !== null
}

// Returns the user's first Nimiq address, or null.
export async function getAddress() {
  const provider = await getProvider()
  if (!provider) return null
  const accounts = await provider.listAccounts()
  return Array.isArray(accounts) ? accounts[0] ?? null : null
}

// Signs a message to prove wallet ownership (used for coach sign-in).
export async function signIn(message = 'Sign in to Sesión') {
  const provider = await getProvider()
  if (!provider) {
    // Dev fallback: pretend a demo coach signed in.
    return { address: 'NQ00 DEMO COACH', signature: 'dev' }
  }
  return provider.sign(message)
}

// Pays a coach directly. `ref` is written on-chain as the booking reference.
export async function paySession({ recipient, nim, ref }) {
  const provider = await getProvider()
  if (!provider) {
    // Dev fallback: simulate a successful payment.
    await new Promise((r) => setTimeout(r, 700))
    return { txHash: 'DEV-' + Math.random().toString(36).slice(2, 10), dev: true }
  }
  return provider.sendBasicTransactionWithData({
    recipient,
    value: nimToLuna(nim),
    data: ref,
  })
}
