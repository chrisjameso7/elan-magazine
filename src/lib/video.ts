export function videoSource(
  value?: string,
): { type: 'file' | 'embed'; url: string } | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return;
    if (/\.(mp4|webm)$/i.test(url.pathname))
      return { type: 'file', url: url.href };
    if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) {
      const id =
        url.hostname === 'youtu.be'
          ? url.pathname.slice(1)
          : url.searchParams.get('v') ||
            url.pathname.match(/^\/embed\/([\w-]+)$/)?.[1];
      if (id && /^[\w-]{11}$/.test(id))
        return {
          type: 'embed',
          url: `https://www.youtube-nocookie.com/embed/${id}`,
        };
    }
    if (
      ['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)
    ) {
      const id = url.pathname.match(/(?:\/video)?\/(\d+)$/)?.[1];
      if (id)
        return {
          type: 'embed',
          url: `https://player.vimeo.com/video/${id}?dnt=1`,
        };
    }
  } catch {
    return;
  }
}
