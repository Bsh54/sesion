// Deterministic avatar generated from a seed (wallet address).
// Same wallet -> same avatar, no upload needed.
export function avatarUrl(seed) {
  const s = encodeURIComponent(seed || 'guest')
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${s}&backgroundColor=C8FF3D`
}

// Short, readable form of a Nimiq address.
export function shortAddress(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 14)}…${addr.slice(-4)}`
}

// Uploaded profile photo if any, otherwise the generated identicon.
export function displayAvatar(profileAvatar, wallet) {
  return profileAvatar || avatarUrl(wallet)
}
