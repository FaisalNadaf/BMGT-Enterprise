/**
 * ⚠️ CLIENT REVIEW — these eleven brands were scraped from the previous
 * Belagavi site. Now that BMGT is confirmed as a Dubai entity, none of them
 * should be assumed to transfer. Each affiliation needs confirming before
 * this page goes live, and any that BMGT is not an authorised or stocking
 * distributor for must come off.
 *
 * Logo files are third-party trademarks used for identification only.
 *
 * @format
 */

export type Brand = {
	name: string;
	logo: string;
	/** Rough category, used only for the grouping label on /brands. */
	field: string;
};

export const brands: Brand[] = [
	{ name: "Legrand", logo: "/images/brands/legrand.png", field: "Electrical" },
	{
		name: "Black+Decker",
		logo: "/images/brands/black-decker.png",
		field: "Tools",
	},
	{ name: "FAG", logo: "/images/brands/fag.png", field: "Bearings" },
	{
		name: "Schneider Electric",
		logo: "/images/brands/schneider-electric.png",
		field: "Electrical",
	},
	{ name: "Makita", logo: "/images/brands/makita.png", field: "Tools" },
	{ name: "Polycab", logo: "/images/brands/polycab.png", field: "Cable" },
	{ name: "SKF", logo: "/images/brands/skf.png", field: "Bearings" },
	{
		name: "Janatics",
		logo: "/images/brands/janatics.png",
		field: "Pneumatics",
	},
	{ name: "ELGi", logo: "/images/brands/elgi.png", field: "Compressors" },
	{ name: "Kirloskar", logo: "/images/brands/kirloskar.png", field: "Pumps" },
	{ name: "Siemens", logo: "/images/brands/siemens.png", field: "Electrical" },
];

export const brandsNote =
	"Authorised and stocked lines from established industrial manufacturers.";
