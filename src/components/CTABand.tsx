import { SectionHead } from './SectionHead'
import { Button } from './Button'
import { Reveal } from './Reveal'
import { site } from '../data/site'
import { useLocale } from '../i18n/useLocale'

type Props = {
  eyebrow?: string
  title?: string
  sub?: string
  /** Primary action label. Always routes to /contact. */
  action?: string
}

/** Closing band on every page. Blue, copy left, action right. */
export function CTABand({ eyebrow, title, sub, action }: Props) {
  const { t, lp } = useLocale()
  /* Defaults live in the dictionary rather than in the signature, so the
     fallback copy is translated too. */
  const eb = eyebrow ?? t('ui.cta.eyebrow')
  const ti = title ?? t('ui.cta.title')
  const su = sub ?? t('ui.cta.sub')
  const ac = action ?? t('ui.cta.action')

  return (
    <section className="section section--blue cta-band">
      <Reveal className="container cta-band__inner">
        <div className="cta-band__text">
          <SectionHead eyebrow={eb} title={ti} />
          <p className="cta-band__sub">{su}</p>
        </div>
        <div className="cta-band__actions">
          <Button to={lp('/contact')} variant="light" size="lg">
            {ac}
          </Button>
          {/* Phone number is never translated — it is dialled, not read. */}
          <Button href={site.phone.href} variant="outline-light" size="lg">
            <span className="latin" dir="ltr">{site.phone.display}</span>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
