/**
 * Returns the URL to open a recording video (local storage or external).
 * Same logic as upload-video.vue resolveStoragePath + openVideoUrl.
 */
export function getOpenVideoUrl(mediaUrl) {
  if (!mediaUrl) return null

  const resolveStoragePath = (url) => {
    if (!url) return null
    try {
      const u = new URL(url)
      if (!u.origin.startsWith(import.meta.env.VITE_APP_SERVER_BASE_URL)) return null
      const idx = u.pathname.indexOf("/storage/")
      if (idx === -1) return null
      return u.pathname.substring(idx + 9)
    } catch (e) {
      return null
    }
  }

  const path = resolveStoragePath(mediaUrl)
  if (path) {
    return `${import.meta.env.VITE_APP_SERVER_BASE_URL}/show-video?path=${path}`
  }
  return mediaUrl
}
