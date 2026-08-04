/**
 * Certifications shown on /legal.
 *
 * ⚠️ DELIBERATELY EMPTY — this is a gap, not an oversight.
 *
 * The predecessor site's `legal-certifications/` page exists in the mirror as a
 * zero-byte file: HTTrack created the folder but never downloaded the page, so
 * no certification names were recoverable. Nothing else in the mirror lists
 * them either.
 *
 * A certification claim is a legal representation about an audited third-party
 * assessment. Writing plausible ones ("ISO 9001", "ISO 45001") would be
 * inventing that representation on BMGT's behalf, so this array stays empty
 * until BMGT supplies the real list. The Legal page renders a visible TODO
 * while it is empty, and the section appears automatically once it is filled.
 *
 * TODO: get the certification list from BMGT — for each, the issuing body,
 * the certificate number and the expiry date.
 *
 * @format
 */

export type Certification = {
	name: string;
	/** Issuing body, e.g. the registrar that audited it. */
	issuer: string;
	/** Scope the certificate covers. */
	scope?: string;
	/** Certificate reference, if it is to be shown publicly. */
	reference?: string;
};

export const certifications: Certification[] = [];

export const certificationsNote =
	"Certification details are supplied on request with any quotation.";
