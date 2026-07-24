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
// Nimiq Pay signs AND broadcasts, then returns the serialized transaction.
// Returns { receipt } on success, or throws with a readable message.
export async function paySession({ recipient, nim, ref }) {
  const provider = await getProvider()
  if (!provider) {
    // No wallet is injected outside Nimiq Pay — no payment is possible here.
    throw new Error('Open Sesión inside Nimiq Pay to pay.')
  }

  const result = await provider.sendBasicTransactionWithData({
    recipient,
    value: nimToLuna(nim),
    data: ref,
  })

  if (result && typeof result === 'object' && 'error' in result) {
    throw new Error(result.error?.message || 'Payment failed')
  }

  // `result` is the serialized transaction string.
  return { receipt: String(result) }
}
