import type { Plugin } from 'vite'
import { products, productPath } from '../src/data/products'
import { allIndustryRoutes, industryPath } from '../src/data/industries'
import { LOCALES, DEFAULT_LOCALE } from '../src/i18n'

/**
 * Emits sitemap.xml and robots.txt at build time.
 *
 * ── Why a plugin and not a checked-in file ─────────────────────────────────
 * The route table is generated: App.tsx builds /products/* from `products` and
 * /industries/* from `allIndustryRoutes`, so adding a category adds its route,
 * its nav entry, its card and its footer link in one edit. A hand-written
 * sitemap would be the one place that did not follow, and a sitemap listing
 * URLs that 404 — or missing ones that exist — is worse than none at all:
 * Search Console reports it as an error against the whole property.
 *
 * Importing the same modules the router imports means the two cannot disagree.
 * The data files have no imports of their own (no React, no CSS), which is what
 * makes them safe to pull into the Vite config, where esbuild handles the TS.
 *
 * ── Bilingual ──────────────────────────────────────────────────────────────
 * Every page exists at /en/… and /ar/…. Listing both as unrelated URLs invites
 * a duplicate-content read, so each entry carries xhtml:link alternates naming
 * its counterpart plus x-default — the same relationships PageShell emits as
 * <link rel="alternate" hreflang> at runtime. Crawlers that do not run JS only
 * ever see the sitemap's copy, which is the main reason it is worth doing here.
 */

/** Routes that exist for every locale, independent of the catalogue data. */
const STATIC_PATHS = ['/', '/about', '/products', '/brands', '/legal', '/contact']

function allPaths(): string[] {
  return [
    ...STATIC_PATHS,
    ...products.map((p) => productPath(p)),
    ...allIndustryRoutes.map(({ industry, parent }) => industryPath(industry, parent)),
  ]
}

/** `/` is the locale root — /en, not /en/. Everything else is /<locale><path>. */
const localised = (origin: string, locale: string, path: string) =>
  `${origin}/${locale}${path === '/' ? '' : path}`

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;'
    : c === '>' ? '&gt;'
    : c === '&' ? '&amp;'
    : c === "'" ? '&apos;'
    : '&quot;',
  )

/*
 * A sitemap must use absolute URLs — a relative one is invalid and the whole
 * file is rejected. The origin therefore has to be known at build time, and it
 * is the one thing that cannot be derived from the code.
 *
 * SITE_URL is the override; the Netlify address is the fallback because that is
 * where the site actually is today. Set SITE_URL in the Netlify UI (Site
 * settings → Environment variables) the moment a custom domain is attached, or
 * the sitemap will keep pointing search engines at the staging host. Trailing
 * slash trimmed so the joins cannot double up on the separator.
 *
 * In dev this resolves to the dev server's own origin instead — see
 * configureServer — so a locally served sitemap contains localhost URLs you can
 * actually click, rather than production ones that navigate off the machine.
 */
function resolveOrigin(fallback?: string) {
  return (process.env.SITE_URL || fallback || 'https://bmgt-enterprise.netlify.app').replace(
    /\/+$/,
    '',
  )
}

function buildSitemap(origin: string) {
  /* Date only, no time: lastmod is about the content, and a timestamp that
     changes on every deploy trains crawlers to distrust the field. */
      const lastmod = new Date().toISOString().slice(0, 10)

      const paths = allPaths()

      const urls = LOCALES.flatMap((locale) =>
        paths.map((path) => {
          const loc = localised(origin, locale, path)
          const alternates = [
            ...LOCALES.map(
              (l) =>
                `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(
                  localised(origin, l, path),
                )}" />`,
            ),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
              localised(origin, DEFAULT_LOCALE, path),
            )}" />`,
          ].join('\n')

          return [
            '  <url>',
            `    <loc>${escapeXml(loc)}</loc>`,
            alternates,
            `    <lastmod>${lastmod}</lastmod>`,
            '  </url>',
          ].join('\n')
        }),
      )

      /* No <changefreq> or <priority>. Google has stated plainly that it
         ignores both, and they are the two fields most often filled in with
         invented numbers that make a sitemap look authoritative while saying
         nothing. Leaving them out keeps the file honest. */
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')

  return { xml, count: urls.length, pages: paths.length }
}

/*
 * robots.txt is generated rather than kept in public/ for one reason: the
 * Sitemap line needs the same absolute origin, and a static file would
 * hard-code a host that then silently goes stale.
 *
 * Nothing is disallowed, on purpose. The reflex is to add `Disallow: /*?` to
 * keep query-string variants out of the index. It is the wrong tool here and
 * actively harmful: robots rules block *crawling*, so a URL that is disallowed
 * can still be indexed from external links but can no longer be read — which
 * means the canonical tag on it is never seen either. Every page already
 * self-canonicalises via PageShell, which is what actually consolidates
 * ?utm=… duplicates. A blanket query-string block would undo that, and would
 * silently break the day a paginated or filtered route is added.
 */
function buildRobots(origin: string) {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n')
}

export function sitemap(): Plugin {
  return {
    name: 'bmgt-sitemap',

    /*
     * Served in dev as well as emitted at build.
     *
     * It was build-only, which meant `vite dev` 404'd on /sitemap.xml and there
     * was no way to check the file without a full production build — so the
     * first thing anyone does is request it, get nothing, and conclude it was
     * never generated.
     *
     * Note the path: /sitemap.xml, at the ROOT. Never /en/sitemap.xml. The
     * sitemap covers every locale at once and its <loc> entries are absolute,
     * so a per-locale copy would be both redundant and, per the sitemaps spec's
     * path restriction, unable to list URLs outside its own directory.
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0]
        if (path !== '/sitemap.xml' && path !== '/robots.txt') return next()

        /* Dev serves its own origin, so the URLs in the file are clickable
           locally instead of bouncing to production. */
        const host = req.headers.host ?? 'localhost:5173'
        const origin = resolveOrigin(`http://${host}`)

        if (path === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(buildSitemap(origin).xml)
        } else {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(buildRobots(origin))
        }
      })
    },

    generateBundle() {
      const origin = resolveOrigin()
      const { xml, count, pages } = buildSitemap(origin)

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(origin) })

      this.info?.(
        `sitemap.xml: ${count} URLs (${pages} pages x ${LOCALES.length} locales) at ${origin}`,
      )
    },
  }
}
