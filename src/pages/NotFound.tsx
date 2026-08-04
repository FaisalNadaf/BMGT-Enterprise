import { PageShell } from '../components/PageShell'
import { PageHero } from '../components/PageHero'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { productPath } from '../data/products'
import { useProducts } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const { t, lp } = useLocale()
  const products = useProducts()

  return (
    <PageShell
      title={t('ui.notFound.title')}
      description={t('ui.notFound.description')}
    >
      {/* A dark band like every other route. The header floats over the page
          transparent until you scroll, which only works if the top of every
          route is dark — this was the one page that opened on white. */}
      <PageHero
        eyebrow={t('ui.notFound.heroEyebrow')}
        title={t('ui.notFound.heroTitle')}
        sub={t('ui.notFound.heroSub')}
        crumbs={[{ label: t('ui.crumbs.home'), to: lp('/') }, { label: t('ui.notFound.crumb') }]}
      />

      <section className="section">
        <div className="container">
          <Reveal className="notfound">
            <div className="about__actions">
              <Button to={lp('/')}>{t('ui.notFound.backHome')}</Button>
              <Button to={lp('/contact')} variant="outline" arrow>
                {t('ui.notFound.contact')}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="brands__note">{t('ui.notFound.categories')}</p>
            <div className="chips">
              {products.map((product) => (
                <Link className="chip" key={product.slug} to={lp(productPath(product))}>
                  {product.shortName}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
