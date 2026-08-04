import type { Transition, Variants } from 'framer-motion'

/** Same curve as the CSS --ease token, so JS and CSS motion agree. */
export const EASE = [0.4, 0, 0.2, 1] as const

/**
 * Shared viewport rule for scroll reveals.
 *
 * `amount`, not `margin`. The previous rule was a -10% inset on the root, which
 * fires the moment any part of the element crosses 90% of the viewport height —
 * about 80px of a section peeking over the bottom edge. A tall section would
 * therefore start *and finish* its reveal while only its top strip was on
 * screen, so by the time you had scrolled far enough to look at it, the
 * animation was already over. It was running, just never where anyone could see
 * it. That is the whole reason reveals "did not appear to animate".
 *
 * A fifth of the element has to be on screen instead. For anything from a card
 * to a full-height section that lands it squarely in view before it moves.
 *
 * 0.2 rather than something larger because `amount` is a fraction of the
 * *element*, not the viewport: on a section three or four screens tall, a high
 * threshold can be physically unsatisfiable — the element can never be that
 * visible at once, and the reveal would never fire, leaving real content stuck
 * at opacity 0. 0.2 stays safely reachable for anything up to ~5 viewports.
 */
export const VIEWPORT = { once: true, amount: 0.2 } as const

/**
 * Duration scale. Everything on the site draws from these three so timings stay
 * related instead of each component picking its own number. All sit inside the
 * 300–800ms band where motion reads as deliberate: quicker feels like a glitch,
 * slower feels like waiting.
 */
export const DUR = {
  /** Micro-interactions: hover, press, icon nudge. Matches the CSS --dur token. */
  fast: 0.17,
  /** The default for anything entering the viewport. Lifted from 0.55: now
   *  that reveals fire with the element properly in view rather than clipping
   *  the bottom edge, there is room for the movement to be seen, and 0.55 read
   *  as a flinch at the larger horizontal travel. */
  base: 0.7,
  /** Long travel or large surfaces, where `base` arrives before the eye does. */
  slow: 0.75,
} as const

/**
 * Distance a revealed element travels.
 *
 * Vertical is small: a section rising 28px against the scroll direction reads
 * clearly, and more starts to fight the scroll itself.
 *
 * Horizontal is nearly double. There is no scroll momentum along that axis to
 * borrow from, so the same 28px sideways is barely perceptible — it reads as a
 * rendering wobble rather than an entrance. 52px is what makes a slide look
 * deliberate without tipping into "flying in".
 */
const TRAVEL = 28
const TRAVEL_X = 52

/**
 * Reading direction, for flipping horizontal reveals.
 *
 * Reads the DOM rather than calling useLocale(). useLocale subscribes to the
 * router (useLocation, useParams) and to i18n, so using it here would make
 * every one of the ~50 Reveal/StaggerItem instances on a page re-render on
 * every navigation and every language event — a lot of subscription for one
 * boolean that changes only when the whole tree is being replaced anyway.
 *
 * `dir` is set on <html> by the inline script in index.html before first paint
 * and maintained by LocaleLayout, so it is always correct by the time any of
 * this runs. Guarded for the no-document case so the module stays importable
 * from a test or a build script.
 */
export function isRTL() {
  return typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
}

export type RevealDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'scale'
  | 'blur'
  | 'none'

/**
 * The one place a reveal's from-state is defined. Reveal, StaggerItem and the
 * page-level helpers all resolve through here, so a direction behaves
 * identically wherever it is used and there is a single line to change if the
 * house style moves.
 *
 * `left` means the element enters *from* the left, i.e. it starts offset to the
 * left and settles rightward — the reading everyone expects from the name.
 *
 * ── left/right are LOGICAL, not physical ───────────────────────────────────
 * `rtl` mirrors them. This is not a nicety: every grid on the site is CSS Grid,
 * which mirrors on its own in Arabic, so the element that sits in the left-hand
 * column in English sits in the right-hand column in Arabic. An animation
 * hard-coded to enter from physical left would, in Arabic, slide the element
 * *away* from where it is going to land and then snap it back across the row.
 * Flipping the sign keeps "enters from its own side" true in both directions.
 *
 * Only transform and opacity are animated. Both are GPU-composited and neither
 * triggers layout, which is what keeps these at 60fps on a phone. Nothing here
 * animates width, height, top/left, margin or filter-on-a-large-surface.
 */
