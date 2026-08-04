import { PageShell } from '../components/PageShell'
import { PageHero } from '../components/PageHero'
import { SectionHead } from '../components/SectionHead'
import { CTABand } from '../components/CTABand'
import { Reveal, Stagger, StaggerItem } from '../components/Reveal'
import { useBrands, useBrandsNote } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'

export default function Brands() {
  const { t, lp } = useLocale()
  const brands = useBrands()
  const brandsNote = useBrandsNote()

  return (
    <PageShell
      title={t('ui.brands.title')}
      description={t('ui.brands.description')}
    >
      {/* Bearings: SKF and FAG are two of the eleven marks, so the shelf is
          literally what this page is about. */}
      <PageHero
        eyebrow={t('ui.brands.heroEyebrow')}
        title={t('ui.brands.heroTitle')}
        sub={brandsNote}
        image="/images/product-03-mechanical.jpg"
        crumbs={[{ label: t('ui.crumbs.home'), to: lp('/') }, { label: t('ui.brands.title') }]}
      />

      <section className="section">
        <div className="container">
          <Reveal direction="left">
            <SectionHead
              eyebrow={t('ui.brands.manufacturersEyebrow')}
              title={t('ui.brands.manufacturersTitle')}
              intro={t('ui.brands.manufacturersIntro')}
            />
          </Reveal>

          <Stagger as="ul" className="brand-grid" stagger={0.05}>
            {brands.map((brand) => (
              <StaggerItem as="li" key={brand.name} className="brand-grid__item">
                <span className="logo-cell">
                  <img
                    src={brand.logo}
                    alt={t('ui.brands.logoAlt', { name: brand.name })}
                    width={400}
                    height={160}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="brand-grid__name">{brand.field}</span>
              </StaggerItem>
            ))}
          </Stagger>

          {/* TODO: confirm with client — these eleven affiliations were carried
              over from the previous Belagavi site and should not be assumed to
              transfer to the Dubai entity. */}
      
        </div>
      </section>

 
      <CTABand
        title={t('ui.brands.ctaTitle')}
        sub={t('ui.brands.ctaSub')}
      />
    </PageShell>
  )
}
