import { PageShell } from '../components/PageShell'
import { PageHero } from '../components/PageHero'
import { SectionHead } from '../components/SectionHead'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Button } from '../components/Button'
import { CTABand } from '../components/CTABand'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal'
import { RevealImage } from '../components/RevealImage'
import { industryPath } from '../data/industries'
import { useIndustry, useProducts } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'
import type { Crumb } from '../components/PageHero'

type Props = {
  slug: string
  /** Present for the two Construction sub-pages. */
  parentSlug?: string
}

/**
 * One layout for all six industry routes.
 *
 * Note the Oil & Gas entry in data/industries.ts carries its own copy. The
 * client's live site duplicates the maritime blurb there by mistake — that bug
 * is not reproduced here.
 */
export default function IndustryPage({ slug, parentSlug }: Props) {
  const { t, lp } = useLocale()
  const allProducts = useProducts()
  const industry = useIndustry(slug, parentSlug)
  const parent = useIndustry(parentSlug ?? '', undefined)

  /* Individual catalogue lines drawn from the sector's own categories — the
     chips below name the categories, this shows what is actually in them.
     Capped at 8: this is a sample that links onward, not the full list. */
  const lines = (industry?.products ?? [])
    .flatMap((slug) => allProducts.find((p) => p.slug === slug)?.subProducts ?? [])
    .slice(0, 8)


  if (!industry) return null

  const crumbs: Crumb[] = [
    { label: t('ui.crumbs.home'), to: lp('/') },
    { label: t('ui.industry.crumbIndustries') },
    ...(parent ? [{ label: parent.shortName, to: lp(industryPath(parent)) }] : []),
    { label: industry.shortName },
  ]

  return (
    <PageShell
      title={industry.name}
      description={t('ui.industry.description', { name: industry.name, blurb: industry.blurb })}
    >
      <PageHero
        eyebrow={t('ui.industry.heroEyebrow')}
        title={industry.name}
        sub={industry.blurb}
        image={industry.image}
        crumbs={crumbs}
      />

      <section className="section">
        <div className="container detail">
          <Reveal className="detail__copy" direction="left">
            <SectionHead
              eyebrow={t('ui.industry.capabilityEyebrow')}
              title={t('ui.industry.capabilityTitle')}
              flush
            />
            <p className="detail__lead">{industry.lead}</p>
            <p>{industry.detail}</p>

            <div className="about__actions">
              <Button to={lp('/contact')} arrow>
                {t('ui.industry.talkCta')}
              </Button>
            </div>
          </Reveal>

          <Reveal className="detail__aside" delay={0.12} direction="right">
            <figure className="detail__figure">
              <img
                className="detail__img"
                src={industry.image}
                width={900}
                height={600}
                loading="lazy"
                decoding="async"
                alt={industry.imageAlt}
                aria-hidden={industry.imageAlt === '' ? true : undefined}
              />
            </figure>
            <div className="detail__panel">
              <p className="detail__panel-lead">{industry.blurb}</p>
         
            </div>
          </Reveal>
        </div>

   
      </section>

      {/* ── SUB-SECTORS (Construction only) ───────────────────────────────── */}
      {industry.children && industry.children.length > 0 && (
        <section className="section section--ink" aria-labelledby="sub-head">
          <div className="container">
            <Reveal direction="left">
              <SectionHead
                eyebrow={t('ui.industry.withinEyebrow')}
                title={t('ui.industry.withinTitle')}
                id="sub-head"
              />
            </Reveal>
            {/* A grid, not a carousel: this only ever holds Construction's two
                sub-sectors, and both fit side by side — a slider there is
                chrome around content that was already fully visible. */}
            <Stagger as="ul" className="grid grid--2" stagger={0.08}>
              {industry.children.map((child) => (
                <StaggerItem as="li" key={child.slug}>
                  <Card
                    title={child.name}
                    body={child.blurb}
                    to={lp(industryPath(child, industry))}
                    more={t('ui.industry.readMore')}
                    image={child.image}
                    onDark
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ── LINES INTO THIS SECTOR ─────────────────────────────────────────
          Structure carried over from the predecessor site's product carousel.
          Rendered as a static grid, not a carousel: nothing else on this site
          rotates, and a grid shows every item at once. Reuses the catalogue
          card, which already handles white cut-outs on a tinted well. */}
      {lines.length > 0 && (
        <section className="section" aria-labelledby="lines-head">
          <div className="container">
            <Reveal direction="left">
              <SectionHead
                eyebrow={t('ui.industry.linesEyebrow')}
                title={t('ui.industry.linesTitle')}
                id="lines-head"
              />
            </Reveal>

            <Carousel label={t('ui.industry.linesTitle')} perView={3}>
              {lines.map((item) => (
                <article className="cat" key={item.name}>
                  <span className="cat__media">
                    {item.image ? (
                      <RevealImage
                        className="cat__img"
                        src={item.image}
                        alt={item.name}
                        width={580}
                        height={450}
                      />
                    ) : (
                      <span className="cat__fallback" aria-hidden="true">
                        {item.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="cat__body">
                    <h3 className="cat__name">{item.name}</h3>
                    <p className="cat__line">{item.line}</p>
                  </span>
                </article>
              ))}
            </Carousel>

            <Reveal className="about__actions about__actions--center" delay={0.1}>
              <Button to={lp('/products')} variant="outline" arrow>
                {t('ui.industry.linesCta')}
              </Button>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── WHY WORK WITH US ───────────────────────────────────────────────
          Three reasons, written per sector. The predecessor's version of this
          block leaned on superlatives and unverified claims about scale and
          certification; this one stays concrete and claims nothing that has
          not been confirmed. */}
      <section className="section section--deep" aria-labelledby="why-head">
        <div className="container">
          <Reveal direction="left">
            <SectionHead
              eyebrow={t('ui.industry.whyEyebrow')}
              title={t('ui.industry.whyTitle')}
              id="why-head"
            />
          </Reveal>

          <Stagger as="ul" className="grid grid--3" stagger={0.08}>
            {industry.why.map((point) => (
              <StaggerItem as="li" key={point.title}>
                <Card title={point.title} body={point.body} onDark />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

  

      <CTABand
        title={t('ui.industry.ctaTitle', { name: industry.shortName })}
        sub={t('ui.cta.sub')}
      />
    </PageShell>
  )
}
