import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { springHover } from '../lib/motion'
import { ArrowRight } from './Icons'
import { SpecularEdge } from './SpecularEdge'

type Variant = 'primary' | 'light' | 'outline' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

/**
 * Shine colours per variant. The upstream component assumes a dark page and
 * hard-codes a white highlight; half of this site's buttons sit on white, where
 * a white edge is invisible. Each variant gets a highlight that has something
 * to contrast against, and a base stroke a shade darker than its own fill.
 */
const SHINE: Record<Variant, { lineColor: string; baseColor: string; intensity: number }> = {
  /* Solid blue on light — white reads cleanly along the edge. */
  primary: { lineColor: '#ffffff', baseColor: '#072F52', intensity: 1 },
  /* White fill on the dark hero. A white shine would vanish into the fill, so
     it takes the pale teal instead. */
  light: { lineColor: '#B7ECF3', baseColor: '#0E5C9E', intensity: 0.9 },
  /* Transparent on white — the highlight has to go dark to exist at all. */
  outline: { lineColor: '#0E5C9E', baseColor: '#D9E2EC', intensity: 0.85 },
  /* Transparent on dark: the case the effect was designed for. */
  'outline-light': { lineColor: '#ffffff', baseColor: '#5A6B7C', intensity: 1 },
}

type Common = {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Adds a nudging arrow after the label. */
  arrow?: boolean
  block?: boolean
  className?: string
  /** Submit in flight: keeps the width, swaps the arrow for a spinner and
      blocks a second submit. */
  loading?: boolean
  disabled?: boolean
}

type Props = Common &
  (
    | { to: string; href?: never; type?: never; onClick?: never }
    | { href: string; to?: never; type?: never; onClick?: never }
    | { type: 'submit' | 'button'; to?: never; href?: never; onClick?: () => void }
  )

const MotionLink = motion.create(Link)

/**
 * One button, three renderings: router Link for internal routes, plain anchor
 * for tel:/mailto:/external, and a real <button> for form submission. Picking
 * the element from the props means a mailto never renders as a Link (which
 * would try to route to it) and a submit never renders as an anchor.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  block = false,
  className,
  loading = false,
  disabled = false,
  ...rest
}: Props) {
  const reduced = useReducedMotion()

  const inert = disabled || loading

  const classes = [
    'btn',
    `btn--${variant}`,
    inert ? 'is-disabled' : '',
    size !== 'md' ? `btn--${size}` : '',
    block ? 'btn--block' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  /* The canvas sits behind the label, inset past the button's own box so the
     highlight can bloom outside the border. */
  const label = (
    <>
      <SpecularEdge
        radius={18}
        proximity={220}
        shineSize={10}
        shineFade={40}
        thickness={1}
        {...SHINE[variant]}
      />
      <span className="btn__label">
        {children}
        {/* Spinner replaces the arrow rather than sitting beside it, so the
            button keeps its width and nothing reflows mid-submit. */}
        {loading ? (
          <span className="btn__spinner" aria-hidden="true" />
        ) : (
          arrow && <ArrowRight className="btn__arrow" />
        )}
      </span>
    </>
  )

  /* Spring lift, dropped entirely when reduced motion is requested. */
  const lift = reduced
    ? {}
    : { whileHover: { y: -2 }, whileTap: { y: 0, scale: 0.985 }, transition: springHover }

  if ('to' in rest && rest.to) {
    return (
      <MotionLink to={rest.to} className={classes} {...lift}>
        {label}
      </MotionLink>
    )
  }

  if ('href' in rest && rest.href) {
    const external = /^https?:/i.test(rest.href)
    return (
      <motion.a
        href={rest.href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...lift}
      >
        {label}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={('type' in rest && rest.type) || 'button'}
      onClick={'onClick' in rest ? rest.onClick : undefined}
      className={classes}
      disabled={inert}
      aria-busy={loading || undefined}
      {...(inert ? {} : lift)}
    >
      {label}
    </motion.button>
  )
}
