export function getEmbedUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl)
    let videoId = ''

    if (url.hostname === 'youtu.be') {
      // Trích ID từ pathname
      videoId = url.pathname.slice(1)
    } else if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v') || ''
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/embed/')[1]
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  } catch {
    return ''
  }
}
