// Serves the videos in public/videos with byte ranges; wrangler.jsonc sends only /videos/*
// here, and every other URL straight to the static assets. The static assets answer a Range
// request with the whole file and a 200, and Safari, which every browser on an iPhone uses,
// won't play a video from a server that does that.
//
// The clips are a few megabytes, so each one is read whole and sliced.

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const header = request.headers.get('Range');
    const ifRange = request.headers.get('If-Range');
    if (
      request.method !== 'GET' ||
      response.status !== 200 ||
      !header ||
      (ifRange && ifRange !== response.headers.get('ETag'))
    ) {
      return withHeaders(response, response.body, response.status);
    }

    const body = await response.arrayBuffer();
    const range = byteRange(header, body.byteLength);
    if (range === undefined) {
      return withHeaders(response, body, 200);
    }
    if (range === null) {
      return withHeaders(response, null, 416, { 'Content-Range': `bytes */${body.byteLength}` });
    }
    const [start, end] = range;
    return withHeaders(response, body.slice(start, end + 1), 206, {
      'Content-Range': `bytes ${start}-${end}/${body.byteLength}`,
    });
  },
};

/**
 * The first and last byte `header` asks for: `bytes=a-b`, `bytes=a-` or the last n bytes,
 * `bytes=-n`. Null when the file has none of those bytes (416), undefined when the header isn't
 * a single valid range, which HTTP says to ignore by sending the whole file.
 */
function byteRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || match[1] + match[2] === '') {
    return undefined;
  }
  const [, first, last] = match;
  if (first === '') {
    const length = Math.min(Number(last), size);
    return length > 0 ? [size - length, size - 1] : null;
  }
  const start = Number(first);
  if (last !== '' && Number(last) < start) {
    return undefined;
  }
  return start < size ? [start, last === '' ? size - 1 : Math.min(Number(last), size - 1)] : null;
}

/** The asset's own headers, saying ranges are accepted, with `extra` on top. */
function withHeaders(response, body, status, extra = {}) {
  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges', 'bytes');
  // The runtime sets it from the new body.
  headers.delete('Content-Length');
  for (const [name, value] of Object.entries(extra)) {
    headers.set(name, value);
  }
  return new Response(body, { status, headers });
}