export function revealFrom(
  direction: RevealDirection = 'up',
  distance?: number,
  rtl = false,
) {
  /* Horizontal gets its own default, so callers that pass nothing still get the
     larger travel that a sideways slide needs. */
  const d = distance ?? (direction === 'left' || direction === 'right' ? TRAVEL_X : TRAVEL)
  const sign = rtl ? -1 : 1

  switch (direction) {
    case 'down':
      return { opacity: 0, y: -d }
    case 'left':
      return { opacity: 0, x: -d * sign }
    case 'right':
      return { opacity: 0, x: d * sign }
    /* Understated on purpose. A card growing from 0.9 draws attention to the
       animation; 0.96 just makes it feel like it settled into place. */
    case 'scale':
      return { opacity: 0, scale: 0.96 }
    /* The one non-transform property used anywhere, and it is deliberately
       reserved for short headings. A blur filter is rasterised per frame, so on
       a large surface or a long list it is the one effect here that will cost
       frames. Small text only. */
    case 'blur':
      return { opacity: 0, filter: 'blur(10px)', y: 12 }
    case 'none':
      return { opacity: 0 }
    case 'up':
    default:
      return { opacity: 0, y: d }
  }
}

/**
 * The settled state, built to match the from-state key for key.
 *
 * It would be simpler to return one object with every key reset — opacity, x,
 * y, scale and filter — and for a while it did. That is wrong: it puts
 * `filter: blur(0px)` on every revealed element on the site, and a filter (even
 * a zero-radius one) creates a stacking context and a containing block for
 * fixed-position descendants. Applied to ~50 wrappers that is a lot of new
 * stacking contexts for nothing, and exactly the sort of thing that surfaces
 * later as an inexplicable z-index bug.
 *
 * So the target mirrors the source: only the properties that were actually
 * offset get animated back.
 */
export function revealToFor(direction: RevealDirection = 'up') {
  switch (direction) {
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 }
    case 'scale':
      return { opacity: 1, scale: 1 }
    case 'blur':
      return { opacity: 1, filter: 'blur(0px)', y: 0 }
    case 'none':
      return { opacity: 1 }
    case 'up':
    case 'down':
    default:
      return { opacity: 1, y: 0 }
  }
}

/** Variant pair for a directional reveal, for use with a parent Stagger. */
export const revealVariants = (
  direction: RevealDirection = 'up',
  distance?: number,
  rtl = false,
): Variants => ({
  hidden: revealFrom(direction, distance, rtl),
  visible: {
    ...revealToFor(direction),
    transition: { duration: DUR.base, ease: EASE },
  },
})

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

/** Children inherit `visible` from the container, offset by `staggerChildren`. */
export const staggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** The signature 2px teal rule drawing itself in from the left. */
export const ruleIn: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, ease: EASE } },
}

/** Route change: fade with a short upward slide. Kept under 350ms — a page
 *  transition that outlasts the click stops feeling like navigation. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
}

export const springHover: Transition = { type: 'spring', stiffness: 420, damping: 26 }

/* --------------------------------------------------------------------------
   SPLIT TEXT
   Word-level, never character-level. A headline exploded into characters is
   the single most common way this effect is overdone, and on a supplier's
   headline it reads as decoration rather than confidence. Words also keep the
   animation cheap: "Strong foundations. Supplied." is 3 animated nodes as
   words and 28 as characters.
   -------------------------------------------------------------------------- */

/** Container for a split heading. The children carry the movement. */
export const wordsParent = (stagger = 0.055, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/**
 * One word rising out of its own clipped box — a mask reveal, not a fade.
 * The word starts fully below the line box and slides up into it; the
 * overflow:hidden wrapper in SplitText is what turns that into a wipe.
 *
 * `110%` rather than `100%` so descenders (g, y, p) clear the mask edge. At
 * 100% the tail of a "g" is still visible below the line at the start.
 */
export const wordChild: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
}

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.96 },
  visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.18, ease: EASE } },
  exit: { opacity: 0, y: -6, scaleY: 0.98, transition: { duration: 0.12, ease: EASE } },
}
