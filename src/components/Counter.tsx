import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

type Props = {
  to: number
  /** Zero-pad to this many digits — the spec bar reads 04 / 08 / 01. */
  pad?: number
  duration?: number
  className?: string
}

/**
 * Counts up once, when scrolled into view. The final value is rendered
 * immediately under reduced motion (and is the initial paint for everyone if
 * JS hasn't reached the effect yet), so the number is never missing — only
 * ever animated on its way there.
 */
export function Counter({ to, pad = 2, duration = 1.1, className }: Props) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [value, setValue] = useState(reduced ? to : 0)

  useEffect(() => {
    if (reduced) {
      setValue(to)
      return
    }
    if (!inView) return

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduced, to, duration])

  return (
    <span className={className} ref={ref}>
      {String(value).padStart(pad, '0')}
    </span>
  )
}
