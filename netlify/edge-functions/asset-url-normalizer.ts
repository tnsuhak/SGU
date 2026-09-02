const SPECIAL_OR_ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

function absolutize(value: string, baseUrl: string): string {
  const trimmed = (value || '').trim();
  if (!trimmed || SPECIAL_OR_ABSOLUTE.test(trimmed)) return value;
  try {
    return new URL(trimmed, baseUrl).href;
  } catch {
    return value;
  }
}

function rewriteSrcset(value: string, baseUrl: string): string {
  // Data URLs can contain commas, so leave those untouched.
  if (!value || value.includes('data:')) return value;
  return value
    .split(',')
    .map((candidate) => {
      const trimmed = candidate.trim();
      if (!trimmed) return trimmed;
      const match = trimmed.match(/^(\S+)(\s+.*)?$/);
      if (!match) return trimmed;
      return `${absolutize(match[1], baseUrl)}${match[2] || ''}`;
    })
    .join(', ');
}

function rewriteCssUrls(css: string, baseUrl: string): string {
  return css.replace(/url\(\s*(["']?)([^"'()]+)\1\s*\)/gi, (whole, quote, rawUrl) => {
    const rewritten = absolutize(rawUrl, baseUrl);
    if (rewritten === rawUrl) return whole;
    const q = quote || '';
    return `url(${q}${rewritten}${q})`;
  });
}

function normalizeAssetUrls(html: string, baseUrl: string): string {
  // Image/media/script attributes, including common lazy-load variants.
  html = html.replace(
    /(\s(?:src|poster|data-src|data-lazy-src|data-background|data-bg)\s*=\s*)(["'])([^"']*)\2/gi,
    (whole, prefix, quote, value) => `${prefix}${quote}${absolutize(value, baseUrl)}${quote}`,
  );

  // Responsive image sources.
  html = html.replace(
    /(\ssrcset\s*=\s*)(["'])([^"']*)\2/gi,
    (whole, prefix, quote, value) => `${prefix}${quote}${rewriteSrcset(value, baseUrl)}${quote}`,
  );

  // Inline <style> blocks and style="..." attributes.
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (block) => rewriteCssUrls(block, baseUrl));
  html = html.replace(
    /(\sstyle\s*=\s*)(["'])([^"']*)\2/gi,
    (whole, prefix, quote, value) => `${prefix}${quote}${rewriteCssUrls(value, baseUrl)}${quote}`,
  );

  // Stylesheets, icons, preload resources and manifests. Normal <a href> links are deliberately untouched.
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    const relMatch = tag.match(/\brel\s*=\s*["']([^"']+)["']/i);
    const rel = (relMatch?.[1] || '').toLowerCase();
    if (!/(?:stylesheet|icon|preload|modulepreload|manifest)/.test(rel)) return tag;
    return tag.replace(
      /(\shref\s*=\s*)(["'])([^"']*)\2/i,
      (whole, prefix, quote, value) => `${prefix}${quote}${absolutize(value, baseUrl)}${quote}`,
    );
  });

  // Social/preview images used by Open Graph and Twitter cards.
  html = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    const keyMatch = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i);
    const key = (keyMatch?.[1] || '').toLowerCase();
    if (!['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'].includes(key)) return tag;
    return tag.replace(
      /(\scontent\s*=\s*)(["'])([^"']*)\2/i,
      (whole, prefix, quote, value) => `${prefix}${quote}${absolutize(value, baseUrl)}${quote}`,
    );
  });

  return html;
}

export default async (request: Request, context: any) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const rewritten = normalizeAssetUrls(html, request.url);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');

  return new Response(rewritten, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
