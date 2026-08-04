/** @format */

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { PageShell } from "../components/PageShell";
import { SectionHead } from "../components/SectionHead";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProductTile } from "../components/ProductTile";
import { BrandMarquee } from "../components/BrandMarquee";
import { CTABand } from "../components/CTABand";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { SplitText } from "../components/SplitText";
import { ArrowRight } from "../components/Icons";
import { EASE } from "../lib/motion";
import { site } from "../data/site";
import { industryPath } from "../data/industries";
import { useProducts, useIndustries, useBrandsNote } from "../i18n/content";
import { useLocale } from "../i18n/useLocale";

/* Hero playback speed. The supplied clip runs slower than the page reads, so
   it is doubled. Anything past ~2 starts to look like a fault rather than a
   pace. */
const HERO_RATE = 2;

export default function Home() {
	const { t, lp } = useLocale();
	const products = useProducts();
	const industries = useIndustries();
	const brandsNote = useBrandsNote();
	const reduced = useReducedMotion();
	const videoRef = useRef<HTMLVideoElement>(null);

	/* playbackRate is a DOM property with no JSX attribute behind it, so it has
	   to be assigned to the node. Browsers also reset it whenever new media is
	   loaded, which is why onLoadedMetadata sets it again below — this effect
	   alone would be undone the moment the file finishes loading. */
	useEffect(() => {
		const video = videoRef.current;
		if (video) video.playbackRate = HERO_RATE;
	}, []);

	/* Above the fold, so this is a load-in stagger rather than a scroll reveal. */
	const heroRise = (delay: number) =>
		reduced ?
			{}
		:	{
				initial: { opacity: 0, y: 16 },
				animate: { opacity: 1, y: 0 },
				transition: { duration: 0.7, delay, ease: EASE },
			};

	return (
		<PageShell
			title={t("ui.home.title")}
			description={t("content.site.description")}>
			{/* ── HERO ──────────────────────────────────────────────────────────
          The footage is decorative: it sits behind a scrim and the headline
          carries the message, so it is hidden from assistive tech entirely.
          It runs at HERO_RATE (2x).

          Nothing here is transformed, and that is deliberate — it is the fix
          for two bugs, not an omission:

          The wrapper used to carry a scroll-linked parallax (`y` drifting to
          18%). Retargeting a transform every frame on a full-viewport element
          wrapping a <video> re-rasterises the video's compositing layer on each
          scroll tick, which is what the flicker was.

          The video used to carry a 1.07 → 1 scale-in. Framer promotes a layer
          with will-change: transform while an animation runs and strips it when
          it finishes; across that demote, Chrome's overlap testing drew the
          direct-composited video *above* the .hero::after scrim and left it
          that way until a scroll forced a full recomposite — which is why the
          overlay looked like it arrived on scroll rather than on load.

          Both were decorative, and the footage already moves. If parallax is
          ever wanted back here, it has to animate something that is not a
          video, or the flicker returns.

          ⚠️ The clip autoplays and loops regardless of prefers-reduced-motion,
          and there is no pause control. That is unrequested continuous motion
          for anyone who has asked the OS to suppress it. */}
			<section className="hero">
				<div className="hero__bgwrap">
					<video
						ref={videoRef}
						className="hero__bg"
						// muted + playsInline are what make autoplay permitted at all;
						// without both, mobile Safari and Chrome refuse to start it.
						autoPlay
						muted
						loop
						playsInline
						preload="auto"
						// Re-applied here because loading media resets the rate.
						onLoadedMetadata={(event) => {
							event.currentTarget.playbackRate = HERO_RATE;
						}}
						aria-hidden="true">
						<source
							src="/videos/video.mp4"
							type="video/mp4"
						/>
					</video>
					{/* The scrim is a real element and a *sibling* of the video, not a
					    pseudo-element on the section. That is the whole fix for the
					    overlay only appearing after a scroll.

					    Chrome can promote a <video> to a dedicated overlay layer and
					    paint it past the normal document layers. It gives that up when
					    something overlaps the video — but the overlap test did not
					    catch .hero::after, which hangs off an ancestor two levels up.
					    So the footage kept its overlay and covered the scrim until a
					    scroll invalidated the layer tree and forced a re-test.

					    A sibling that directly overlaps it is unambiguous: the video is
					    demoted immediately, on first paint, and the scrim composites
					    over it like any other element. */}
					<div
						className="hero__scrim"
						aria-hidden="true"
					/>
				</div>

				<div className="hero__body">
					<div className="container">
						<div className="hero__copy">
							<motion.p
								className="eyebrow"
								{...heroRise(0.1)}>
								{t("ui.home.heroEyebrow")}
							</motion.p>
							{/* onMount, not on scroll: this is the first thing on the page,
							    so whileInView would be a race against the observer and a
							    missed callback leaves the h1 invisible. Its own stagger
							    replaces the heroRise fade the other lines use. */}
							<SplitText
								as="h1"
								className="hero__title"
								delay={0.2}
								onMount>
								{t("content.site.tagline")}
							</SplitText>
							<motion.p
								className="hero__sub"
								{...heroRise(0.32)}>
								{t("ui.home.heroSub")}
							</motion.p>
							<motion.div
								className="hero__actions"
								{...heroRise(0.44)}>
								<Button
									to={lp("/contact")}
									variant="light">
									{t("ui.home.heroPrimary")}
								</Button>
								{/* In-page anchor rather than a route: there is no /products
                    index, and the tile grid below is that index. */}
								<Button
									href="#products"
									variant="outline-light">
									{t("ui.home.heroSecondary")}
								</Button>
							</motion.div>
						</div>
					</div>
				</div>

				{/* Decorative: the CTA above is the real affordance. */}
				<motion.div
					className="hero__cue"
					aria-hidden="true"
					{...heroRise(0.72)}>
					<span className="hero__cue-line" />
					<span>{t("ui.home.scroll")}</span>
				</motion.div>
			</section>

			{/* ── ABOUT TEASER ──────────────────────────────────────────────────── */}
			<section className="section">
				<div className="container about">
					{/* Direction follows column position: the photograph is the left
					    column here so it enters from the left, the copy from the
					    right, and the two meet in the middle. On .about--reverse
					    (About page) the order is swapped and so are the directions. */}
					<Reveal
						className="about__media"
						as="figure"
						direction="left">
						<img
							className="about__img"
							src="/images/about.jpg"
							width={1200}
							height={905}
							loading="lazy"
							decoding="async"
							alt={t("ui.home.aboutAlt")}
						/>
					</Reveal>

					{/* Trails the photograph slightly rather than moving with it. */}
					<Reveal
						className="about__copy"
						direction="right"
						delay={0.12}>
						<SectionHead
							eyebrow={t("ui.home.aboutEyebrow")}
							title={t("ui.home.aboutTitle")}
							flush
						/>
						<p className="about__lead">
							{t("ui.home.aboutP1", { name: site.legalName })}
						</p>
						<p>{t("ui.home.aboutP2")}</p>
						<div className="about__actions">
							<Button
								to={lp("/about")}
								variant="outline"
								arrow>
								{t("ui.home.aboutCta")}
							</Button>
						</div>
					</Reveal>
				</div>
			</section>

			{/* The whole container slides, not the <section>. A full-bleed section
			    carries its own background colour, so translating the section would
			    drag that fill off the edge and flash the page white down one side.
			    Moving the container keeps the band planted and slides everything
			    inside it. Every section below follows the same rule.

			    Direction alternates down the page — right here, left for the tiles,
			    right again for capabilities — so the eye is handed from one side to
			    the other rather than being pushed the same way five times. */}
			<section
				className="section section--ink"
				aria-labelledby="industries-head">
				<Reveal
					as="div"
					className="container"
					direction="right">
					<SectionHead
						eyebrow={t("ui.home.industriesEyebrow")}
						title={t("ui.home.industriesTitle")}
						id="industries-head"
					/>

					{/* delayChildren holds the cards until the container has nearly
					    landed. Without it the grid staggers *while* the whole block is
					    still travelling, and the two movements read as one smear. */}
					<Stagger
						as="ul"
						className="grid grid--4"
						stagger={0.08}
						delayChildren={0.22}>
						{industries.map((industry) => (
							<StaggerItem
								as="li"
								key={industry.slug}>
								<Card
									title={industry.name}
									body={industry.blurb}
									to={lp(industryPath(industry))}
									more={t("ui.home.exploreSector")}
									image={industry.image}
									onDark
								/>
							</StaggerItem>
						))}
					</Stagger>
				</Reveal>
			</section>

			{/* ── PRODUCTS ──────────────────────────────────────────────────────
          Full-bleed index: a white text panel plus a feature tile on the first
          row, then rows of photographic tiles. */}
			<section
				className="section section--mist section--flush"
				id="products"
				aria-labelledby="products-head">
				<Reveal
					as="div"
					className="tiles-wrap"
					direction="left">
					<Stagger
						as="ul"
						className="tiles"
						stagger={0.06}
						delayChildren={0.22}>
						<StaggerItem
							as="li"
							className="tile tile--panel">
							<div className="panel">
								<p className="panel__eyebrow">{t("ui.home.productsEyebrow")}</p>
								<h2
									className="panel__title"
									id="products-head">
									{t("ui.home.productsTitle")}
								</h2>
								<p className="panel__body">{t("ui.home.productsBody")}</p>
							</div>
						</StaggerItem>

						{products.map((product, index) => (
							<ProductTile
								key={product.slug}
								product={product}
								span={
									index === 0 ? "feature"
									: index <= 4 ?
										"span3"
									:	"span4"
								}
								eager={index === 0}
							/>
						))}
					</Stagger>
				</Reveal>
			</section>

			{/* ── CAPABILITIES ──────────────────────────────────────────────────── */}
			<section
				className="section section--deep"
				aria-labelledby="capabilities-head">
				<Reveal
					as="div"
					className="container"
					direction="right">
					<SectionHead
						eyebrow={t("ui.home.capabilitiesEyebrow")}
						title={t("ui.home.capabilitiesTitle")}
						id="capabilities-head"
					/>

					{/* Each block carries its own sector photograph, because that is what
              the copy beside it is about — "yards and repair docks", "whatever
              the site", "rigs, refineries and pipelines", "alongside your
              engineers". These previously showed the sector's lead product
              category, which repeated the tile grid one section above. */}
					<Stagger
						as="ul"
						className="grid grid--2"
						stagger={0.08}
						delayChildren={0.22}>
						{industries.map((industry) => (
							<StaggerItem
								as="li"
								key={industry.slug}>
								<Link
									className="cap"
									to={lp(industryPath(industry))}>
									<span className="cap__media">
										<img
											className="cap__img"
											src={industry.image}
											alt=""
											width={900}
											height={600}
											loading="lazy"
											decoding="async"
										/>
									</span>
									<span className="cap__text">
										<h3 className="cap__title">{industry.name}</h3>
										<p className="cap__body">{industry.lead}</p>
										<span className="cap__more">
											{t("ui.home.readMore")}
											<ArrowRight className="btn__arrow" />
										</span>
									</span>
								</Link>
							</StaggerItem>
						))}
					</Stagger>
				</Reveal>
			</section>

			{/* ── BRANDS ──────────────────────────────────────────────────────────
          Centred: the logo strip runs edge to edge and is symmetrical, so
          left-aligned copy above and below it sat off-axis against it. */}
			<section
				className="section brands-center"
				aria-labelledby="brands-head">
				{/* The only centred head on the site. A sideways slide would pull it
				    off its own axis on the way in and then snap it back to centre,
				    so it scales up instead — symmetrical motion for symmetrical
				    copy. */}
				<Reveal
					as="div"
					className="container"
					direction="scale">
					<SectionHead
						eyebrow={t("ui.home.brandsEyebrow")}
						title={t("ui.home.brandsTitle")}
						id="brands-head"
						align="center"
					/>
				</Reveal>

				<BrandMarquee />

				{/* Closing copy under a symmetrical logo strip — it rises rather than
				    slides, for the same reason the head above it scales. */}
				<Reveal
					as="div"
					className="container"
					delay={0.08}>
						<p className="brands__note">{brandsNote}</p>
						<div className="about__actions">
							<Button
								to={lp("/brands")}
								variant="outline"
								arrow>
								{t("ui.home.allBrands")}
							</Button>
						</div>
				</Reveal>
			</section>

			<CTABand />
		</PageShell>
	);
}
