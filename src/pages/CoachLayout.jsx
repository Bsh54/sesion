import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader2, Wallet } from 'lucide-react'
import { getAddress } from '../lib/nimiq'
import CoachNav from '../components/CoachNav'

export default function CoachLayout() {
  const [wallet, setWallet] = useState(undefined)

  useEffect(() => {
    getAddress().then((w) => setWallet(w ?? null))
  }, [])

  if (wallet === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 size={28} className="animate-spin text-ink-soft" />
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
          <Wallet size={28} className="text-ink-soft" strokeWidth={1.75} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Connect your wallet</h2>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">
          Open Sesión inside Nimiq Pay to host sessions and get paid.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-bg">
      <Outlet context={{ wallet }} />
      <CoachNav />
    </div>
  )
}
