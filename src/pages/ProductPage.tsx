import { PageShell } from '../components/PageShell'
import { PageHero } from '../components/PageHero'
import { SectionHead } from '../components/SectionHead'
import { Button } from '../components/Button'
import { CTABand } from '../components/CTABand'
import { Reveal } from '../components/Reveal'
import { RevealImage } from '../components/RevealImage'
import { useProduct } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'

type Props = { slug: string }

/**
 * One layout for all eight categories, driven entirely by data/products.ts.
 * Everything below the intro is category-level by design — see the review flag
 * at the foot of the page.
 *
 * The "Related industries" and "Other categories" chip rows that used to close
 * this page have been removed; `industries`/`products` are no longer read here.
 */
export default function ProductPage({ slug }: Props) {
  const { t, lp } = useLocale()
  const product = useProduct(slug)
  if (!product) return null

  return (
    <PageShell
      title={product.name}
      description={t('ui.product.description', { name: product.name, blurb: product.blurb })}
    >
      <PageHero
        eyebrow={t('ui.product.heroEyebrow')}
        title={product.name}
        sub={product.blurb}
        image={product.image}
        crumbs={[
          { label: t('ui.crumbs.home'), to: lp('/') },
          { label: t('ui.product.crumbProducts'), to: lp('/products') },
          { label: product.shortName },
        ]}
      />

      <section className="section">
        <div className="container detail">
          <Reveal className="detail__copy" direction="left">
            <SectionHead eyebrow={t('ui.product.overviewEyebrow')} title={t('ui.product.overviewTitle')} flush />
            <p className="detail__lead">{product.intro}</p>
            <p>{product.detail}</p>

            <div className="about__actions">
              <Button to={lp('/contact')} arrow>
                {t('ui.product.requestQuote')}
              </Button>
            </div>
          </Reveal>

          <Reveal className="detail__aside" delay={0.12} direction="right">
            <figure className="detail__figure">
              <img
                className="detail__img"
                src={product.image}
                width={900}
                height={600}
                loading="lazy"
                decoding="async"
                alt={product.imageAlt}
                aria-hidden={product.imageAlt === '' ? true : undefined}
              />
            </figure>

            <div className="detail__panel">
              <p className="detail__panel-lead">{product.blurb}</p>
           
            </div>
          </Reveal>
        </div>

       
      </section>

      {/* ── CATALOGUE ─────────────────────────────────────────────────────
          The imported line items, with the photography recovered from the
          origin site (the HTTrack mirror held only zero-byte stubs). One entry
          has no image — see the fallback tile below. */}
      {product.subProducts.length > 0 && (
        <section className="section section--mist" aria-labelledby="catalogue-head">
          <div className="container">
            <Reveal direction="left">
              <SectionHead
                eyebrow={t('ui.product.catalogueEyebrow')}
                title={t('ui.product.catalogueTitle', { count: product.subProducts.length })}
                id="catalogue-head"
              />
            </Reveal>

            {/* Per-card reveals, NOT a parent <Stagger>.
                A Stagger fires once, when its container crosses the viewport
                threshold, and then runs every child's delay off that single
                moment. This grid is 22 items and several screens tall, so the
                container is "in view" while rows 4–8 are still far below the
                fold — they would finish animating before you ever scrolled to
                them, which is the same reason the sections looked static.

                Giving each card its own whileInView means a card moves when
                that card arrives. Scrolling the catalogue now reveals it
                continuously all the way down instead of once at the top.

                The delay cascades across each row (index % 3) rather than
                across the whole list, so neighbours land in quick succession
                and the sequence restarts every row. 3 is the widest the grid
                goes; at the 2- and 1-column breakpoints the pattern still
                offsets neighbours, just on a different cycle. */}
            <ul className="cat-grid">
              {product.subProducts.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.name}
                  direction="up"
                  y={48}
                  delay={(index % 3) * 0.09}
                >
                  <article className="cat">
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
                        /* One item's photograph is gone from the origin. A
                           lettered tile keeps the grid even rather than
                           leaving a broken frame in the middle of it. */
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
                </Reveal>
              ))}
            </ul>

    
          </div>
        </section>
      )}


      <CTABand
        title={t('ui.product.ctaTitle', { name: product.shortName })}
        sub={t('ui.cta.sub')}
        action={t('ui.product.requestQuote')}
      />
    </PageShell>
  )
}
