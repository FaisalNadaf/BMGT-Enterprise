import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion'

/**
 * The single travelling underline beneath the active nav item.
 *
 * `layoutId` is global in Framer, so rendering this inside whichever item is
 * currently active is enough — on a route change the mark animates from the
 * old item's position to the new one instead of disappearing and reappearing.
 * Exactly one nav item is ever active, which is the precondition that makes a
 * shared layoutId safe here.
 *
 * Under reduced motion it renders as a plain span with no layoutId, so it
 * simply appears in place rather than sliding across the header.
 */
export function NavIndicator() {
  const reduced = useReducedMotion()

  if (reduced) return <span className="nav__indicator" aria-hidden="true" />

  return (
    <motion.span
      className="nav__indicator"
      aria-hidden="true"
      layoutId="nav-indicator"
      transition={{ duration: 0.28, ease: EASE }}
    />
  )
}
