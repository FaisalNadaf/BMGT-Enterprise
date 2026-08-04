/**
 * The eight supply categories. This array is the single source for:
 * the home tile grid, the Products nav dropdown, the footer sitemap and the
 * /products/* routes. Add a category here and it appears in all four.
 *
 * ⚠️ CLIENT REVIEW — every `blurb`, `intro` and `capabilities` list below was
 * written from the category name alone, not from BMGT's own copy. They are
 * deliberately category-level and non-specific: no grades, no pressure classes,
 * no certifications are claimed. Confirm or replace before go-live.
 *
 * @format
 */

/**
 * One line item inside a category.
 *
 * `name` is FACT — taken verbatim from the predecessor site's own catalogue.
 * `line` is ORIGINAL BMGT copy, written here: deliberately short and
 * non-specific, claiming no grades, pressure classes or certifications.
 *
 * `image` is the product photograph, recovered from the predecessor site and
 * held locally under /images/catalogue/<category>/. Optional: one item's source
 * file is gone from the origin, and that card renders a lettered fallback tile
 * rather than a broken frame.
 *
 * ⚠️ TODO: confirm image rights. These are the client's own predecessor-site
 * photographs, but several look like manufacturer or stock imagery that the
 * previous site may itself have used under licence. Confirm before go-live.
 */
export type SubProduct = {
	name: string;
	line: string;
	image?: string;
};

export type Product = {
	/** URL segment under /products/ */
	slug: string;
	name: string;
	/** Short name for nav/breadcrumbs where the full name is unwieldy. */
	shortName: string;
	/** One-liner — approved copy, carried over from the demo. */
	blurb: string;
	/** Page intro paragraph. */
	intro: string;
	/** Second paragraph — how we handle this category. */
	detail: string;
	capabilities: string[];
	/** The imported catalogue — every line the predecessor site listed. */
	subProducts: SubProduct[];
	image: string;
	/** Alt text. Empty where the photo is decorative beside a heading. */
	imageAlt: string;
	/** Industry slugs this category feeds — drives "Related industries". */
	industries: string[];
};

