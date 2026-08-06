import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sitemap } from './scripts/sitemap-plugin'
import { contactDev } from './scripts/contact-dev-plugin'

// Static build. Deploy the contents of dist/ behind an SPA fallback rewrite
// (public/_redirects covers Netlify; see README for Vercel/Apache/nginx).
//
// sitemap() emits dist/sitemap.xml and dist/robots.txt from the same route data
// App.tsx uses, so they cannot drift from the real routes. It reads SITE_URL for
// the origin — set that once a custom domain is live.
//
// contactDev() is dev-only: it mounts the Netlify contact function at
// /api/contact so the form can be tested with `npm run dev`. In a build that
// route is Netlify's, via the /api/* rule in public/_redirects.
export default defineConfig({
  plugins: [react(), sitemap(), contactDev()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
