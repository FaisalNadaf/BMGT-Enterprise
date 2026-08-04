/** @format */

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VIEWPORT, wordChild, wordsParent } from "../lib/motion";

/* Explicit map rather than motion[as]: indexing the motion proxy by a union of
   tag names does not narrow to a single component type, so TS widens the props
   to the intersection of every element's props and the call site stops
   type-checking. Same pattern as Reveal's TAGS. */
const TAGS = {
	h1: motion.h1,
	h2: motion.h2,
	h3: motion.h3,
	p: motion.p,
	span: motion.span,
} as const;

type Props = {
	/**
	 * Plain text only. Not ReactNode — this component takes the string apart,
	 * so anything with markup inside it could not survive the split. Headings
	 * that need embedded markup should use a plain heading and a Reveal.
	 */
	children: string;
	/** Heading level, or a span where the surrounding element is the heading. */
	as?: "h1" | "h2" | "h3" | "p" | "span";
	className?: string;
	/** Seconds before the first word moves. */
	delay?: number;
	/** Seconds between words. Slower than the grid stagger — words are read in
	 *  sequence, so they can afford more space than cards scanned at a glance. */
	stagger?: number;
	/**
	 * Animate on mount rather than on scroll. For above-the-fold headings, where
	 * whileInView is a race: the element is already in view at first paint and a
	 * missed observer callback would leave the heading invisible.
	 */
	onMount?: boolean;
	id?: string;
};

/**
 * A heading that wipes in word by word, each word rising out of its own clipped
 * box.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 * The split is the reason this needs care. Screen readers and, more commonly,
 * "copy the heading" would both see a pile of separate spans; some readers
 * announce those as separate phrases, and selecting the text yields words
 * glued together with no spaces.
 *
 * So the real text is rendered once, flat, inside a visually-hidden span, and
 * the animated words are marked aria-hidden. Assistive tech and the clipboard
 * get one clean string; the eye gets the animation. The heading element itself
 * keeps its semantics and its place in the document outline either way.
 *
 * ── Layout ─────────────────────────────────────────────────────────────────
 * Words are inline-block so they can be transformed, with the space between
 * them rendered as a real character rather than a margin — that keeps normal
 * wrapping and justification, and keeps the copy identical to what the flat
 * heading would produce. No layout shift: the words occupy their final space
 * from the first frame, only their vertical position inside the mask changes.
 */
export function SplitText({
	children,
	as = "h2",
	className,
	delay = 0,
	stagger = 0.055,
	onMount = false,
	id,
}: Props) {
	const reduced = useReducedMotion();
	const Tag = as;

	/* Under reduced motion this is a plain heading with no wrapper spans at all
	   — not a faster animation. Same principle as Reveal: never leave an element
	   depending on an animation callback to become visible. */
	if (reduced) {
		return (
			<Tag
				className={className}
				id={id}>
				{children}
			</Tag>
		);
	}

	/* Split on runs of whitespace and drop empties, so a double space or a
	   trailing newline in a translation string cannot produce an empty word
	   box that still consumes a stagger slot. */
	const words = children.split(/\s+/).filter(Boolean);
	const MotionTag = TAGS[Tag] as typeof motion.h2;

	/* Above the fold, animate on mount. Below it, on scroll. */
	const trigger =
		onMount ?
			{ animate: "visible" as const }
		:	{ whileInView: "visible" as const, viewport: VIEWPORT };

	return (
		<MotionTag
			className={className}
			id={id}
			variants={wordsParent(stagger, delay)}
			initial="hidden"
			{...trigger}>
			<span className="visually-hidden">{children}</span>
			<span aria-hidden="true">
				{words.map((word, i) => (
					<Fragment key={`${word}-${i}`}>
						<span className="split__word">
							<motion.span
								className="split__inner"
								variants={wordChild}>
								{word}
							</motion.span>
						</span>
						{/* A real space character, sitting outside the clipped box
						    so it is never masked and outside the transform so it
						    never animates. Without it the inline-block word boxes
						    butt together — adjacent elements from a map carry no
						    whitespace between them, unlike literal JSX siblings.
						    Emitting it after every word including the last is
						    harmless (it collapses at the end of a line box) and
						    keeps this branch-free. */}
						{" "}
					</Fragment>
				))}
			</span>
		</MotionTag>
	);
}
