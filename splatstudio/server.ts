const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === '/' ? '/index.html' : url.pathname;

    // For the main entry point, build the TS bundle
    if (path === '/src/main.ts') {
      const result = await Bun.build({
        entrypoints: ['./src/main.ts'],
        bundle: true,
      });
      const js = await result.outputs[0].text();
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript' },
      });
    }

    const file = Bun.file('.' + path);
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response('Not found', { status: 404 });
  },
});

console.log(`Paint World running at http://localhost:${server.port}`);
