/**
 * The four sectors, two of which sit under Construction as sub-pages.
 * Drives the home industry index, the Industries nav dropdown, the footer
 * sitemap and the /industries/* routes.
 *
 * The lead paragraph on each is the approved Capabilities copy from the demo.
 * Note the Oil & Gas entry: the client's live site duplicates the maritime
 * blurb there by mistake. Proper copy is written here instead — worth telling
 * them about the bug on their current page.
 *
 * @format
 */

export type Industry = {
	/** URL segment. Children nest under their parent's segment. */
	slug: string;
	name: string;
	shortName: string;
	/** One-liner from the home index strip — approved copy. */
	blurb: string;
	/** Approved Capabilities paragraph. */
	lead: string;
	/** ⚠️ CLIENT REVIEW — extension written in the same voice, no claims made. */
	detail: string;
	/** ⚠️ CLIENT REVIEW — category-level, non-specific. */
	points: string[];
	/** Three reasons to work with BMGT in this sector. Structure carried over
	 *  from the predecessor site's "Why Choose" block; the copy is written here
	 *  in BMGT's own voice and claims nothing that has not been confirmed. */
	why: { title: string; body: string }[];
	image: string;
	imageAlt: string;
	/** Product slugs, in the order they matter to this sector. */
	products: string[];
	children?: Industry[];
};

