/** @format */

import { useImageReveal } from "../lib/useImageReveal";

type Props = {
	src: string;
	alt: string;
	className?: string;
	width?: number;
	height?: number;
	/** Above the fold — skips the reveal and loads eagerly. */
	eager?: boolean;
};

/**
 * An <img> that fades in as it decodes.
 *
 * The component exists because useImageReveal is a hook and most of the site's
 * imagery is rendered inside a .map() over catalogue data — the catalogue grid,
 * the product index, the brand wall. A hook cannot be called there, so the
 * per-image state has to live in a component that the map can instantiate once
 * per row.
 *
 * Everything else about the element is unchanged from the markup it replaces:
 * same class, same intrinsic width/height (which is what reserves the box and
 * keeps the reveal from causing any layout shift), same lazy/async defaults.
 */
export function RevealImage({
	src,
	alt,
	className = "",
	width,
	height,
	eager = false,
}: Props) {
	const img = useImageReveal(eager);

	return (
		<img
			className={`${className} ${img.className}`.trim()}
			src={src}
			alt={alt}
			width={width}
			height={height}
			loading={eager ? "eager" : "lazy"}
			decoding="async"
			{...img.props}
		/>
	);
}
