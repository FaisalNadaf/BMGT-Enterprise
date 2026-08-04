/** @format */

import { PageShell } from "../components/PageShell";
import { PageHero } from "../components/PageHero";
import { SectionHead } from "../components/SectionHead";
import { CTABand } from "../components/CTABand";
import { Reveal } from "../components/Reveal";
import { site } from "../data/site";
import { useLocale } from "../i18n/useLocale";

/**
 * ⚠️ PLACEHOLDER — every clause below is generic boilerplate written to give
 * the page structure and to show what needs covering. None of it has been
 * reviewed by a lawyer and none of it is specific to BMGT's jurisdiction,
 * data processors or contract terms. It must be replaced with the client's own
 * legal copy before the site goes live.
 *
 * ── Structure ──────────────────────────────────────────────────────────────
 * This was three stacked sections of unbroken prose, which is how a legal page
 * ends up unread: a buyer looking for the quotations clause had to scan all of
 * it. It is now a contents rail beside a column of clause cards, one heading
 * and one answer each, so a single clause can be found — and linked to.
 *
 * ── The clauses are data, not markup ───────────────────────────────────────
 * Every clause is the same shape, and the old file hand-wrote thirteen
 * near-identical blocks. That repetition is what let it drift: the three
 * sections had already diverged in wrapper markup. Adding, reordering or
 * removing a clause is now an edit to GROUPS and nothing else.
 *
 * ── Copy is untouched ──────────────────────────────────────────────────────
 * Every string is an existing dictionary key. No text was invented here, which
 * also keeps en/ar in parity — the build fails on a mismatch, and inventing
 * English copy would mean shipping an untranslated Arabic page.
 */

type Clause = {
	/** Heading key. */
	h: string;
	/** Body key. Omitted where `items` carries the body instead. */
	p?: string;
	/** Interpolation values for `p`. */
	vars?: Record<string, string>;
	/** Bulleted body, for a clause that enumerates rather than explains. */
	items?: { key: string; vars?: Record<string, string> }[];
	/**
	 * Contact affordances appended after the body. These cannot live inside a
	 * translation string: they are anchors carrying dir and class attributes,
	 * and markup in the dictionary is how a translator ends up breaking a
	 * mailto link.
	 */
	after?: "email" | "emailPhone";
};

type Group = {
	id: string;
	eyebrow: string;
	title: string;
	/** One or more lead paragraphs, before the cards. */
	lead: { key: string; vars?: Record<string, string> }[];
	clauses: Clause[];
};

/* Module constant: `site` is a static import and none of this depends on the
   active locale. Only the t() lookups in the component do. */
const GROUPS: Group[] = [
	{
		id: "privacy",
		eyebrow: "ui.legal.privacyEyebrow",
		title: "ui.legal.privacyTitle",
		lead: [{ key: "ui.legal.privacyP1" }],
		clauses: [
			{
				h: "ui.legal.privacyCollectedH",
				items: [
					{ key: "ui.legal.privacyCollected1" },
					{ key: "ui.legal.privacyCollected2", vars: { name: site.name } },
				],
			},
			{ h: "ui.legal.privacyNotH", p: "ui.legal.privacyNotP" },
			{ h: "ui.legal.privacyThirdH", p: "ui.legal.privacyThirdP" },
			{ h: "ui.legal.privacyRetentionH", p: "ui.legal.privacyRetentionP" },
			{
				h: "ui.legal.privacyRightsH",
				p: "ui.legal.privacyRightsP",
				after: "email",
			},
		],
	},
	{
		id: "terms",
		eyebrow: "ui.legal.termsEyebrow",
		title: "ui.legal.termsTitle",
		lead: [{ key: "ui.legal.termsP1" }],
		clauses: [
			{
				h: "ui.legal.termsContentH",
				p: "ui.legal.termsContentP",
				vars: { name: site.legalName },
			},
			{ h: "ui.legal.termsMarksH", p: "ui.legal.termsMarksP" },
			{ h: "ui.legal.termsOrdersH", p: "ui.legal.termsOrdersP" },
			{
				h: "ui.legal.termsLinksH",
				p: "ui.legal.termsLinksP",
				vars: { name: site.name },
			},
		],
	},
	{
		id: "disclaimer",
		eyebrow: "ui.legal.disclaimerEyebrow",
		title: "ui.legal.disclaimerTitle",
		lead: [
			{ key: "ui.legal.disclaimerP1" },
			{ key: "ui.legal.disclaimerP2", vars: { name: site.legalName } },
		],
		clauses: [
			{
				h: "ui.legal.disclaimerContactH",
				p: "ui.legal.disclaimerContactP",
				after: "emailPhone",
			},
		],
	},
];

