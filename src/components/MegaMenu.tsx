import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { dropdownVariants, EASE } from '../lib/motion'
import { productPath } from '../data/products'
import { industryPath } from '../data/industries'
import { useProducts, useIndustries } from '../i18n/content'
import { stripLocale, useLocale } from '../i18n/useLocale'
import { ArrowRight, Caret } from './Icons'
import { NavIndicator } from './NavIndicator'

/**
 * The header mega-menus. Two shapes off one component:
 *
 *   layout="rows"   Products — 8 categories, thumbnail left, 4 across × 2 down.
 *   layout="stack"  Industries — 4 sectors, thumbnail on top, sub-pages listed
 *                   beneath each card as sibling links.
 *
 * The panel is positioned against `.site-header__inner` (which is
 * `position: relative`) rather than against its own `<li>`, so it spans the
 * container width instead of hanging off a trigger near the right edge and
 * overflowing the viewport. The `<li>` goes `position: static` for that to
 * resolve upward — see `.nav__item--mega`.
 *
 * The panel stays a DOM child of the `<li>` even though it is positioned
 * elsewhere. That is deliberate: `mouseleave` on the `<li>` then does not fire
 * when the pointer travels from trigger into panel, and the `blur` check can
 * ask one node whether focus is still inside the menu.
 */

export type MegaEntry = {
  to: string
  name: string
  blurb: string
  image: string
  children?: { to: string; name: string }[]
}

/* Hooks, not module constants: the labels come from the active locale, which
   only exists inside the tree. */
export function useProductEntries(): MegaEntry[] {
  return useProducts().map((p) => ({
    to: productPath(p),
    name: p.name,
    blurb: p.blurb,
    image: p.image,
  }))
}

export function useIndustryEntries(): MegaEntry[] {
  return useIndustries().map((i) => ({
    to: industryPath(i),
    name: i.name,
    blurb: i.blurb,
    image: i.image,
    children: (i.children ?? []).map((c) => ({ to: industryPath(c, i), name: c.name })),
  }))
}

/* Cells fade up in sequence as the panel opens. The parent only carries the
   stagger; the panel's own hidden/visible states drive it. No exit variant —
   the panel fades out as a whole, which is faster than unwinding eight cells. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
}
const cellVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
}

type Props = {
  label: string
  /** Which dictionary block and data set this panel is built from. */
  kind: 'products' | 'industries'
  /** Route prefix that marks the trigger active, e.g. "/products". */
  matchPrefix: string
  layout: 'rows' | 'stack'
}

export function MegaMenu({ label, kind, matchPrefix, layout }: Props) {
  const { t, lp } = useLocale()
  const productEntries = useProductEntries()
  const industryEntries = useIndustryEntries()

  const entries = kind === 'products' ? productEntries : industryEntries
  const headEyebrow = t(`ui.mega.${kind}Eyebrow`)
  const headTitle = t(`ui.mega.${kind}Title`)
  const footLead = t(`ui.mega.${kind}Foot`)
  const footCta = {
    label: t(`ui.mega.${kind}Cta`),
    to: kind === 'products' ? '/products' : '/contact',
  }
  const [open, setOpen] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const location = useLocation()
  /* The pathname carries a /en or /ar prefix; strip it before matching, or
     the trigger never lights up. */
  const sectionActive = stripLocale(location.pathname).startsWith(matchPrefix)

  /* Route change closes the panel — otherwise clicking an entry leaves the
     menu hanging over the page you just navigated to. */
  useEffect(() => setOpen(false), [location.pathname])

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  /* Outside click. Only bound while open, so there is no listener on the
     document for the 99% of the time every menu is shut. */
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!itemRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      close(true)
    }
    if (event.key === 'ArrowDown' && !open) {
      event.preventDefault()
      setOpen(true)
      /* Wait for the panel to mount before reaching into it. */
      requestAnimationFrame(() => {
        itemRef.current?.querySelector<HTMLAnchorElement>('.mega__link')?.focus()
      })
    }
  }

  return (
    <li
      className="nav__item nav__item--mega"
      ref={itemRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!itemRef.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        className={`nav__trigger${sectionActive ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <Caret className="nav__caret" />
        {sectionActive && <NavIndicator />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            className="mega"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mega__inner">
              <div className="mega__head">
                <p className="mega__head-eyebrow">{headEyebrow}</p>
                <p className="mega__head-title">{headTitle}</p>
              </div>

              <motion.ul
                className={`mega__grid mega__grid--${layout}`}
                variants={gridVariants}
              >
                {/* whileHover rather than a CSS :hover transform — Framer owns
                    the cell's inline transform, so a CSS one would never win.
                    MotionConfig reducedMotion="user" drops it. */}
                {entries.map((entry) => (
                  <motion.li
                    className="mega__cell"
                    key={entry.to}
                    variants={cellVariants}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.17, ease: EASE }}
                  >
                    <NavLink
                      to={lp(entry.to)}
                      end
                      className={({ isActive }) =>
                        `mega__link${isActive ? ' is-active' : ''}`
                      }
                    >
                      <span className="mega__thumb">
                        {/* Decorative: the name beside it carries the meaning. */}
                        <img
                          className="mega__img"
                          src={entry.image}
                          alt=""
                          width={300}
                          height={200}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="mega__text">
                        <span className="mega__name">
                          {entry.name}
                          <ArrowRight className="mega__arrow" />
                        </span>
                        <span className="mega__blurb">{entry.blurb}</span>
                      </span>
                    </NavLink>

                    {/* Sub-pages sit outside the parent link — an <a> cannot
                        nest inside another <a>. */}
                    {entry.children && entry.children.length > 0 && (
                      <ul className="mega__sub">
                        {entry.children.map((child) => (
                          <li key={child.to}>
                            <NavLink
                              to={lp(child.to)}
                              className={({ isActive }) =>
                                `mega__sublink${isActive ? ' is-active' : ''}`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </motion.ul>

              <p className="mega__foot">
                <span>{footLead}</span>
                <NavLink className="mega__foot-cta" to={lp(footCta.to)}>
                  {footCta.label}
                  <ArrowRight className="btn__arrow" />
                </NavLink>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
