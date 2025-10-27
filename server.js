Deno.serve({ port: 1337 }, async (req) => {
  const path = `./docs${new URL(req.url).pathname}`;
  const mime = path.endsWith(".css") ? "text/css" : path.endsWith(".js") ? "text/javascript" : "text/html";
  return await Deno.stat(path)
    .then((stat) => stat.isDirectory ? `${path}/index.html` : path)
    .then(Deno.readTextFile)
    .then((file) => file.replaceAll('autocomplete="off"', 'autocomplete="on"'))
    .then((file) => new Response(file, { headers: { "content-type": mime } }))
    .catch(() => new Response("not found", { status: 404 }));
});
