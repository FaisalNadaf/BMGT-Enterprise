import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DEFAULT_LOCALE, DIR, isLocale, storeLocale, type Locale } from './index'

/** Slug used to build a translation key from an English name. */
export const slugKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\//g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Prefix an app path with a locale. Paths are stored unprefixed everywhere in
 * the data layer, so every <Link> runs through this.
 */
export function localePath(path: string, locale: Locale) {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean === '/' ? '' : clean}`
}

/** Strip a leading /en or /ar, giving the app-relative path back. */
export function stripLocale(pathname: string) {
  const m = pathname.match(/^\/(en|ar)(?=\/|$)/)
  return m ? pathname.slice(m[0].length) || '/' : pathname
}

export function useLocale() {
  const { locale: raw } = useParams()
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  /** Locale-aware href builder — use for every internal link. */
  const lp = useCallback((path: string) => localePath(path, locale), [locale])

  /**
   * Switch language without leaving the page: swap the prefix on the current
   * URL and keep search + hash. Sending the user home on every switch is the
   * most common mistake in a bilingual site.
   */
  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return
      storeLocale(next)
      navigate(
        `${localePath(stripLocale(location.pathname), next)}${location.search}${location.hash}`,
        { replace: false },
      )
    },
    [locale, location.hash, location.pathname, location.search, navigate],
  )

  return { locale, dir: DIR[locale], isRTL: locale === 'ar', t, lp, setLocale }
}