const TOC = [
	{ id: "privacy", key: "ui.legal.tocPrivacy" },
	{ id: "terms", key: "ui.legal.tocTerms" },
	{ id: "disclaimer", key: "ui.legal.tocDisclaimer" },
];

export default function Legal() {
	const { t, lp } = useLocale();

	/* Built once and reused. Both are Latin-script and direction-locked: an
	   email address or a phone number reads left-to-right even inside an Arabic
	   paragraph, and without dir="ltr" a leading "+" lands on the wrong side.
	   Same treatment the footer already uses. */
	const mail = (
		<a
			className="latin"
			dir="ltr"
			href={`mailto:${site.emails.info}`}>
			{site.emails.info}
		</a>
	);
	const tel = (
		<a
			className="latin"
			dir="ltr"
			href={site.phone.href}>
			{site.phone.display}
		</a>
	);

	return (
		<PageShell
			title={t("ui.legal.title")}
			description={t("ui.legal.description")}>
			{/* Stone: textural and neutral. A legal page should not carry a
          photograph that implies anything about its content, and this is
          the least active image in the set. */}
			<PageHero
				eyebrow={t("ui.legal.heroEyebrow")}
				title={t("ui.legal.heroTitle")}
				sub={t("ui.legal.heroSub")}
				image="/images/product-07-granite.jpg"
				crumbs={[
					{ label: t("ui.crumbs.home"), to: lp("/") },
					{ label: t("ui.legal.title") },
				]}
			/>

			<section className="section">
				<div className="container legal-layout">
					{/* ── contents rail ──────────────────────────────────────────────
					    Sticky on desktop so the clause list stays reachable however far
					    down you are. Below 1024px it lies flat above the content — a
					    sticky rail on a phone is just lost height. */}
					<nav
						className="legal-rail"
						aria-label={t("ui.legal.tocLabel")}>
						<p className="legal-rail__label">{t("ui.legal.tocLabel")}</p>
						<ul className="legal-rail__list">
							{TOC.map((item) => (
								<li key={item.id}>
									<a
										className="legal-rail__link"
										href={`#${item.id}`}>
										{t(item.key)}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div className="legal-body">
						{/* ui.legal.todo was translated into both locales and then never
						    rendered anywhere. On a page whose every clause is unreviewed
						    boilerplate, that warning is the most important thing on it —
						    it belongs in front of the reader, not idle in the dictionary. */}
						<Reveal
							as="p"
							className="todo"
							direction="none">
							{t("ui.legal.todo")}
						</Reveal>

						{GROUPS.map((group) => (
							<Reveal
								as="article"
								key={group.id}
								className="legal-group"
								direction="left">
								<SectionHead
									eyebrow={t(group.eyebrow)}
									title={t(group.title)}
									id={group.id}
									flush
								/>

								<div className="legal-group__lead">
									{group.lead.map((line) => (
										<p key={line.key}>{t(line.key, line.vars)}</p>
									))}
								</div>

								<ul className="clause-grid">
									{group.clauses.map((clause) => (
										<li
											className="clause"
											key={clause.h}>
											<h3 className="clause__title">{t(clause.h)}</h3>

											{clause.items ?
												<ul className="clause__list">
													{clause.items.map((item) => (
														<li key={item.key}>{t(item.key, item.vars)}</li>
													))}
												</ul>
											:	<p className="clause__body">
													{t(clause.p ?? "", clause.vars)}
													{clause.after === "email" && <> {mail}.</>}
													{clause.after === "emailPhone" && (
														<>
															{" "}
															{mail} · {tel}.
														</>
													)}
												</p>
											}
										</li>
									))}
								</ul>
							</Reveal>
						))}

						{/* Copyright and credit close the page rather than sitting in the
						    disclaimer's card grid — a colophon, not a clause. */}
						<Reveal
							as="p"
							className="legal-colophon">
							{t("ui.legal.disclaimerRights", {
								year: site.year,
								name: site.legalName,
							})}{" "}
							<a
								href={site.credit.href}
								target="_blank"
								rel="noopener noreferrer">
								{site.credit.label}
							</a>
							.
						</Reveal>
					</div>
				</div>
			</section>

			<CTABand
				title={t("ui.legal.ctaTitle")}
				sub={t("ui.legal.ctaSub")}
			/>
		</PageShell>
	);
}
