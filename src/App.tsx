import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// import { TopBar } from './components/TopBar'  // top bar currently disabled
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ScrollProgress } from './components/ScrollProgress'
import { pageVariants } from './lib/motion'
import { products } from './data/products'
import { allIndustryRoutes } from './data/industries'
import { LocaleLayout, LocaleRedirect } from './i18n/LocaleLayout'
import Home from './pages/Home'
import About from './pages/About'
import Brands from './pages/Brands'
import Contact from './pages/Contact'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import Products from './pages/Products'
import ProductPage from './pages/ProductPage'
import IndustryPage from './pages/IndustryPage'

/**
 * Chrome + page transition. Lives inside the locale route rather than above
 * it, because Header and Footer read the active locale from the route params
 * to build their links — outside `/:locale` those params do not exist.
 */
function Shell() {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <>
      <a className="skip-link" href="#main">
        {t('ui.skip')}
      </a>

      {/* <TopBar /> */}
      <ScrollProgress />
      <Header />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          /* Focusable so the skip link actually moves focus, not just scroll. */
          tabIndex={-1}
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </>
  )
}

/**
 * 21 routes × 2 locales. Product and industry routes are generated from
 * data/*.ts, so adding a category adds its route, its mega-menu entry, its
 * card and its footer link in one edit — they cannot drift apart.
 *
 *   /                                          → redirect to stored locale
 *   /:locale                                   Home
 *   /:locale/about                             About Us
 *   /:locale/products  + /products/<8>         index + detail
 *   /:locale/industries/<4> + /construction/<2>
 *   /:locale/brands  /legal  /contact
 *
 * Pages take a slug rather than a data object: the object has to come from the
 * translation hooks, which can only run inside the component.
 */
export default function App() {
  return (
    /* reducedMotion="user" is the belt; the braces are the explicit checks in
       Reveal/Counter/BrandMarquee that skip animation entirely rather than
       shortening it. */
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<LocaleRedirect />} />

        <Route path=":locale" element={<LocaleLayout />}>
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />

            <Route path="products" element={<Products />} />
            {products.map((product) => (
              <Route
                key={product.slug}
                path={`products/${product.slug}`}
                element={<ProductPage slug={product.slug} />}
              />
            ))}

            {allIndustryRoutes.map(({ industry, parent }) => (
              <Route
                key={parent ? `${parent.slug}/${industry.slug}` : industry.slug}
                path={
                  parent
                    ? `industries/${parent.slug}/${industry.slug}`
                    : `industries/${industry.slug}`
                }
                element={<IndustryPage slug={industry.slug} parentSlug={parent?.slug} />}
              />
            ))}

            <Route path="brands" element={<Brands />} />
            <Route path="legal" element={<Legal />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Anything without a locale prefix — /about, a stale bookmark. */}
        <Route path="*" element={<LocaleRedirect />} />
      </Routes>
    </MotionConfig>
  )
}
