import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { PageHero } from '../components/PageHero'
import { SectionHead } from '../components/SectionHead'
import { CTABand } from '../components/CTABand'
import { Reveal } from '../components/Reveal'
import { RevealImage } from '../components/RevealImage'
import { ArrowRight } from '../components/Icons'
import { productPath, subProductCount } from '../data/products'
import { useProducts } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'

/**
 * Catalogue index. The home page's tile grid is a visual teaser; this is the
 * reference version — every category with its line count, so a buyer can see
 * the shape of the catalogue before opening anything.
 */
export default function Products() {
  const { t, lp } = useLocale()
  const products = useProducts()

  return (
    <PageShell
      title={t('ui.products.title')}
      description={t('ui.products.description')}
    >
      {/* Racked stock — the nearest thing in the library to a general
          materials yard. A single category photo would imply that one
          category was the whole catalogue. */}
      <PageHero
        eyebrow={t('ui.products.heroEyebrow')}
        title={t('ui.products.heroTitle')}
        sub={t('ui.products.heroSub')}
        image="/images/product-05-steel.jpg"
        crumbs={[{ label: t('ui.crumbs.home'), to: lp('/') }, { label: t('ui.products.title') }]}
      />

      <section className="section" aria-labelledby="catalogue-index">
        <div className="container">
          <Reveal direction="left">
            <SectionHead
              eyebrow={t('ui.products.indexEyebrow')}
              title={t('ui.products.indexTitle')}
              intro={t('ui.products.indexIntro', { count: subProductCount })}
              id="catalogue-index"
            />
          </Reveal>

          {/* Per-card reveals for the same reason as the catalogue grid — see
              the note on ProductPage. Eight cards across four columns is two
              rows, and the second row sits below the fold on most screens, so
              a single parent trigger would animate it out of sight. The
              cascade runs across each row of four. */}
          <ul className="grid grid--4">
            {products.map((product, index) => (
              <Reveal
                as="li"
                key={product.slug}
                direction="up"
                y={48}
                delay={(index % 4) * 0.09}
              >
                <Link className="pcard" to={lp(productPath(product))}>
                  <span className="pcard__media">
                    <RevealImage
                      className="pcard__img"
                      src={product.image}
                      width={900}
                      height={600}
                      alt=""
                    />
                  </span>
                  <span className="pcard__body">
                    <span className="pcard__title">{product.name}</span>
                    <span className="pcard__blurb">{product.blurb}</span>
                    <span className="pcard__more">
                      {product.subProducts.length > 0
                        ? t('ui.products.lines', { count: product.subProducts.length })
                        : t('ui.products.viewCategory')}
                      <ArrowRight className="btn__arrow" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CTABand />
    </PageShell>
  )
}
