import { useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X } from 'lucide-react'

// Full-screen camera QR scanner. Calls onResult(text) once, then closes.
export default function QrScanner({ onResult, onClose }) {
  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    let done = false
    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 240 },
        (text) => {
          if (done) return
          done = true
          scanner.stop().catch(() => {})
          onResult(text)
        },
        () => {},
      )
      .catch(() => {})
    return () => {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {})
    }
  }, [onResult])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-5">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-full bg-bg/10 text-bg"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div id="qr-reader" className="w-full max-w-sm overflow-hidden rounded-card" />
      </div>
      <p className="pb-4 text-center text-sm text-bg/70">Point the camera at the ticket QR</p>
    </div>
  )
}
