/**
 * Company facts and global strings.
 *
 * Everything here is client-confirmed (Dubai entity, @bmgt.ae addresses,
 * +971 number) except where a CONFIRM comment says otherwise.
 *
 * @format
 */

export const site = {
	name: "BMGT Enterprise",
	/* CONFIRM: "Private Limited" is an India/UK suffix. A Dubai entity is
     normally LLC, FZ-LLC or FZE. Used in the About copy and the legal bar. */
	legalName: "BMGT Enterprise Private Limited",
	tagline: "Strong foundations. Supplied.",
	description:
		"BMGT Enterprise is a single-source supplier of industrial materials to shipbuilding, oil & gas, construction and general engineering. Based in Dubai, U.A.E. Supplying worldwide.",

	phone: {
		display: "+971 54 777 8655",
		href: "tel:+971547778655",
	},

	emails: {
		sales: "Sales@bmgt.ae",
		info: "Info@bmgt.ae",
		/* CONFIRM: should a named personal address be public? */
		direct: "MFElahi@bmgt.ae",
	},

	address: {
		lines: [
			"Meydan Grandstand, 6th Floor,",
			"Meydan Road, Nad Al Sheba,",
			"PO Box 191618,",
			"Dubai, United Arab Emirates",
		],
		short: "Nad Al Sheba, Dubai, U.A.E.",
		/* One-line form for the map link / embed. */
		query:
			"Meydan Grandstand, Meydan Road, Nad Al Sheba, Dubai, United Arab Emirates",
	},

	credit: {
		label: "Cubiccode",
		href: "https://cubiccode.in",
	},

	year: 2026,
} as const;

/** Spec bar under the hero. Every figure is counted off the site's own content. */
export const specBar = [
	{ value: 4, label: "Sectors served" },
	{ value: 8, label: "Supply categories" },
	{ value: 1, label: "Point of contact" },
] as const;
