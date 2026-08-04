import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLocale } from '../i18n/useLocale'
import { ArrowRight } from './Icons'

/**
 * Auto-advancing slider.
 *
 * Built on CSS scroll-snap rather than a transformed track. That buys touch
 * swipe, keyboard scrolling and RTL travel direction from the browser for
 * free — a translateX track has to reimplement all three, and gets RTL wrong
 * more often than not because `scrollLeft` inverts under `dir="rtl"`.
 * Movement is driven with `scrollIntoView({ inline: 'start' })`, which is
 * direction-aware by spec, so nothing here needs to know which way is forward.
 *
 * Auto-advance stops on hover, on focus inside the track, and when the tab is
 * hidden. Under `prefers-reduced-motion` it never starts, and the strip stays
 * a plain horizontal scroller — the same treatment BrandMarquee already uses.
 */

type Props = {
  children: ReactNode[]
  /** Seconds between advances. */
  interval?: number
  /** Accessible name for the whole control. */
  label: string
  /** Slides visible at once on desktop. Steps down at the breakpoints. */
  perView?: number
}

export function Carousel({ children, interval = 5, label, perView = 2 }: Props) {
  const trackRef = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()
  const { t, isRTL } = useLocale()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const count = children.length

  /* Pointer drag. Touch is deliberately excluded — the browser's own momentum
     scrolling is better than anything reimplemented here, and hijacking it
     costs the rubber-band feel. This is for mouse and pen, where there is
     otherwise no way to move the strip without hitting an arrow. */
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false })

  const onPointerDown = (event: React.PointerEvent) => {
    const track = trackRef.current
    if (!track || event.pointerType === 'touch' || count < 2) return
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    }
    track.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const track = trackRef.current
    if (!drag.current.active || !track) return
    const dx = event.clientX - drag.current.startX
    /* A few pixels of slop so a normal click is not read as a drag. */
    if (Math.abs(dx) > 4) drag.current.moved = true
    /* Subtracting works in both directions: RTL only changes the sign of
       scrollLeft, not the fact that content follows the pointer. */
    track.scrollLeft = drag.current.startScroll - dx
  }

  const endDrag = (event: React.PointerEvent) => {
    const track = trackRef.current
    if (!drag.current.active || !track) return
    drag.current.active = false
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
    /* Dropping the class restores scroll-snap, and the browser settles on the
       nearest slide on its own — no snap maths needed here. */
    setDragging(false)
  }

  const goTo = useCallback(
    (next: number, smooth = true) => {
      const track = trackRef.current
      if (!track) return
      const wrapped = (next + count) % count
      const slide = track.children[wrapped] as HTMLElement | undefined
      slide?.scrollIntoView({
        behavior: smooth && !reduced ? 'smooth' : 'auto',
        inline: 'start',
        block: 'nearest',
      })
      setIndex(wrapped)
    },
    [count, reduced],
  )

  /* Track which slide is actually in view — the user can swipe or scroll past
     the auto-advance, and the dots have to follow that, not our own counter. */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const i = Array.prototype.indexOf.call(track.children, visible.target)
        if (i >= 0) setIndex(i)
      },
      { root: track, threshold: 0.6 },
    )
    Array.from(track.children).forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [count])

  /* Auto-advance. Never runs under reduced motion, and pauses whenever the
     user is looking at or interacting with the strip. */
  useEffect(() => {
    if (reduced || paused || dragging || count < 2) return
    const id = window.setInterval(() => goTo(index + 1), interval * 1000)
    return () => window.clearInterval(id)
  }, [count, dragging, goTo, index, interval, paused, reduced])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent) => {
    /* Arrow keys follow the reading direction, not the physical one. */
    const forward = isRTL ? 'ArrowLeft' : 'ArrowRight'
    const back = isRTL ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === forward) {
      event.preventDefault()
      goTo(index + 1)
    } else if (event.key === back) {
      event.preventDefault()
      goTo(index - 1)
    }
  }

  return (
    <div
      className={`carousel${dragging ? ' carousel--dragging' : ''}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
      onKeyDown={onKeyDown}
      /* --cv-max, not --cv-per: an inline custom property outranks every
         stylesheet rule, so writing --cv-per here made the responsive
         media queries unable to step it down. CSS derives --cv-per from
         this and can override it per breakpoint. */
      style={{ '--cv-max': perView } as React.CSSProperties}
    >
      <ul
        className="carousel__track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        /* A drag that ends over a card would otherwise fire that card's link.
           Capture phase, so it is cancelled before the anchor ever sees it. */
        onClickCapture={(event) => {
          if (!drag.current.moved) return
          event.preventDefault()
          event.stopPropagation()
          drag.current.moved = false
        }}
      >
        {children.map((child, i) => (
          <li
            className="carousel__slide"
            key={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
          >
            {child}
          </li>
        ))}
      </ul>

      {count > 1 && (
        <div className="carousel__controls">
          <button
            type="button"
            className="carousel__arrow carousel__arrow--prev"
            onClick={() => goTo(index - 1)}
          >
            <ArrowRight className="carousel__icon" />
            <span className="visually-hidden">{t('ui.carousel.prev')}</span>
          </button>

          <ul className="carousel__dots">
            {children.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`carousel__dot${i === index ? ' is-active' : ''}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                >
                  <span className="visually-hidden">
                    {t('ui.carousel.goTo', { n: i + 1 })}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="carousel__arrow carousel__arrow--next"
            onClick={() => goTo(index + 1)}
          >
            <ArrowRight className="carousel__icon" />
            <span className="visually-hidden">{t('ui.carousel.next')}</span>
          </button>
        </div>
      )}
    </div>
  )
}
