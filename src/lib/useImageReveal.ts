/** @format */

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Fades an <img> in as it decodes, instead of letting it snap into place.
 *
 * Returns props to spread onto the image. Usage:
 *
 *   const img = useImageReveal()
 *   <img className={`cat__img ${img.className}`} {...img.props} src={...} />
 *
 * ── The cached-image race ──────────────────────────────────────────────────
 * The reason this is a hook and not a CSS class with an onLoad attribute.
 *
 * An image served from cache — a back-navigation, a second visit, an image
 * already on the previous page — can finish loading before React attaches the
 * onLoad handler. The event fires into nothing, `is-loaded` is never added, and
 * the image stays at opacity 0 permanently. It is invisible content, and it
 * only reproduces on a warm cache, which is exactly the case a quick local
 * check does not exercise.
 *
 * So the ref callback checks `img.complete` the moment the node exists, which
 * is synchronously true for anything already in cache, and marks it loaded
 * without waiting for an event. The onLoad handler covers the cold path.
 *
 * A broken image (onError) is also marked loaded — a file that 404s should show
 * the browser's own broken-image state, not sit invisible as though the page
 * were still working.
 */
export function useImageReveal(eager = false) {
	const reduced = useReducedMotion();
	const [loaded, setLoaded] = useState(false);
	const ref = useRef<HTMLImageElement | null>(null);

	const markLoaded = useCallback(() => setLoaded(true), []);

	/* Ref callback rather than useEffect: this has to run at the moment the node
	   is attached, before a paint can happen with the image at opacity 0. */
	const setRef = useCallback(
		(node: HTMLImageElement | null) => {
			ref.current = node;
			if (node?.complete) setLoaded(true);
		},
		[],
	);

	/* Second guard for the same race. If the src changes after mount, `complete`
	   was checked against the old file, so re-check once the node has the new
	   one. Cheap, and it keeps the hook correct for any future gallery or
	   locale-swapped imagery. */
	useEffect(() => {
		if (ref.current?.complete) setLoaded(true);
	});

	/* Above-the-fold images opt out entirely: there is nothing to reveal when
	   the image is already painted before the first scroll, and fading in the
	   hero of a page is how a site feels slow rather than polished. */
	const off = reduced || eager;

	return {
		className: off ? "img-reveal img-reveal--eager" : (
			`img-reveal${loaded ? " is-loaded" : ""}`
		),
		props: {
			ref: setRef,
			onLoad: markLoaded,
			onError: markLoaded,
		},
	};
}
