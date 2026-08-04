import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { productPath } from '../data/products'
import { industryPath } from '../data/industries'
import { useProducts, useIndustries, useSite } from '../i18n/content'
import { useLocale } from '../i18n/useLocale'
import { Brand } from './Header'
import { Stagger, StaggerItem } from './Reveal'

/** Sitemap footer, present on every route. */
export function Footer() {
  const { t, lp } = useLocale()
  const products = useProducts()
  const industries = useIndustries()
  const localSite = useSite()

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        {/* The four columns sweep in as the page bottoms out. Stagger, not a
            single fade: the footer is a sitemap, and revealing the columns in
            reading order is what makes it scan as one. */}
        <Stagger className="container footer-grid" stagger={0.08}>
          <StaggerItem className="footer-col">
            <span className="brand brand--onDark">
              <Brand chip />
            </span>
            <p className="footer__blurb">{t('ui.footer.blurb')}</p>

            {/* Phone, inboxes and address sit together: they are all "how to
                reach us". The address used to live under Company two columns
                away, which split the contact details and left that column
                ragged. */}
            <h2 className="footer__heading">{t('ui.footer.reach')}</h2>
            <ul className="footer__list footer__contact">
              <li>
                <span className="footer__label">{t('ui.footer.phoneLabel')}</span>
                <a className="footer__link latin" dir="ltr" href={site.phone.href}>
                  {site.phone.display}
                </a>
              </li>
              <li>
                <span className="footer__label">{t('ui.footer.salesLabel')}</span>
                <a className="footer__link latin" dir="ltr" href={`mailto:${site.emails.sales}`}>
                  {site.emails.sales}
                </a>
              </li>
              <li>
                <span className="footer__label">{t('ui.footer.infoLabel')}</span>
                <a className="footer__link latin" dir="ltr" href={`mailto:${site.emails.info}`}>
                  {site.emails.info}
                </a>
              </li>
              <li>
                <span className="footer__label">{t('ui.footer.directLabel')}</span>
                <a className="footer__link latin" dir="ltr" href={`mailto:${site.emails.direct}`}>
                  {site.emails.direct}
                </a>
              </li>
            </ul>

            <h2 className="footer__heading">{t('ui.footer.address')}</h2>
            <address className="footer__address">
              {localSite.address.lines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </address>
          </StaggerItem>

          <StaggerItem as="nav" className="footer-col" aria-label={t('ui.footer.products')}>
            <h2 className="footer__heading">{t('ui.footer.products')}</h2>
            <ul className="footer__list">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link className="footer__link" to={lp(productPath(product))}>
                    {product.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="footer__link footer__link--all" to={lp('/products')}>
                  {t('ui.footer.allProducts')}
                </Link>
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem as="nav" className="footer-col" aria-label={t('ui.footer.industries')}>
            <h2 className="footer__heading">{t('ui.footer.industries')}</h2>
            <ul className="footer__list">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link className="footer__link" to={lp(industryPath(industry))}>
                    {industry.shortName}
                  </Link>
                  {industry.children && (
                    <ul>
                      {industry.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            className="footer__link footer__link--child"
                            to={lp(industryPath(child, industry))}
                          >
                            {child.shortName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem as="nav" className="footer-col" aria-label={t('ui.footer.company')}>
              <h2 className="footer__heading">{t('ui.footer.company')}</h2>
              <ul className="footer__list">
                <li>
                  <Link className="footer__link" to={lp('/')}>
                    {t('ui.footer.home')}
                  </Link>
                </li>
                <li>
                  <Link className="footer__link" to={lp('/about')}>
                    {t('ui.footer.about')}
                  </Link>
                </li>
                <li>
                  <Link className="footer__link" to={lp('/brands')}>
                    {t('ui.footer.brands')}
                  </Link>
                </li>
                <li>
                  <Link className="footer__link" to={lp('/contact')}>
                    {t('ui.footer.contact')}
                  </Link>
                </li>
                <li>
                  <Link className="footer__link" to={lp('/legal')}>
                    {t('ui.footer.legal')}
                  </Link>
                </li>
              </ul>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Slim full-width legal bar, flush to the bottom of the page.
          Separators are aria-hidden so screen readers don't announce
          "vertical bar" between each clause. */}
      <div className="legal-bar">
        <p className="container legal-bar__text">
          <span>{t('ui.footer.rights', { year: site.year, name: site.legalName })}</span>
          <span className="legal-bar__sep" aria-hidden="true">
            |
          </span>
          <span>
            {t('ui.footer.credit')}{' '}
            <a
              className="legal-bar__link"
              href={site.credit.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.credit.label}
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}
