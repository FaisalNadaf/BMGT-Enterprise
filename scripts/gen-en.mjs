/**
 * Build the `content` half of en.json straight from src/data/*.ts.
 *
 * The data modules stay the single source of truth for English; this reads
 * them through esbuild rather than regex-parsing TypeScript, so a change to
 * the shape of the data cannot silently produce half a dictionary.
 *
 *   node scripts/gen-en.mjs
 *
 * @format
 */

import { build } from "esbuild";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");

const slugKey = (name) =>
	name
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/\//g, " ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const dir = mkdtempSync(join(tmpdir(), "BMGT-i18n-"));
const out = join(dir, "data.mjs");

await build({
	entryPoints: [join(ROOT, "src/data/index-for-i18n.ts")],
	bundle: true,
	format: "esm",
	platform: "node",
	outfile: out,
	logLevel: "error",
});

const { products, industries, brands, brandsNote, site } = await import(
	pathToFileURL(out).href
);

const content = { products: {}, industries: {}, brands: {}, site: {} };

for (const p of products) {
	const entry = {
		name: p.name,
		shortName: p.shortName,
		blurb: p.blurb,
		intro: p.intro,
		detail: p.detail,
		capabilities: p.capabilities,
		sub: {},
	};
	for (const s of p.subProducts)
		entry.sub[slugKey(s.name)] = { name: s.name, line: s.line };
	content.products[p.slug] = entry;
}

const industryEntry = (i) => ({
	name: i.name,
	shortName: i.shortName,
	blurb: i.blurb,
	lead: i.lead,
	detail: i.detail,
	points: i.points,
	why: Object.fromEntries(
		i.why.map((w, n) => [String(n), { title: w.title, body: w.body }]),
	),
});
for (const i of industries) {
	content.industries[i.slug] = industryEntry(i);
	for (const c of i.children ?? [])
		content.industries[c.slug] = industryEntry(c);
}

/* Brand names are proper nouns and stay Latin (confirmed carve-out); only the
   category label beside each one is translatable. */
for (const b of brands) content.brands[slugKey(b.name)] = { field: b.field };
content.brands.note = brandsNote;

content.site = {
	tagline: site.tagline,
	description: site.description,
	addressShort: site.address.short,
	addressLines: site.address.lines,
};

const target = join(ROOT, "src/i18n/locales/en.json");
const existing = JSON.parse(readFileSync(target, "utf8"));
existing.content = content;
writeFileSync(target, JSON.stringify(existing, null, 2) + "\n");

rmSync(dir, { recursive: true, force: true });

const count = (o) =>
	typeof o === "string" ? 1 : (
		Object.values(o).reduce((n, v) => n + count(v), 0)
	);
console.log("content keys written:", count(content));
