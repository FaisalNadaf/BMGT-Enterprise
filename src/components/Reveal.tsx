import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { RevealDirection } from '../lib/motion'
import {
  DUR,
  EASE,
  isRTL,
  revealFrom,
  revealToFor,
  revealVariants,
  staggerParent,
  VIEWPORT,
} from '../lib/motion'

/**
 * Scroll reveal primitives.
 *
 * Under prefers-reduced-motion every one of these renders a plain element with
 * no animation attached at all — not a shorter animation, not a fade. That is
 * deliberate: the brief requires an instant fallback, and leaving a motion
 * component in place risks the element being stuck at opacity 0 if an
 * IntersectionObserver callback is missed.
 */

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  /* The footer's three link columns are <nav> landmarks and also grid items —
     they have to *be* the animated element, not sit inside a wrapper div, or
     the grid's column sizing applies to the wrapper and the landmark loses its
     place in the layout. */
  nav: motion.nav,
  figure: motion.figure,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} as const

type Tag = keyof typeof TAGS

type RevealProps = {
  children: ReactNode
  /** Element to render. Defaults to a div. */
  as?: Tag
  className?: string
  /** Seconds. Use for a deliberate offset, not for hand-rolled staggering —
   *  Stagger does that better. */
  delay?: number
  /**
   * Where the element enters from. Defaults to 'up', which is what every
   * existing call site was doing implicitly, so adding this changed nothing
   * already on the page.
   *
   * Pick it from the layout, not for variety: a column on the left of a
   * two-column row enters from the left, the one on the right from the right,
   * and anything stacked full-width enters from below. Direction that
   * contradicts position is what makes a page feel restless.
   */
  direction?: RevealDirection
  /** Travel distance in px. Omit to take the per-direction default — 28
   *  vertical, 52 horizontal. 0 gives a pure fade. */
  y?: number
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  direction = 'up',
  y,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion()
  const Comp = TAGS[as] as typeof motion.div
  const Plain = as as 'div'

  if (reduced) {
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Comp
      className={className}
      initial={revealFrom(direction, y, isRTL())}
      whileInView={revealToFor(direction)}
      viewport={VIEWPORT}
      transition={{ duration: DUR.base, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

type StaggerProps = {
  children: ReactNode
  as?: Tag
  className?: string
  /** Seconds between children. 60–80ms reads as a sweep; more reads as a queue. */
  stagger?: number
  delayChildren?: number
  id?: string
  'aria-label'?: string
}

/** Container half of the stagger pair. Children must be <StaggerItem>. */
export function Stagger({
  children,
  as = 'div',
  className,
  stagger = 0.07,
  delayChildren = 0,
  ...rest
}: StaggerProps) {
  const reduced = useReducedMotion()
  const Comp = TAGS[as] as typeof motion.div
  const Plain = as as 'div'

  if (reduced) {
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Comp
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Comp>
  )
}

type StaggerItemProps = {
  children: ReactNode
  as?: Tag
  className?: string
  /** As Reveal's. Set it on the item, not the parent — a grid of cards reads
   *  best all entering the same way, so this is for the exceptions. */
  direction?: RevealDirection
  /** Travel distance in px. Omit for the per-direction default. */
  distance?: number
  /** Required when `as` is a landmark: an unlabelled <nav> among several is
   *  useless to a screen reader. Forwarded in both the animated and the
   *  reduced-motion branch — dropping it in one would make the accessibility
   *  of the page depend on an OS setting. */
  'aria-label'?: string
  id?: string
}

/** Child half. Inherits `visible` from the parent Stagger — no initial/animate
 *  of its own, which is what lets the parent drive the timing. */
export function StaggerItem({
  children,
  as = 'div',
  className,
  direction = 'up',
  distance,
  ...rest
}: StaggerItemProps) {
  const reduced = useReducedMotion()
  const Comp = TAGS[as] as typeof motion.div
  const Plain = as as 'div'

  if (reduced) {
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Comp
      className={className}
      variants={revealVariants(direction, distance, isRTL())}
      {...rest}
    >
      {children}
    </Comp>
  )
}
