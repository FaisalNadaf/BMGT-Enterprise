import { useLayoutEffect, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { site } from '../data/site'
import { useLocale } from '../i18n/useLocale'
import { stripLocale } from '../i18n/useLocale'
import { LOCALES } from '../i18n'

type Props = {
  /** Page name; the company suffix is appended here so callers don't repeat it. */
  title: string
  description: string
  children: ReactNode
}

/**
 * Per-page <head> plus the scroll reset.
 *
 * The reset lives here rather than in a router-level listener on purpose:
 * PageShell remounts when the route key changes, which is exactly the moment
 * the incoming page appears. A listener on `location` would fire while the
 * outgoing page is still fading out, so you would watch the old page jump.
 */
export function PageShell({ title, description, children }: Props) {
  const { locale } = useLocale()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  /* hreflang alternates for the same page in the other locale, plus a
     self-canonical. Built from the current path with its prefix swapped. */
  const path = stripLocale(typeof window === 'undefined' ? '/' : window.location.pathname)
  const href = (l: string) =>
    typeof window === 'undefined' ? '' : `${window.location.origin}/${l}${path === '/' ? '' : path}`

  return (
    <>
      <Helmet>
        <title>{`${title} | ${site.name}`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} | ${site.name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale === 'ar' ? 'ar_AE' : 'en_GB'} />
        <link rel="canonical" href={href(locale)} />
        {LOCALES.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={href(l)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={href('en')} />
      </Helmet>
      {children}
    </>
  )
}
