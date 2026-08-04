import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from './Icons'
import { useImageReveal } from '../lib/useImageReveal'

/* Module scope, not inside the component: motion(Link) creates a new component
   type on every call, and one created during render would remount the card
   (and restart its animation) on each pass. */
const MotionLink = motion.create(Link)

type Props = {
  title: string
  body: string
  /** Route. Omit for a non-interactive card. */
  to?: string
  onDark?: boolean
  more?: string
  flat?: boolean
  /** Photograph above the copy. Omit for a text-only card. */
  image?: string
  /** Leave empty where the title beside it already names the subject. */
  imageAlt?: string
}

/**
 * Industry / summary card. Renders as a Link when `to` is given so the whole
 * card is one hit target rather than a card containing a small link.
 */
export function Card({
  title,
  body,
  to,
  onDark = false,
  more,
  flat = true,
  image,
  imageAlt = '',
}: Props) {
  const reduced = useReducedMotion()
  /* Called unconditionally — hooks cannot sit behind the `image &&` below. It
     costs nothing when there is no image to attach it to. */
  const img = useImageReveal()

  const classes = [
    'card',
    flat && !image ? 'card--flat' : '',
    onDark ? 'card--onDark' : '',
    image ? 'card--media' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      {image && (
        <span className="card__media">
          <img
            className={`card__img ${img.className}`}
            src={image}
            alt={imageAlt}
            width={900}
            height={600}
            loading="lazy"
            decoding="async"
            {...img.props}
          />
        </span>
      )}
      <span className="card__body-wrap">
        <h3 className="card__title">{title}</h3>
        <p className="card__body">{body}</p>
        {to && more && (
          <span className="card__more">
            {more}
            <ArrowRight className="btn__arrow" />
          </span>
        )}
      </span>
    </>
  )

  /* The lift is a Framer hover rather than a CSS one so it composes with the
     scroll-reveal transform instead of being overridden by it. */
  const lift = reduced ? {} : { whileHover: { y: -4 }, transition: { duration: 0.17 } }

  if (!to) {
    return (
      <motion.div className={classes} {...lift}>
        {inner}
      </motion.div>
    )
  }

  return (
    <MotionLink to={to} className={classes} {...lift}>
      {inner}
    </MotionLink>
  )
}
