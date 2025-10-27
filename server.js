import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve({ port: 1337 }, async (req) => {
  const res = await serveDir(req);
  const { headers, status } = res;

  // enable autocomplete to have a better developer experience
  if (headers.get("content-type")?.includes("text/html")) {
    const html = await res.text();
    const modified = html.replaceAll('autocomplete="off"', 'autocomplete="on"');
    return new Response(modified, { status, headers });
  }

  return res;
});
