/** @format */

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Reading-progress bar pinned to the top edge of the viewport.
 *
 * Deliberately quiet: 2px of the accent teal, the same weight as the rule under
 * every section eyebrow, so it reads as part of the existing spec-sheet motif
 * rather than as a widget bolted on top.
 *
 * ── Why this one is safe to drive from scroll ──────────────────────────────
 * The home hero used to carry a scroll-linked parallax and it had to be removed:
 * retargeting a transform every frame on a full-viewport element wrapping a
 * <video> re-rasterised the video's compositing layer on each tick and produced
 * visible flicker.
 *
 * This has none of that exposure. It is a 2px bar with no children, no video
 * anywhere near it, and its own compositing layer that contains nothing but a
 * flat colour — so a scaleX every frame costs one composite of a strip a few
 * pixels tall. It is the cheapest possible thing to animate on scroll, which is
 * exactly why the effect is worth having here and was not worth having there.
 *
 * scaleX rather than width: width would trigger layout on every frame.
 */
export function ScrollProgress() {
	const reduced = useReducedMotion();
	const { scrollYProgress } = useScroll();

	/* The raw value is exact but steps with the scroll wheel. The spring gives
	   it weight so the bar glides to the new position instead of snapping.
	   restDelta stops the spring settling forever at sub-pixel amounts. */
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 140,
		damping: 26,
		restDelta: 0.001,
	});

	/* A progress bar is a pure motion affordance — under reduced motion there is
	   no static version worth showing, so it is simply absent. */
	if (reduced) return null;

	return (
		<motion.div
			className="scroll-progress"
			style={{ scaleX }}
			/* Decorative. The scrollbar already conveys this to assistive tech,
			   and announcing a second, continuously-updating progress value
			   would be noise. */
			aria-hidden="true"
		/>
	);
}