export const industries: Industry[] = [
	{
		slug: "shipbuilding",
		name: "Shipbuilding, Ship Repair & Yacht Refits",
		shortName: "Shipbuilding & Repair",
		blurb: "Materials that keep yards moving and vessels seaworthy.",
		lead: "From hull plate to switchgear, we supply yards and repair docks worldwide. Less a vendor, more the crew handling your material chain.",
		detail:
			"Newbuild, repair and refit each pull on a different part of that chain. A newbuild programme wants steady, scheduled supply against a bill of materials; a vessel in dock wants an answer this afternoon. We are set up for both, and we would rather tell you a part is three weeks out than let you find out at the quayside.",
		points: [
			"Newbuild supply scheduled against the build programme",
			"Repair and dry-dock enquiries handled at short notice",
			"Yacht refit and fit-out items sourced to specification",
			"Documentation prepared alongside the material",
		],
		why: [
			{
				title: "One yard, one contact",
				body: "Hull plate, pipework, switchgear and deck fittings come off the same order rather than four. When something is late you ring one number, and whoever answers already knows the job.",
			},
			{
				title: "Built around dock time",
				body: "A vessel in dock costs money by the hour. Repair enquiries are answered the same day where we can, and flagged honestly where we cannot — you hear a three-week lead time now, not at the quayside.",
			},
			{
				title: "Documented as it ships",
				body: "Class and survey paperwork travels with the material rather than behind it, so nothing arrives that your surveyor then has to chase.",
			},
		],
		image: "/images/industries/shipbuilding.jpg",
		imageAlt: "",
		products: [
			"shipbuilding",
			"steel",
			"electrical",
			"pumps-and-valves",
			"mechanical",
			"ppe",
		],
	},
	{
		slug: "construction",
		name: "Construction",
		shortName: "Construction",
		blurb: "Supply that lifts the whole project, from groundwork to finish.",
		lead: "Whatever the site, whatever the stage — bulk raw material through to final fittings. Deliveries land when promised and someone always picks up the phone.",
		detail:
			"Construction supply is a scheduling problem as much as a sourcing one. Material that arrives early is material you have to store and guard; material that arrives late stops a trade. We phase deliveries against your programme and keep one contact across the whole job, from groundwork through to handover.",
		points: [
			"Bulk material phased against the site programme",
			"Single point of contact across every trade package",
			"Finishing hardware and stone handled by the same team",
			"Deliveries confirmed before they are promised",
		],
		why: [
			{
				title: "Phased to your programme",
				body: "Material that lands early is material you have to store and guard. Deliveries are split to follow the build sequence, and confirmed before they leave rather than after.",
			},
			{
				title: "Every stage, one supplier",
				body: "Groundwork through to ironmongery, stone included. You are not re-tendering each package to a new vendor halfway down the programme.",
			},
			{
				title: "Told before it slips",
				body: "If a delivery is going to move, you hear it from us while there is still time to reorder the trades around it.",
			},
		],
		image: "/images/industries/construction.jpg",
		imageAlt: "",
		products: ["construction", "steel", "granite", "electrical", "ppe"],
		children: [
			{
				slug: "building",
				name: "Building & Civil Works",
				shortName: "Building & Civil Works",
				blurb: "Structure, envelope and first fix for buildings and civils.",
				lead: "The structural and first-fix half of a construction package: rebar, sections, formwork materials, fixings and the consumables a site burns through before anyone thinks about finishes.",
				detail:
					"This is the stage where quantities are large and substitutions are consequential, so we quote against the schedule rather than a round number and confirm each release before it leaves. Where a programme moves — and it does — the call-off moves with it.",
				points: [
					"Rebar, mesh and structural sections",
					"Formwork, cement and aggregate supply",
					"Fixings, anchors and site consumables",
					"Plumbing, drainage and electrical first fix",
				],
				why: [
					{
						title: "Quoted against the schedule",
						body: "Structural quantities are large enough that a rounded number is not much use. We price from the bar schedule and the cutting list, and confirm each release before it leaves.",
					},
					{
						title: "Substitutions put in writing",
						body: "Where a section or a grade is not available we say so and put the alternative in front of you, rather than sending something close and letting the inspector find it.",
					},
					{
						title: "Call-offs that move with you",
						body: "Programmes shift. The release dates shift with them, without renegotiating the order every time the sequence changes.",
					},
				],
				image: "/images/product-06-construction.jpg",
				imageAlt: "",
				products: ["construction", "steel", "electrical", "ppe"],
			},
			{
				slug: "granite",
				name: "Granite",
				shortName: "Granite",
				blurb: "Dimension stone for facades, floors and finish work.",
				lead: "Stone supply for the finishing end of a build — cladding, flooring, paving and cut-to-size work where the material has to read consistently across a whole elevation.",
				detail:
					"Stone cannot be bought sight-unseen, so we work from samples and batch references and are straight about what can and cannot be matched from a single block. Cutting, edging and finishing are arranged so pieces arrive closer to installable.",
				points: [
					"Slabs, cladding and paving",
					"Cut-to-size, edge and surface finishing",
					"Batch matching handled from samples",
					"Kerbs, sills, thresholds and countertops",
				],
				why: [
					{
						title: "Matched from samples",
						body: "Stone cannot be bought sight unseen. We work from physical samples and batch references, and say plainly when a run cannot be matched from one block.",
					},
					{
						title: "Cut closer to installable",
						body: "Cutting, edging and surface finishing are arranged before delivery, so pieces arrive ready to fix rather than ready to fabricate.",
					},
					{
						title: "One elevation, one batch",
						body: "Where a facade has to read consistently, the quantity is reserved from the same block at the point of order rather than topped up later.",
					},
				],
				image: "/images/product-07-granite.jpg",
				imageAlt: "",
				products: ["granite", "construction"],
			},
		],
	},
	{
		slug: "oil-and-gas",
		name: "Oil & Gas",
		shortName: "Oil & Gas",
		blurb: "Parts and materials that keep operations running without pause.",
		lead: "Rigs, refineries and pipelines run on parts arriving on time. We handle sourcing, documentation and logistics so the schedule holds.",
		detail:
			"Shutdown windows do not move, and a part that arrives without the right paperwork has not really arrived. We work backwards from the date the material is needed on site and keep the documentation moving alongside the goods rather than behind them.",
		points: [
			"Shutdown and turnaround supply planned to the window",
			"Documentation handled alongside the material",
			"Logistics coordinated to site, not just to port",
			"Repeat and consumable lines held against call-off",
		],
		why: [
			{
				title: "Planned to the window",
				body: "Shutdown dates do not move. We work backwards from the date material is needed on site, and tell you early if a line is not going to make it.",
			},
			{
				title: "Paperwork with the parts",
				body: "A part without its certification has not really arrived. Documentation is prepared alongside the goods and checked before dispatch, not after a rejection.",
			},
			{
				title: "Delivered to site, not to port",
				body: "Logistics are coordinated through to the location, including the last leg that usually gets handed back to the client.",
			},
		],
		image: "/images/industries/oil-and-gas.jpg",
		imageAlt: "",
		products: ["pumps-and-valves", "mechanical", "steel", "electrical", "ppe"],
	},
	{
		slug: "general-engineering",
		name: "General Engineering",
		shortName: "General Engineering",
		blurb: "Precision components and deep inventory for every build.",
		lead: "Bearings, couplings, valves and the precision parts around them. We work alongside your engineers rather than quoting off a list.",
		detail:
			"Workshops and fabricators tend to need a little of a lot, and the cost of that is usually spread across half a dozen accounts. Consolidating it with one supplier is worth more than a line-by-line saving, and it means an obsolete part becomes our problem to identify rather than yours.",
		points: [
			"Broad catalogue consolidated onto one account",
			"Obsolete and hard-to-identify parts traced from samples",
			"Workshop consumables and tooling alongside components",
			"Engineer-to-engineer conversations, not order-taking",
		],
		why: [
			{
				title: "Consolidated onto one account",
				body: "A little of a lot, across half a dozen categories, on one order and one invoice instead of six separate ones.",
			},
			{
				title: "Obsolete parts identified",
				body: "Send a photograph, a worn sample, or a number off a plate. Tracing what it is becomes our problem rather than yours.",
			},
			{
				title: "Engineer to engineer",
				body: "Quotes come back with what we would substitute and why, rather than a line-by-line price against a list nobody read.",
			},
		],
		image: "/images/industries/general-engineering.jpg",
		imageAlt: "",
		products: ["mechanical", "pumps-and-valves", "steel", "electrical"],
	},
];

/** Path for a top-level industry or, with a parent, one of its children. */
export const industryPath = (
	industry: Pick<Industry, "slug">,
	parent?: Pick<Industry, "slug">,
) =>
	parent ?
		`/industries/${parent.slug}/${industry.slug}`
	:	`/industries/${industry.slug}`;

/** Flattened list of every industry route, each paired with its parent. */
export const allIndustryRoutes: { industry: Industry; parent?: Industry }[] =
	industries.flatMap((industry) => [
		{ industry },
		...(industry.children ?? []).map((child) => ({
			industry: child,
			parent: industry,
		})),
	]);

export const findIndustry = (
	slug: string,
	parentSlug?: string,
): Industry | undefined => {
	const parent = industries.find((i) => i.slug === (parentSlug ?? slug));
	if (!parent) return undefined;
	return parentSlug ? parent.children?.find((c) => c.slug === slug) : parent;
};
