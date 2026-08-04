/** @format */

import { PageShell } from "../components/PageShell";
import { PageHero } from "../components/PageHero";
import { SectionHead } from "../components/SectionHead";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { CTABand } from "../components/CTABand";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { site } from "../data/site";
import { industryPath } from "../data/industries";
import { useIndustries } from "../i18n/content";
import { useLocale } from "../i18n/useLocale";

/* Photographs for the three tests, chosen for what each question is actually
   about — movement, material in service, and traceable stock. None repeats
   about.jpg, which this page already uses twice. Decorative: the heading
   beside each carries the meaning, so alt stays empty. The copy itself lives
   in the dictionary. */
const PRINCIPLE_IMAGES = [
	/* Lead time and delivery — a working container port. */
	"/images/hero-port.jpg",
	/* Literally the point of use. */
	"/images/industries/construction.jpg",
	/* Racked, graded stock — material whose origin is known. */
	"/images/product-05-steel.jpg",
];

export default function About() {
	const { t, lp } = useLocale();
	const industries = useIndustries();

	/* Copy comes from the dictionary; the photographs stay here because they
     are chosen per question, not per language. */
	const principles = PRINCIPLE_IMAGES.map((image, i) => ({
		image,
		title: t("ui.about.p" + (i + 1) + "Title"),
		body: t("ui.about.p" + (i + 1) + "Body"),
	}));

	return (
		<PageShell
			title={t("ui.about.title")}
			description={t("ui.about.description")}>
			<PageHero
				eyebrow={t("ui.about.heroEyebrow")}
				title={t("ui.about.heroTitle")}
				sub={t("ui.about.heroSub")}
				image="/images/about.jpg"
				crumbs={[
					{ label: t("ui.crumbs.home"), to: lp("/") },
					{ label: t("ui.about.title") },
				]}
			/>

			<section className="section">
				<div className="container about about--reverse">
					{/* .about--reverse puts the photograph in the right-hand column
					    (order: 2), so the directions are the mirror of the home
					    page's — the image enters from the right, the copy from the
					    left. Direction that contradicts final position is what makes
					    a page feel restless. */}
					<Reveal
						className="about__media"
						as="figure"
						direction="right">
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

					<Reveal
						className="about__copy"
						direction="left"
						delay={0.1}>
						<SectionHead
							eyebrow={t("ui.about.whoEyebrow")}
							title={t("ui.about.whoTitle")}
							flush
						/>
						<p className="about__lead">
							{t("ui.about.whoP1", { name: site.legalName })}
						</p>
						<p>{t("ui.about.whoP2")}</p>
						<p>{t("ui.about.whoP3")}</p>
					</Reveal>
				</div>
			</section>

			{/* ── HOW WE WORK ───────────────────────────────────────────────────── */}
			<section
				className="section section--mist"
				aria-labelledby="how-head">
				<div className="container">
					<Reveal direction="left">
						<SectionHead
							eyebrow={t("ui.about.howEyebrow")}
							title={t("ui.about.howTitle")}
							intro={t("ui.about.howIntro")}
							id="how-head"
						/>
					</Reveal>

					<Stagger
						as="ul"
						className="grid grid--3"
						stagger={0.08}>
						{principles.map((principle) => (
							<StaggerItem
								as="li"
								key={principle.title}>
								<Card
									title={principle.title}
									body={principle.body}
									image={principle.image}
								/>
							</StaggerItem>
						))}
					</Stagger>
				</div>
			</section>

			{/* ── SECTORS SERVED ────────────────────────────────────────────────── */}
			<section
				className="section section--ink"
				aria-labelledby="sectors-head">
				<div className="container">
					<Reveal direction="left">
						<SectionHead
							eyebrow={t("ui.about.sectorsEyebrow")}
							title={t("ui.about.sectorsTitle")}
							id="sectors-head"
						/>
					</Reveal>

					<Stagger
						as="ul"
						className="grid grid--4"
						stagger={0.08}>
						{industries.map((industry) => (
							<StaggerItem
								as="li"
								key={industry.slug}>
								<Card
									title={industry.name}
									body={industry.blurb}
									to={lp(industryPath(industry))}
									more={t("ui.about.exploreSector")}
									image={industry.image}
									onDark
								/>
							</StaggerItem>
						))}
					</Stagger>

					{/* --center: an action closing a full-width grid, so it sits
					    centred and a little lower than one following a column of
					    left-aligned copy. Same treatment as the industry page's
					    "View all products". */}
					<Reveal
						className="about__actions about__actions--center"
						delay={0.1}>
						<Button
							to={lp("/brands")}
							variant="light"
							arrow>
							{t("ui.about.brandsCta")}
						</Button>
					</Reveal>
				</div>
			</section>

			<CTABand
				title={t("ui.about.ctaTitle")}
				sub={t("ui.about.ctaSub")}
			/>
		</PageShell>
	);
}
