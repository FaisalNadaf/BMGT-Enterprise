import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sitemap } from './scripts/sitemap-plugin'

// Static build. Deploy the contents of dist/ behind an SPA fallback rewrite
// (public/_redirects covers Netlify; see README for Vercel/Apache/nginx).
//
// sitemap() emits dist/sitemap.xml and dist/robots.txt from the same route data
// App.tsx uses, so they cannot drift from the real routes. It reads SITE_URL for
// the origin — set that once a custom domain is live.
export default defineConfig({
  plugins: [react(), sitemap()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
