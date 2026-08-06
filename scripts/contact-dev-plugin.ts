import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

/**
 * Serves netlify/functions/contact.mts at /api/contact during `npm run dev`.
 *
 * ── Why ────────────────────────────────────────────────────────────────────
 * In production that path is a Netlify function, resolved by the /api/* rule in
 * public/_redirects. The Vite dev server knows nothing about either, so without
 * this the contact form POSTs into the SPA fallback, gets an HTML page back and
 * shows its error state — on every submit, forever, with no indication that the
 * cause is the dev server rather than the code or the mail server. That is a
 * genuinely misleading failure, and the alternative (telling everyone to run
 * netlify-cli instead) trades a 200 MB dependency for it.
 *
 * The handler is loaded through ssrLoadModule rather than imported, so Vite
 * transforms the TypeScript and re-reads the file on change — editing the
 * function does not need a dev-server restart.
 *
 * ── On the credentials ─────────────────────────────────────────────────────
 * SMTP_* is read from .env into the dev server's own process.env. That process
 * is Node, not the browser, and Vite's envPrefix still gates what reaches the
 * client at VITE_ — so nothing here widens what the bundle can see. Passing the
 * values through `define` or an import.meta.env read WOULD, which is exactly
 * why this goes nowhere near either.
 */
export function contactDev(): Plugin {
  return {
    name: 'bmgt-contact-dev',
    /* Dev only. In a build this path belongs to Netlify. */
    apply: 'serve',

    configureServer(server) {
      /* '' as the prefix loads every key, not just VITE_ — these are read here
         in Node and handed to the function, never surfaced to the client. */
      const env = loadEnv(server.config.mode, server.config.root, '')
      for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }

      if (!process.env.SMTP_PASS) {
        server.config.logger.warn(
          '[contact] SMTP_PASS is not set — /api/contact will answer 502. Copy .env.example to .env.',
        )
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.split('?')[0].endsWith('/api/contact')) return next()

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const body = Buffer.concat(chunks)

          /* Node's IncomingMessage headers can hold arrays; Headers cannot. */
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) value.forEach((v) => headers.append(key, v))
            else if (value) headers.set(key, value)
          }
          /* Netlify supplies the client IP under its own header; the rate
             limiter reads it, so dev has to provide something too. */
          if (!headers.has('x-forwarded-for')) headers.set('x-forwarded-for', '127.0.0.1')

          const mod = await server.ssrLoadModule('/netlify/functions/contact.mts')
          const response: Response = await mod.default(
            new Request(`http://localhost${url}`, {
              method: req.method,
              headers,
              body: req.method === 'GET' || req.method === 'HEAD' || !body.length ? undefined : body,
            }),
          )

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          server.config.logger.error(`[contact] ${(err as Error).stack ?? err}`)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'dev_handler_failed' }))
        }
      })
    },
  }
}
