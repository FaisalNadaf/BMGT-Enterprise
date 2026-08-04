import { useState, type FormEvent } from 'react'
import { PageShell } from '../components/PageShell'
import { PageHero } from '../components/PageHero'
import { SectionHead } from '../components/SectionHead'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { site } from '../data/site'
import { useSite } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'

type Fields = {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

const EMPTY: Fields = { name: '', company: '', email: '', phone: '', message: '' }

export default function Contact() {
  const { t } = useLocale()
  const localSite = useSite()
  /* Google takes its own language code; ar renders the map labels in Arabic. */
  const mapLang = t('ui.contact.mapLang')
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [sent, setSent] = useState(false)

  const update =
    (key: keyof Fields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: event.target.value }))
      setSent(false)
    }

  /**
   * TODO: wire to Formspree/email service.
   *
   * Until there is a backend, submitting hands the enquiry to the visitor's own
   * mail client with everything pre-filled. That is honest — nothing is
   * silently dropped — but it does depend on a configured mail client, which is
   * why the direct addresses sit beside the form rather than behind it.
   *
   * To switch: POST `fields` to the endpoint, await the response, and set
   * `sent` from it instead of opening the mailto.
   */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const subject = fields.company
      ? t('ui.contact.subjectWithCompany', { name: fields.name, company: fields.company })
      : t('ui.contact.subject', { name: fields.name })
    /* Labels in the mail body follow the page language too — the recipient
       reads it in whatever language the sender was using. */
    const body = [
      `${t('ui.contact.name')}: ${fields.name}`,
      `${t('ui.contact.company')}: ${fields.company || '—'}`,
      `${t('ui.contact.email')}: ${fields.email}`,
      `${t('ui.contact.phone')}: ${fields.phone || '—'}`,
      '',
      fields.message,
    ].join('\n')

    window.location.href = `mailto:${site.emails.sales}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <PageShell
      title={t('ui.contact.title')}
      description={t('ui.contact.description', { phone: site.phone.display, email: site.emails.sales })}
    >
      {/* The Dubai waterfront — this page is about reaching the operation
          that sits behind it. */}
      <PageHero
        eyebrow={t('ui.contact.heroEyebrow')}
        title={t('ui.contact.heroTitle')}
        sub={t('ui.contact.heroSub')}
        image="/images/hero-port.jpg"
        crumbs={[{ label: t('ui.crumbs.home'), to: '/' }, { label: t('ui.contact.title') }]}
      />

      <section className="section">
        <div className="container contact">
          <Reveal className="form-card" direction="left">
            <SectionHead eyebrow={t('ui.contact.formEyebrow')} title={t('ui.contact.formTitle')} flush />

            <form className="form form--spaced" onSubmit={onSubmit}>
              <div className="form__row">
                <div className="field">
                  <label className="field__label" htmlFor="name">
                    {t('ui.contact.name')} <span className="field__req">{t('ui.contact.required')}</span>
                  </label>
                  <input
                    className="field__input"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={fields.name}
                    onChange={update('name')}
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="company">
                    {t('ui.contact.company')}
                  </label>
                  <input
                    className="field__input"
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={fields.company}
                    onChange={update('company')}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="field">
                  <label className="field__label" htmlFor="email">
                    {t('ui.contact.email')} <span className="field__req">{t('ui.contact.required')}</span>
                  </label>
                  <input
                    className="field__input"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={fields.email}
                    onChange={update('email')}
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="phone">
                    {t('ui.contact.phone')}
                  </label>
                  <input
                    className="field__input"
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={fields.phone}
                    onChange={update('phone')}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="message">
                  {t('ui.contact.message')} <span className="field__req">{t('ui.contact.required')}</span>
                </label>
                {/* Expectations before the field, not after a failed submit. */}
                <p className="field__help" id="message-help">
                  {t('ui.contact.messageHelp')}
                </p>
                <textarea
                  className="field__textarea"
                  id="message"
                  name="message"
                  required
                  placeholder={t('ui.contact.messagePlaceholder')}
                  aria-describedby="message-help"
                  value={fields.message}
                  onChange={update('message')}
                />
              </div>

              <div className="about__actions">
                <Button type="submit" size="lg" arrow>
                  {t('ui.contact.submit')}
                </Button>
              </div>

           

              {/* The live region itself is always mounted — a region that
                  appears at the same moment its text does is often missed by
                  screen readers. Only the message inside it is conditional. */}
              <div role="status" aria-live="polite">
                {sent && (
                  <p className="form__status">
                    {t('ui.contact.sent', { email: site.emails.sales })}
                  </p>
                )}
              </div>

            </form>
          </Reveal>

          <Reveal delay={0.12} className="contact-cards" direction="right">
            {/* Phone leads — the fastest route to an answer, so it is a card of
                its own rather than the first of four equal rows. */}
            <div className="contact-card contact-card--lead">
              <p className="contact-card__label">{t('ui.contact.panelPhone')}</p>
              <a className="contact-card__phone latin" dir="ltr" href={site.phone.href}>
                {site.phone.display}
              </a>
              <p className="contact-card__note">{t('ui.contact.responseNote')}</p>
              <div className="contact-card__action">
                <Button href={site.phone.href} variant="light" block>
                  {t('ui.contact.callUs')}
                </Button>
              </div>
            </div>

            <div className="contact-card">
              <p className="contact-card__label">{t('ui.contact.panelEmail')}</p>
              <dl className="contact-card__list">
                <div className="contact-card__row">
                  <dt>{t('ui.footer.salesLabel')}</dt>
                  <dd>
                    <a className="latin" dir="ltr" href={`mailto:${site.emails.sales}`}>
                      {site.emails.sales}
                    </a>
                  </dd>
                </div>
                <div className="contact-card__row">
                  <dt>{t('ui.footer.infoLabel')}</dt>
                  <dd>
                    <a className="latin" dir="ltr" href={`mailto:${site.emails.info}`}>
                      {site.emails.info}
                    </a>
                  </dd>
                </div>
                <div className="contact-card__row">
                  <dt>{t('ui.footer.directLabel')}</dt>
                  <dd>
                    <a className="latin" dir="ltr" href={`mailto:${site.emails.direct}`}>
                      {site.emails.direct}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Where and when belong together — one card, not two. */}
            <div className="contact-card">
              <p className="contact-card__label">{t('ui.contact.panelAddress')}</p>
              <address>
                {localSite.address.lines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
              <div className="contact-card__sub">
                <p className="contact-card__label">{t('ui.contact.panelHours')}</p>
                <p style={{ marginTop: '0.5rem' }}>{t('ui.contact.hours')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--mist" aria-labelledby="map-head">
        <div className="container">
          <Reveal direction="left">
            <SectionHead
              eyebrow={t('ui.contact.locationEyebrow')}
              title={t('ui.contact.locationTitle')}
              id="map-head"
            />
          </Reveal>

          <Reveal delay={0.08}>
            {/* ⚠️ This is the site's only third-party embed. Google sets
                cookies and receives the visitor's IP on load, which is why
                /legal's privacy section was updated to say so — if this map is
                ever removed, that clause has to go back. `loading="lazy"` keeps
                it off the wire until it is scrolled near. */}
            <div className="map">
              <iframe
                className="map__frame"
                title={t('ui.contact.mapTitle')}
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238.34305217391687!2d55.30335268946336!3d25.159549244965138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69c36f082541%3A0x16f65b407bb87f9!2sMeydan%20Grandstand!5e1!3m2!1s${mapLang}!2sae!4v1785752716519!5m2!1s${mapLang}!2sae`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="map__actions">
              <Button
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  site.address.query,
                )}`}
                variant="outline"
                size="sm"
                arrow
              >
                {t('ui.contact.openInMaps')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