export const products: Product[] = [
	{
		slug: "mechanical",
		name: "Mechanical",
		shortName: "Mechanical",
		blurb: "Bearings, couplings, fasteners, drives and transmission parts.",
		intro:
			"The rotating and fastening parts that keep plant turning. Bearings, couplings, drives and the consumables around them, held broad and deep enough that a maintenance list does not have to be split across four vendors.",
		detail:
			"Most mechanical enquiries reach us mid-breakdown, so we treat them that way: identify from a part number, a photograph or a worn sample, then quote what is available now against what is available correctly. We will tell you which is which.",
		capabilities: [
			"Bearings, housings and lubrication",
			"Couplings, belts, chains and drive components",
			"Fasteners in commercial and marine grades",
			"Seals, bushings and wear parts",
			"Hand and power tools for maintenance crews",
		],
		subProducts: [
			{
				name: "Bearings",
				line: "Ball, roller and plain bearings with housings and lubrication.",
				image: "/images/catalogue/mechanical/bearings.jpg",
			},
			{
				name: "Couplings",
				line: "Rigid, flexible and fluid couplings for shaft-to-shaft drive.",
				image: "/images/catalogue/mechanical/couplings.jpg",
			},
			{
				name: "Belts",
				line: "V-belts, timing and flat belts for power transmission.",
				image: "/images/catalogue/mechanical/belts.jpg",
			},
			{
				name: "Pulleys",
				line: "Drive and idler pulleys for belt transmission.",
				image: "/images/catalogue/mechanical/pulleys.jpg",
			},
			{
				name: "Chain sprockets",
				line: "Sprockets and chain for conveyor and drive duty.",
				image: "/images/catalogue/mechanical/chain-sprockets.jpg",
			},
			{
				name: "Motors",
				line: "Electric motors for drives, pumps and workshop plant.",
				image: "/images/catalogue/mechanical/motors.jpg",
			},
			{
				name: "Springs",
				line: "Compression, tension and torsion springs to sample or drawing.",
				image: "/images/catalogue/mechanical/springs.jpg",
			},
			{
				name: "Nuts and bolts",
				line: "Fasteners in commercial and marine grades, metric and imperial.",
				image: "/images/catalogue/mechanical/nuts-and-bolts.jpg",
			},
			{
				name: "Pneumatic and hydraulic hoses & fittings",
				line: "Hose, couplings and fittings for air and hydraulic lines.",
				image:
					"/images/catalogue/mechanical/pneumatic-and-hydraulic-hoses-and-fittings.jpg",
			},
		],
		image: "/images/product-03-mechanical.jpg",
		imageAlt: "",
		industries: ["general-engineering", "shipbuilding", "oil-and-gas"],
	},
	{
		slug: "pumps-and-valves",
		name: "Valves & Pumps",
		shortName: "Valves & Pumps",
		blurb: "Flow control and fluid handling across pressure classes.",
		intro:
			"Flow control for systems that cannot be taken offline for long. We supply valves, pumps and the fittings around them across the body materials and pressure classes these sectors specify, sourced against your line list rather than picked off a catalogue page.",
		detail:
			"Valve work lives or dies on documentation, so we handle the paperwork alongside the parts and flag anything that will not arrive with what your inspector expects. Replacement and refit enquiries are welcome even when the original supplier is long gone.",
		capabilities: [
			"Gate, globe, ball, butterfly and check valves",
			"Actuated and manually operated assemblies",
			"Centrifugal and positive-displacement pumps",
			"Seals, gaskets and gland packing",
			"Flanges, fittings and pipe supports",
		],
		subProducts: [
			{
				name: "Gate valves",
				line: "Full-bore isolation for infrequent operation.",
				image: "/images/catalogue/pumps-and-valves/gate-valves.jpg",
			},
			{
				name: "Ball valves",
				line: "Quarter-turn isolation for on/off service.",
				image: "/images/catalogue/pumps-and-valves/ball-valves.jpg",
			},
			{
				name: "Butterfly valves",
				line: "Compact quarter-turn isolation at larger bores.",
				image: "/images/catalogue/pumps-and-valves/butterfly-valves.jpg",
			},
			{
				name: "Globe valves",
				line: "Throttling and regulation where flow control matters.",
				image: "/images/catalogue/pumps-and-valves/globe-valves.jpg",
			},
			{
				name: "Check valves / NRV",
				line: "Non-return protection against backflow.",
				image: "/images/catalogue/pumps-and-valves/check-valves-nrv.jpg",
			},
			{
				name: "Needle valves",
				line: "Fine metering on instrument and sampling lines.",
				image: "/images/catalogue/pumps-and-valves/needle-valves.jpg",
			},
			{
				name: "Plug valves",
				line: "Tapered-plug isolation for viscous and dirty media.",
				image: "/images/catalogue/pumps-and-valves/plug-valves.jpg",
			},
			{
				name: "Foot valves",
				line: "Suction-line retention with integral strainer.",
				image: "/images/catalogue/pumps-and-valves/foot-valves.jpg",
			},
			{
				name: "Balancing valves",
				line: "Flow distribution across circuits and risers.",
				image: "/images/catalogue/pumps-and-valves/balancing-valves.jpg",
			},
			{
				name: "Pressure reducing valves",
				line: "Downstream pressure held to a set point.",
				image:
					"/images/catalogue/pumps-and-valves/pressure-reducing-valves.jpg",
			},
			{
				name: "Air release valves",
				line: "Trapped air vented from pipelines and mains.",
				image: "/images/catalogue/pumps-and-valves/air-release-valves.jpg",
			},
			{
				name: "Fire hydrant valves",
				line: "Landing and hydrant valves for firefighting mains.",
				image: "/images/catalogue/pumps-and-valves/fire-hydrant-valves.jpg",
			},
			{
				name: "Strainers",
				line: "Y-type and basket strainers protecting downstream plant.",
				image: "/images/catalogue/pumps-and-valves/strainers.jpg",
			},
			{
				name: "Centrifugal pumps",
				line: "General transfer duty across clean and process media.",
				image: "/images/catalogue/pumps-and-valves/centrifugal-pumps.jpg",
			},
			{
				name: "Positive displacement pumps",
				line: "Fixed volume per revolution for viscous duty.",
				image:
					"/images/catalogue/pumps-and-valves/positive-displacement-pumps.jpg",
			},
			{
				name: "Diaphragm pumps",
				line: "Air-operated transfer for abrasive and shear-sensitive fluids.",
				image: "/images/catalogue/pumps-and-valves/diaphragm-pumps.jpg",
			},
			{
				name: "Gear pumps",
				line: "Oil and viscous fluid transfer at steady flow.",
				image: "/images/catalogue/pumps-and-valves/gear-pumps.jpg",
			},
			{
				name: "Screw pumps",
				line: "Low-pulsation transfer for lubricating and fuel oils.",
				image: "/images/catalogue/pumps-and-valves/screw-pumps.jpg",
			},
			{
				name: "Piston pumps",
				line: "Reciprocating duty where discharge pressure is high.",
				image: "/images/catalogue/pumps-and-valves/piston-pumps.jpg",
			},
			{
				name: "Submersible pumps",
				line: "Drainage, dewatering and borehole duty.",
				image: "/images/catalogue/pumps-and-valves/submersible-pumps.jpg",
			},
			{
				name: "Fire hydrant pumps",
				line: "Pump sets for hydrant and sprinkler mains.",
				image: "/images/catalogue/pumps-and-valves/fire-hydrant-pumps.jpg",
			},
			{
				name: "Drum pumps",
				line: "Barrel and IBC decanting for chemicals and oils.",
				image: "/images/catalogue/pumps-and-valves/drum-pumps.jpg",
			},
		],
		image: "/images/product-02-valves.jpg",
		imageAlt: "",
		industries: ["oil-and-gas", "shipbuilding", "general-engineering"],
	},
	{
		slug: "shipbuilding",
		name: "Shipbuilding, Ship Repair & Yacht Refits",
		shortName: "Shipbuilding & Refits",
		blurb: "Hull plate through to fit-out, sourced for marine service.",
		intro:
			"A yard needs one supplier who understands that a vessel in dock is costing money every hour. We cover the material chain from hull plate through to fit-out, sourced for marine service rather than adapted to it.",
		detail:
			"Newbuild, repair and refit all pull on different parts of that chain, and a refit especially rarely arrives with a tidy bill of materials. Send us what you have — a survey list, a photograph, a class requirement — and we will work it into something quotable.",
		capabilities: [
			"Hull and structural plate",
			"Marine pipework, valves and fittings",
			"Deck hardware, mooring and lifting equipment",
			"Electrical and switchgear for marine service",
			"Paints, consumables and refit fit-out items",
		],
		subProducts: [
			{
				name: "Bollards",
				line: "Mooring bollards and bitts for deck and quay.",
				image: "/images/catalogue/shipbuilding/bollards.jpg",
			},
			{
				name: "Fairleads and cleats",
				line: "Deck fittings for mooring line handling.",
				image: "/images/catalogue/shipbuilding/fairleads-and-cleats.jpg",
			},
			{
				name: "Chocks and mooring pipes",
				line: "Hull and deck passages for mooring lines.",
				image: "/images/catalogue/shipbuilding/chocks-and-mooring-pipes.jpg",
			},
			{
				name: "Mooring and towing ropes",
				line: "Rope and line for mooring and towing duty.",
				image: "/images/catalogue/shipbuilding/mooring-and-towing-ropes.jpg",
			},
			{
				name: "Anchors",
				line: "Anchors and the ground tackle around them.",
				image: "/images/catalogue/shipbuilding/anchors.jpg",
			},
			{
				name: "Windows & scuttles",
				line: "Marine windows, scuttles and side lights.",
				image: "/images/catalogue/shipbuilding/windows-and-scuttles.jpg",
			},
			{
				name: "Manholes",
				line: "Access covers and manhole assemblies for tanks.",
				image: "/images/catalogue/shipbuilding/manholes.jpg",
			},
			{
				name: "Flexible couplings",
				line: "Shaftline couplings for propulsion and auxiliaries.",
				image: "/images/catalogue/shipbuilding/flexible-couplings.jpg",
			},
			{
				name: "Lashing, cargo, deck & yard equipment",
				line: "Securing and handling equipment for deck and yard.",
				image:
					"/images/catalogue/shipbuilding/lashing-cargo-deck-and-yard-equipment.jpg",
			},
			{
				name: "Components for steel ships",
				line: "Structural and outfitting components for steel hulls.",
				image: "/images/catalogue/shipbuilding/components-for-steel-ships.jpg",
			},
			{
				name: "Components for FRP & aluminium boats",
				line: "Fittings and components for composite and alloy craft.",
				image:
					"/images/catalogue/shipbuilding/components-for-frp-and-aluminium-boats.jpg",
			},
			{
				name: "Megafiller, primer, paints, antifouling",
				line: "Fillers, primers, topcoats and antifouling systems.",
				image:
					"/images/catalogue/shipbuilding/megafiller-primer-paints-antifouling.jpg",
			},
		],
		image: "/images/product-04-marine.jpg",
		imageAlt: "",
		industries: ["shipbuilding", "general-engineering"],
	},
	{
		slug: "steel",
		name: "Steel",
		shortName: "Steel",
		blurb: "Plate, sections, bar and pipe in project quantities.",
		intro:
			"Structural and general steel in project quantities — plate, sections, bar and pipe, delivered in the sizes the drawing actually calls for rather than the sizes that happen to be on a shelf.",
		detail:
			"We quote against a cutting list as readily as against a tonnage, and can arrange cutting, drilling and profiling so material arrives closer to ready. Where a grade matters, it is stated on the paperwork and not assumed.",
		capabilities: [
			"Plate and sheet",
			"Beams, channels, angles and hollow sections",
			"Round, flat and square bar",
			"Pipe, tube and fittings",
			"Cut, drilled and profiled to requirement",
		],
		subProducts: [
			{
				name: "Steel plates",
				line: "Plate and sheet in structural and general grades.",
				image: "/images/catalogue/steel/steel-plates.jpg",
			},
			{
				name: "Steel profiles",
				line: "Beams, channels, angles and hollow sections.",
				image: "/images/catalogue/steel/steel-profiles.jpg",
			},
			{
				name: "Steel pipes",
				line: "Seamless and welded pipe across schedules.",
				image: "/images/catalogue/steel/steel-pipes.jpg",
			},
			{
				name: "Steel pipe fittings",
				line: "Elbows, tees, reducers and caps.",
				image: "/images/catalogue/steel/steel-pipe-fittings.jpg",
			},
			{
				name: "Steel flanges",
				line: "Flanges across faces and pressure classes.",
				image: "/images/catalogue/steel/steel-flanges.jpg",
			},
		],
		image: "/images/product-05-steel.jpg",
		imageAlt: "",
		industries: [
			"construction",
			"shipbuilding",
			"oil-and-gas",
			"general-engineering",
		],
	},
	{
		slug: "electrical",
		name: "Electrical",
		shortName: "Electrical",
		blurb: "Cabling, switchgear, panel components and site power.",
		intro:
			"Power distribution for yards, sites and plant rooms — from the cable pulled through a hull to the board that feeds a tower crane. We quote from stock where we hold it and source to specification where we do not, which keeps an entire electrical scope with one supplier and one point of contact.",
		detail:
			"Send us the schedule or the single-line drawing and we will come back with what we can supply, what we would substitute and what the lead time looks like. Where a project calls for a particular manufacturer, we say so rather than quoting an equivalent and hoping it passes.",
		capabilities: [
			"Cable, cable accessories, glands and terminations",
			"Switchgear and distribution boards",
			"Panel components, controls and instrumentation",
			"Lighting and temporary site power",
			"Containment, tray, trunking and conduit",
		],
		subProducts: [
			{
				name: "Cable trays",
				line: "Tray, ladder and containment for cable routing.",
				image: "/images/catalogue/electrical/cable-trays.jpg",
			},
			{
				name: "Power cables",
				line: "LV and MV power cable in copper and aluminium.",
				image: "/images/catalogue/electrical/power-cables.jpg",
			},
			{
				name: "Flexible cable",
				line: "Trailing and flexible cable for movable plant.",
				image: "/images/catalogue/electrical/flexible-cable.jpg",
			},
			{
				name: "Welding cables",
				line: "Flexible welding cable and connection accessories.",
				image: "/images/catalogue/electrical/welding-cables.jpg",
			},
			{
				name: "Switchgear",
				line: "Distribution boards, panels and switchgear assemblies.",
				image: "/images/catalogue/electrical/switch-gear.jpg",
			},
			{
				name: "Circuit breakers",
				line: "MCB, MCCB and ACB protection across ratings.",
				image: "/images/catalogue/electrical/circuit-breaker.jpg",
			},
			{
				name: "Contactors",
				line: "Switching for motor and load circuits.",
				image: "/images/catalogue/electrical/contactor.jpg",
			},
			{
				name: "Control gear",
				line: "Control components for panels and starter assemblies.",
				image: "/images/catalogue/electrical/control-gear.jpg",
			},
			{
				name: "Starters",
				line: "Direct-on-line, star-delta and soft starters.",
				image: "/images/catalogue/electrical/starters.jpg",
			},
			{
				name: "Relays",
				line: "Control, protection and timing relays.",
				image: "/images/catalogue/electrical/relays.jpg",
			},
			{
				name: "Power capacitors",
				line: "Power-factor correction capacitors and banks.",
				image: "/images/catalogue/electrical/power-capacitors.jpg",
			},
			{
				name: "Motors",
				line: "Electric motors for drives, pumps and site plant.",
				image: "/images/catalogue/electrical/motors.jpg",
			},
		],
		image: "/images/product-01-electrical.jpg",
		imageAlt: "",
		industries: [
			"shipbuilding",
			"oil-and-gas",
			"construction",
			"general-engineering",
		],
	},
	{
		slug: "construction",
		name: "Construction",
		shortName: "Construction",
		blurb: "Bulk raw materials through to finishing hardware.",
		intro:
			"Everything a site consumes, from the first pour to the last handle. Bulk raw material at the beginning of a programme and finishing hardware at the end are very different supply problems, and we would rather solve both than hand one back.",
		detail:
			"Deliveries are scheduled against your programme, not ours, and phased where storage on site is tight. If something is going to slip, you hear it from us before it becomes your problem.",
		capabilities: [
			"Rebar, mesh and structural steel",
			"Cement, aggregate and formwork materials",
			"Fixings, anchors and site consumables",
			"Plumbing, drainage and electrical first fix",
			"Finishing hardware and ironmongery",
		],
		subProducts: [
			{
				name: "Plywood",
				line: "Structural, shuttering and finish-grade plywood.",
				image: "/images/catalogue/construction/plywood.jpg",
			},
			{
				name: "Gypsum boards",
				line: "Board and partition systems for internal fit-out.",
				image: "/images/catalogue/construction/gypsum-boards.jpg",
			},
			{
				name: "Anchor bolts",
				line: "Cast-in and post-installed anchors and fixings.",
				image: "/images/catalogue/construction/anchor-bolts.jpg",
			},
			{
				name: "Imperial Red / Lakha Red",
				line: "Red dimension granite for cladding and paving.",
				image: "/images/catalogue/construction/imperial-red-lakha-red.jpg",
			},
			{
				name: "Royal Black / Tiger Black",
				line: "Black dimension granite for cladding and finish work.",
				image: "/images/catalogue/construction/royal-black-tiger-black.jpg",
			},
		],
		image: "/images/product-06-construction.jpg",
		imageAlt: "",
		industries: ["construction", "general-engineering"],
	},
	{
		slug: "granite",
		name: "Granite",
		shortName: "Granite",
		blurb: "Dimension stone and slab supply for build and finish work.",
		intro:
			"Dimension stone for build and finish work — slabs, cladding, paving and cut-to-size pieces, supplied for projects where the stone has to match across a whole elevation and not just across one crate.",
		detail:
			"Stone is the one category where a photograph is not enough, so we work from samples and batch references and will tell you plainly when a run cannot be matched from the same block.",
		capabilities: [
			"Slabs and dimension stone",
			"Cladding, flooring and paving",
			"Countertops and vanity units",
			"Kerbs, sills and thresholds",
			"Cut-to-size, edge and surface finishing",
		],
		/* Only two lines were named on the predecessor's granite page. A further
       fifteen varieties sat there as unlabelled images, so their names could
       not be recovered — see subProductsNote. */
		subProducts: [
			{
				name: "Finished granite",
				line: "Cut, edged and polished stone ready to install.",
				image: "/images/catalogue/granite/finished-granite.jpg",
			},
			{
				name: "Raw granite",
				line: "Block and rough slab supplied for onward processing.",
				image: "/images/catalogue/granite/raw-granite.jpg",
			},
		],
		image: "/images/product-07-granite.jpg",
		imageAlt: "",
		industries: ["construction"],
	},
	{
		slug: "ppe",
		name: "Personal Protective Equipment (PPE)",
		shortName: "PPE",
		blurb: "Site-rated protective gear for crews on and offshore.",
		intro:
			"Protective equipment for crews working on site, in yards and offshore. Kit that gets worn for a twelve-hour shift has to fit and last, so we supply it as a standing line rather than an afterthought bolted onto a materials order.",
		detail:
			"We can hold repeat items against a call-off so replacement gear is not a fresh procurement exercise every quarter. Sizing runs and consumable rates are worth agreeing up front.",
		capabilities: [
			"Head, eye and hearing protection",
			"Hand protection across cut and chemical ratings",
			"Coveralls, high-visibility and flame-retardant clothing",
			"Safety footwear",
			"Fall arrest, harnesses and confined-space equipment",
		],
		/* ⚠️ Deliberately empty. The predecessor's PPE page carried nine product
       photographs with no captions of any kind, so there are no line-item
       names to import. Inventing them would put fabricated catalogue entries
       next to fifty-nine genuine ones, which is worse than an honest gap —
       the page falls back to the `capabilities` list above and shows a notice.
       TODO: get the PPE line list from BMGT. */
		subProducts: [],
		image: "/images/product-08-ppe.jpg",
		imageAlt: "",
		industries: [
			"construction",
			"oil-and-gas",
			"shipbuilding",
			"general-engineering",
		],
	},
];

