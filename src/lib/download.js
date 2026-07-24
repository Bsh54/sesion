// Save/share a <canvas> as a PNG.
// In-app browsers (Nimiq Pay WebView) block classic downloads, so we prefer
// the native share sheet (which lets the user save the image), then fall back
// to a blob download for desktop browsers.
export async function saveCanvasImage(canvasId, filename) {
  const canvas = document.getElementById(canvasId)
  if (!canvas || !canvas.toBlob) return

  await new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve()
      const file = new File([blob], filename, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Sesión ticket' })
          return resolve()
        } catch {
          /* user cancelled or share failed — fall back */
        }
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      resolve()
    }, 'image/png')
  })
}
