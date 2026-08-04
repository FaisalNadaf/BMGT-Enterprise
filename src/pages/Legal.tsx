/** @format */

import { PageShell } from "../components/PageShell";
import { PageHero } from "../components/PageHero";
import { SectionHead } from "../components/SectionHead";
import { CTABand } from "../components/CTABand";
import { Reveal } from "../components/Reveal";
import { site } from "../data/site";
import { certifications } from "../data/certifications";
import { useLocale } from "../i18n/useLocale";

/**
 * ⚠️ PLACEHOLDER — every clause below is generic boilerplate written to give
 * the page structure and to show what needs covering. None of it has been
 * reviewed by a lawyer and none of it is specific to BMGT's jurisdiction,
 * data processors or contract terms. It must be replaced with the client's own
 * legal copy before the site goes live.
 */
export default function Legal() {
	const { t, lp } = useLocale();

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
				<div className="container">
					<Reveal>
						<nav
							className="legal-toc"
							aria-label={t("ui.legal.tocLabel")}>
							<a
								className="chip"
								href="#privacy">
								{t("ui.legal.tocPrivacy")}
							</a>
							<a
								className="chip"
								href="#terms">
								{t("ui.legal.tocTerms")}
							</a>
							<a
								className="chip"
								href="#disclaimer">
								{t("ui.legal.tocDisclaimer")}
							</a>
						</nav>
					</Reveal>

					{/* ── PRIVACY ───────────────────────────────────────────────────── */}
					<Reveal direction="left">
						<SectionHead
							eyebrow={t("ui.legal.privacyEyebrow")}
							title={t("ui.legal.privacyTitle")}
							id="privacy"
							flush
						/>
						<div className="prose prose--spaced">
							<p>{t("ui.legal.privacyP1")}</p>
							<h3>{t("ui.legal.privacyCollectedH")}</h3>
							<ul>
								<li>{t("ui.legal.privacyCollected1")}</li>
								<li>{t("ui.legal.privacyCollected2", { name: site.name })}</li>
							</ul>
							<h3>{t("ui.legal.privacyNotH")}</h3>
							<p>{t("ui.legal.privacyNotP")}</p>
							<h3>{t("ui.legal.privacyThirdH")}</h3>
							<p>{t("ui.legal.privacyThirdP")}</p>
							<h3>{t("ui.legal.privacyRetentionH")}</h3>
							<p>{t("ui.legal.privacyRetentionP")}</p>
							<h3>{t("ui.legal.privacyRightsH")}</h3>
							<p>
								{t("ui.legal.privacyRightsP")}{" "}
								<a
									className="latin"
									dir="ltr"
									href={`mailto:${site.emails.info}`}>
									{site.emails.info}
								</a>
								.
							</p>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ── TERMS ───────────────────────────────────────────────────────── */}
			<section className="section section--mist">
				<div className="container">
					<Reveal direction="left">
						<SectionHead
							eyebrow={t("ui.legal.termsEyebrow")}
							title={t("ui.legal.termsTitle")}
							id="terms"
							flush
						/>
						<div className="prose prose--spaced">
							<p>{t("ui.legal.termsP1")}</p>
							<h3>{t("ui.legal.termsContentH")}</h3>
							<p>{t("ui.legal.termsContentP", { name: site.legalName })}</p>
							<h3>{t("ui.legal.termsMarksH")}</h3>
							<p>{t("ui.legal.termsMarksP")}</p>
							<h3>{t("ui.legal.termsOrdersH")}</h3>
							<p>{t("ui.legal.termsOrdersP")}</p>
							<h3>{t("ui.legal.termsLinksH")}</h3>
							<p>{t("ui.legal.termsLinksP", { name: site.name })}</p>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ── CERTIFICATIONS ──────────────────────────────────────────────────
          Renders the list once BMGT supplies it. Until then it states the gap
          rather than showing plausible-looking certificate names — a
          certification claim is a representation about a third-party audit,
          and inventing one is not a copywriting decision. */}
			<section
				className="section section--mist"
				aria-labelledby="certifications">
				<div className="container">
					<Reveal direction="left">
						<SectionHead
							eyebrow={t("ui.legal.certsEyebrow")}
							title={t("ui.legal.certsTitle")}
							id="certifications"
							flush
						/>

						{certifications.length > 0 ?
							<>
								<ul className="cat-grid">
									{certifications.map((cert) => (
										<li key={cert.name}>
											{/* No media on these — the shared card just runs body-only. */}
											<article className="cat">
												<p className="cat__meta">{cert.issuer}</p>
												<span className="cat__body">
													<h3 className="cat__name">{cert.name}</h3>
													{cert.scope && (
														<p className="cat__line">{cert.scope}</p>
													)}
												</span>
											</article>
										</li>
									))}
								</ul>
								<p className="brands__note">{t("ui.legal.certsNote")}</p>
							</>
						:	<p className="todo">{t("ui.legal.certsEmpty")}</p>}
					</Reveal>
				</div>
			</section>

			{/* ── DISCLAIMER ──────────────────────────────────────────────────── */}
			<section className="section">
				<div className="container">
					<Reveal direction="left">
						<SectionHead
							eyebrow={t("ui.legal.disclaimerEyebrow")}
							title={t("ui.legal.disclaimerTitle")}
							id="disclaimer"
							flush
						/>
						<div className="prose prose--spaced">
							<p>{t("ui.legal.disclaimerP1")}</p>
							<p>{t("ui.legal.disclaimerP2", { name: site.legalName })}</p>
							<h3>{t("ui.legal.disclaimerContactH")}</h3>
							<p>
								{t("ui.legal.disclaimerContactP")}{" "}
								<a
									className="latin"
									dir="ltr"
									href={`mailto:${site.emails.info}`}>
									{site.emails.info}
								</a>{" "}
								<a
									className="latin"
									dir="ltr"
									href={site.phone.href}>
									{site.phone.display}
								</a>
								.
							</p>
							<p>
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
							</p>
						</div>
					</Reveal>
				</div>
			</section>

			<CTABand
				title={t("ui.legal.ctaTitle")}
				sub={t("ui.legal.ctaSub")}
			/>
		</PageShell>
	);
}