/**
 * Where the catalogue photography came from.
 *
 * Not from the HTTrack mirror — its `wp-content/uploads/2024/06/` holds 109
 * files that look like the catalogue images, but 108 are zero-byte `.html`
 * stubs; HTTrack recorded the URLs and never fetched the binaries. The origin
 * still serves them, so 66 of the 67 files under `/images/catalogue/` were
 * pulled from there directly and are held locally. Nothing is hotlinked.
 *
 * The 67th is "Megafiller, primer, paints, antifouling", which the origin never
 * had: it 404s there in every size variant, the shipbuilding page no longer
 * lists the item at all, and the media API returns nothing for it. That one was
 * supplied by the client and is the only catalogue image not carried over.
 * Every sub-product now has an `image`.
 *
 * `.cat__fallback` in styles/pages.css is therefore unused by the current data.
 * It stays as the safety net for any item added later without a photograph —
 * the render branches on `image` being set, so a new entry degrades to the
 * drawn plate rather than to a broken frame.
 *
 * ⚠️ TODO: confirm image rights before go-live. The 66 carried-over files come
 * from the client's own predecessor site, but several look like manufacturer or
 * stock photography that the previous site may itself have used under licence.
 * The client-supplied Megafiller image is outside that question.
 */
export const subProductsNote =
	"Catalogue photography is carried over from BMGT’s previous site pending a rights check.";

/** 67 imported line items across seven of the eight categories (PPE is empty). */
export const subProductCount = products.reduce(
	(n, p) => n + p.subProducts.length,
	0,
);

export const productBySlug = (slug: string) =>
	products.find((p) => p.slug === slug);

export const productPath = (p: Pick<Product, "slug">) => `/products/${p.slug}`;
