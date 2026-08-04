import { useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { DEFAULT_LOCALE, DIR, detectLocale, isLocale, storeLocale } from './index'

/**
 * Owns the active locale for everything under `/:locale`.
 *
 * The URL is the source of truth: an unknown or missing prefix redirects to
 * the stored/detected one rather than rendering in the wrong language, so a
 * link someone shares always opens in the language it was written in.
 *
 * `lang` and `dir` go on <html> through Helmet. The matching pre-paint script
 * in index.html sets them before React mounts — without it the first frame is
 * LTR and the whole page visibly flips.
 */
export function LocaleLayout() {
  const { locale } = useParams()
  const { i18n } = useTranslation()

  const valid = isLocale(locale)

  useEffect(() => {
    if (!valid) return
    if (i18n.language !== locale) i18n.changeLanguage(locale)
    storeLocale(locale)
  }, [i18n, locale, valid])

  if (!valid) return <Navigate to={`/${detectLocale()}`} replace />

  return (
    <>
      <Helmet htmlAttributes={{ lang: locale, dir: DIR[locale] }} />
      <Outlet />
    </>
  )
}

/** Bare `/` — send to the stored or browser-detected locale. */
export function LocaleRedirect() {
  const target = typeof window === 'undefined' ? DEFAULT_LOCALE : detectLocale()
  const { pathname, search, hash } = window.location
  const rest = pathname === '/' ? '' : pathname
  return <Navigate to={`/${target}${rest}${search}${hash}`} replace />
}
