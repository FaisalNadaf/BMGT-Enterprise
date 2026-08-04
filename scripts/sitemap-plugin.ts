import type { Plugin } from 'vite'
import { products, productPath } from '../src/data/products'
import { allIndustryRoutes, industryPath } from '../src/data/industries'
import { LOCALES } from '../src/i18n'

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
 * ── Format ─────────────────────────────────────────────────────────────────
 * Plain sitemaps.org 0.9 and nothing else: one namespace, and loc / lastmod /
 * changefreq / priority per entry, matching the house format used on
 * cubiccode.in so the two files read the same way.
 *
 * Deliberately NOT here, having been tried and removed on request:
 *
 *   xhtml:link hreflang alternates. Every page exists at /en/… and /ar/…, and
 *   the sitemap is silent about the relationship between the two. PageShell
 *   still emits <link rel="alternate" hreflang> at runtime, so the pairing is
 *   declared — but only to crawlers that execute JavaScript. If Search Console
 *   starts reporting the ar and en copies as duplicates competing with each
 *   other, this is the first thing to put back.
 *
 *   image:image entries. The catalogue photography is rendered client-side, so
 *   nothing in the served HTML names those files either. If image search
 *   traffic matters later, that is the second thing to put back.
 *
 * Both were working; `git log` on this file has the implementation.
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

/*
 * ── changefreq / priority ──────────────────────────────────────────────────
 * Worth knowing what these buy: Google has said outright that it ignores both.
 * Bing and several smaller crawlers still read them. They are therefore
 * harmless and mildly useful — provided the numbers describe the site honestly
 * rather than being padded, which is the failure mode that made Google stop
 * trusting them in the first place. So: `priority` is relative *within this
 * site only* (it is not a ranking dial), and `changefreq` says how often the
 * page's content is expected to change, not how often it is redeployed.
 *
 * The catalogue is the commercial core of the site, so product pages sit above
 * sector pages; /legal is boilerplate and sits at the bottom.
 */
type Rank = { changefreq: string; priority: string }

const RANKS: Record<string, Rank> = {
  '/': { changefreq: 'weekly', priority: '1' },
  '/products': { changefreq: 'weekly', priority: '0.9' },
  '/contact': { changefreq: 'monthly', priority: '0.8' },
  '/about': { changefreq: 'monthly', priority: '0.7' },
  '/brands': { changefreq: 'monthly', priority: '0.6' },
  '/legal': { changefreq: 'yearly', priority: '0.3' },
}

function rankFor(path: string): Rank {
  const stated = RANKS[path]
  if (stated) return stated
  /* Catalogue detail: the eight category pages carry the product copy people
     actually search for. */
  if (path.startsWith('/products/')) return { changefreq: 'monthly', priority: '0.8' }
  /* Sector pages — a child (/industries/construction/granite) sits one step
     below its parent, mirroring the nesting. */
  if (path.startsWith('/industries/')) {
    const depth = path.split('/').filter(Boolean).length
    return { changefreq: 'monthly', priority: depth > 2 ? '0.6' : '0.7' }
  }
  return { changefreq: 'monthly', priority: '0.5' }
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
  /* Full ISO timestamp, matching the house format. It is build time, not
     content-edit time — a static build has no other date to offer — so every
     URL carries the same stamp and it moves on every deploy. Treat it as "as of
     this deploy" rather than as a per-page edit date. */
  const lastmod = new Date().toISOString()

  const paths = allPaths()

  const urls = LOCALES.flatMap((locale) =>
    paths.map((path) => {
      const { changefreq, priority } = rankFor(path)

      /* Element order is not cosmetic: the sitemaps.org schema declares <url>
         as a sequence of loc, lastmod, changefreq, priority. A validator
         rejects the file if they are reordered. */
      return [
        '  <url>',
        `    <loc>${escapeXml(localised(origin, locale, path))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    }),
  )

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
