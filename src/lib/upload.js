// Upload an image to the backend, returns its public URL.
const API = import.meta.env.VITE_API_URL || 'https://vps122470.serveur-vps.net/sesion-api'

export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${API}/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  const { url } = await res.json()
  return url
}
