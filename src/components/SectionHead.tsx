import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ruleIn, VIEWPORT } from '../lib/motion'
import { SplitText } from './SplitText'

type Props = {
  /** Mono catalogue label. Rendered uppercase with the drawn "──" prefix. */
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  /** h2 nearly always; h1 only where the page hero isn't carrying it. */
  level?: 1 | 2 | 3
  align?: 'left' | 'center'
  flush?: boolean
  className?: string
  id?: string
}

/**
 * The signature element: mono eyebrow over a 2px teal rule, then the heading.
 * Every section on the site opens with one, which is the whole point — half
 * applied, the motif reads as an accident.
 */
export function SectionHead({
  eyebrow,
  title,
  intro,
  level = 2,
  align = 'left',
  flush = false,
  className,
  id,
}: Props) {
  const reduced = useReducedMotion()
  const Heading = `h${level}` as 'h2'

  const classes = [
    'section-head',
    align === 'center' ? 'section-head--center' : '',
    flush ? 'section-head--flush' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} id={id}>
      <p className="eyebrow">{eyebrow}</p>
      {reduced ? (
        <hr className="rule" />
      ) : (
        <motion.hr
          className="rule"
          variants={ruleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        />
      )}
      {/* Word-by-word wipe when the title is a plain string, which it is at
          every call site on the site today. A ReactNode title (embedded markup,
          a <br>, a translated fragment) cannot be split without destroying its
          structure, so it falls back to a plain heading — the reveal on the
          surrounding element still carries it in. */}
      {typeof title === 'string' ? (
        <SplitText as={Heading} className="section-head__title">
          {title}
        </SplitText>
      ) : (
        <Heading className="section-head__title">{title}</Heading>
      )}
      {intro && <p className="section-head__intro">{intro}</p>}
    </div>
  )
}
