import { LOCALES, LOCALE_LABEL, type Locale } from '../i18n'
import { useLocale } from '../i18n/useLocale'

/**
 * Two-up language switch.
 *
 * A pair of buttons rather than a dropdown: with exactly two locales a select
 * costs an extra interaction and hides the alternative. Both options are
 * always visible, so the current language is legible at a glance.
 *
 * Each option carries its own `lang`, so a screen reader pronounces "العربية"
 * in Arabic instead of spelling it out in the page language.
 */
export function LocaleToggle({ block = false }: { block?: boolean }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      className={`lang${block ? ' lang--block' : ''}`}
      role="group"
      aria-label={t('ui.nav.language')}
    >
      {LOCALES.map((code: Locale) => {
        const active = code === locale
        return (
          <button
            key={code}
            type="button"
            lang={code}
            className={`lang__opt${active ? ' is-active' : ''}`}
            aria-pressed={active}
            /* The label alone reads as "English" with no verb; the full
               sentence tells a screen-reader user what the control does. */
            aria-label={t('ui.nav.switchTo', { name: LOCALE_LABEL[code] })}
            onClick={() => setLocale(code)}
          >
            {/* Short code on the bar, full native name in the drawer. */}
            <span aria-hidden="true">{block ? LOCALE_LABEL[code] : code.toUpperCase()}</span>
          </button>
        )
      })}
    </div>
  )
}
