import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static build. Deploy the contents of dist/ behind an SPA fallback rewrite
// (public/_redirects covers Netlify; see README for Vercel/Apache/nginx).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
