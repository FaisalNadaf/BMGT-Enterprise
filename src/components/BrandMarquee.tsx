import { useReducedMotion } from 'framer-motion'
import { useBrands } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'

type Props = {
  /** Seconds for one full pass. Slower reads as calmer. */
  duration?: number
}

/**
 * Continuous logo strip. The track holds two identical rows, so animating it
 * to translateX(-50%) lands exactly one row along and the loop is seamless.
 * The animation is CSS (see components.css) rather than Framer: an infinite
 * transform is one of the few things CSS does more cheaply, and it keeps the
 * pause-on-hover behaviour to a single :hover rule.
 *
 * Reduced motion: the duplicate row is not rendered at all and the strip
 * becomes a plain horizontal scroller. Rendering it and hiding it would leave
 * eleven duplicate images in the DOM for no reason.
 */
export function BrandMarquee({ duration = 42 }: Props) {
  const reduced = useReducedMotion()
  const brands = useBrands()
  const { t } = useLocale()

  return (
    <div
      className={`marquee${reduced ? '' : ' marquee--animated'}`}
      style={{ '--mq-dur': `${duration}s` } as React.CSSProperties}
    >
      <div className="marquee__track">
        <ul className="marquee__row">
          {brands.map((brand) => (
            <li className="logo-cell" key={brand.name}>
              <img
                src={brand.logo}
                alt={t('ui.brands.logoAlt', { name: brand.name })}
                width={400}
                height={160}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>

        {!reduced && (
          /* Exact copy, hidden from assistive tech so the eleven brands are
             announced once. */
          <ul className="marquee__row" aria-hidden="true">
            {brands.map((brand) => (
              <li className="logo-cell" key={`${brand.name}-dup`}>
                <img
                  src={brand.logo}
                  alt=""
                  width={400}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
