const SITE_ORIGIN = "https://troptions.vercel.app";
const PDF_PATHS = new Set([
  "/x402-mesh-pay-overview.pdf",
  "/x402-mesh-pay-overview-1.pdf",
]);

function renderDownloadsIndex() {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>TROPTIONS Downloads</title>
    <style>
      body { font-family: Arial, sans-serif; background:#071426; color:#f8fafc; margin:0; padding:32px; }
      .card { max-width:760px; margin:0 auto; background:#0c1e35; border:1px solid #334155; border-radius:12px; padding:24px; }
      h1 { margin-top:0; color:#f0cf82; }
      a { color:#7dd3fc; text-decoration:none; }
      a:hover { text-decoration:underline; }
      li { margin:10px 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>TROPTIONS PDF Downloads</h1>
      <ul>
        <li><a href="/x402-mesh-pay-overview.pdf">x402-mesh-pay-overview.pdf</a></li>
        <li><a href="/x402-mesh-pay-overview-1.pdf">x402-mesh-pay-overview-1.pdf</a></li>
      </ul>
    </div>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}


async function proxyToSite(request) {
  const incomingUrl = new URL(request.url);
  const upstreamPath = incomingUrl.pathname === "/"
    ? "/troptions"
    : incomingUrl.pathname + incomingUrl.search;
  const upstreamUrl = new URL(upstreamPath, SITE_ORIGIN);
  const headers = new Headers(request.headers);

  headers.set("x-forwarded-host", incomingUrl.host);
  headers.set("x-forwarded-proto", incomingUrl.protocol.replace(":", ""));

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: request.method,
    headers,
    body: request.body,
    redirect: "follow",
    duplex: "half",
  });

  return fetch(upstreamRequest);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/downloads") {
      return renderDownloadsIndex();
    }

    if (PDF_PATHS.has(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    return proxyToSite(request);
  },
};
