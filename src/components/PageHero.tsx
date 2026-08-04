import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion'
import { SplitText } from './SplitText'

export type Crumb = { label: string; to?: string }

type Props = {
  eyebrow: string
  title: string
  sub?: string
  /** Photograph behind the scrim. Omit for the flat navy variant. */
  image?: string
  /** Still accepted so callers typecheck, but no longer rendered — the
      breadcrumb row was removed from this hero. Drop the prop from the
      callers too if it is not coming back. */
  crumbs?: Crumb[]
}

/**
 * Inner-page hero. Shorter than the home hero, always dark, with the
 * breadcrumb doing the wayfinding.
 */
export function PageHero({ eyebrow, title, sub, image }: Props) {
  const reduced = useReducedMotion()

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        }

  return (
    <section className={`page-hero${image ? '' : ' page-hero--plain'}`}>
      {image && (
        <div className="page-hero__bgwrap">
          {/* Slow settle out of a push-in, same treatment as the home hero. */}
          <motion.img
            className="page-hero__bg"
            src={image}
            alt=""
            width={900}
            height={600}
            fetchPriority="high"
            initial={reduced ? false : { scale: 1.06 }}
            animate={reduced ? undefined : { scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </div>
      )}

      <div className="container">
   
        <motion.p className="eyebrow" {...rise(0.08)}>
          {eyebrow}
        </motion.p>
        {/* Same treatment as the home h1, so a route change lands on a heading
            that behaves the way the last one did. onMount for the same reason:
            it is above the fold on every page that renders this. */}
        <SplitText as="h1" className="page-hero__title" delay={0.16} onMount>
          {title}
        </SplitText>
        {sub && (
          <motion.p className="page-hero__sub" {...rise(0.26)}>
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  )
}
