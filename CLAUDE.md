<!-- @format -->

# CLAUDE.md — BMGT Enterprise single-page site

## Task

Build a **one-page marketing site** for BMGT Enterprise Private Limited using **HTML and CSS only**. No JavaScript, no frameworks, no build step.

Deliverables:

```
index.html
styles.css
```

Inlining the CSS into a single `index.html` is acceptable if a one-file deliverable is preferred — ask before doing it.

## Skill to load first

Read **`/mnt/skills/public/frontend-design/SKILL.md`** before writing any markup.

That skill is the reason this file specifies a token system rather than leaving the look open. Follow its two-pass process — plan the tokens, critique the plan against the brief, then build. Note its warning about AI-default aesthetics; the palette below deliberately avoids the cream-and-terracotta and near-black-with-acid-accent clusters it calls out.

## Hard constraints

| Constraint    | Detail                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| No JavaScript | Rules out JS carousels, JS accordions, JS nav toggles. Design around it.                                 |
| Images        | Placeholder blocks only — see _Placeholder system_. No real photos.                                      |
| Paraphrasing  | **All copy in this file is already rewritten.** Use it as-is. Do not go re-copy the live site's wording. |
| Responsive    | Must work down to 360px.                                                                                 |
| Accessibility | Visible keyboard focus, semantic landmarks, real heading order, `prefers-reduced-motion` respected.      |

---

## Design direction

**Clean corporate — white, blue, airy.** Confident and quiet. This is a B2B industrial supplier selling to procurement managers and yard superintendents, not a consumer brand. Whitespace and typographic discipline do the work; nothing bounces or glows.

### Colour tokens

```css
--ink: #0b1f33; /* headings, deep navy */
--blue: #0e5c9e; /* primary brand blue, buttons, links */
--blue-deep: #072f52; /* dark section backgrounds */
--accent: #17a2b8; /* teal accent — rules, eyebrow text, hover */
--paper: #ffffff; /* page background */
--mist: #eff4f9; /* alternating section tint, placeholder fill */
--steel: #5a6b7c; /* body copy, muted text */
--line: #d9e2ec; /* hairlines, card borders */
```

Accent teal is used sparingly — eyebrows, underlines, hover states. Never for large fills.

### Type

Three roles, loaded from Google Fonts:

- **Display — Archivo** (600/700). Tight grotesque with a mechanical set. Headings, hero.
- **Body — Source Sans 3** (400/600). Long-form readability at small sizes.
- **Utility — IBM Plex Mono** (500, uppercase, letter-spaced ~0.12em). Eyebrows, section labels, spec captions.

Type scale (clamp for fluidity):

```
Hero h1     clamp(2.4rem, 5.5vw, 4.2rem)   / line-height 1.05 / -0.02em
Section h2  clamp(1.8rem, 3.2vw, 2.6rem)   / line-height 1.15
Card h3     1.15rem
Body        1.0625rem / line-height 1.65
Eyebrow     0.72rem   / mono / uppercase
```

### Signature element

**The spec-sheet motif.** Every section opens with a mono eyebrow formatted like a supplier catalogue reference, sitting above a 2px teal rule:

```
── SEC / 03 — PRODUCTS
```

Product and industry cards carry the same mono labelling in their corner. This is grounded in the subject — the vocabulary of part numbers, catalogue codes and datasheets that this client's customers actually work in — rather than being decorative numbering. Keep it consistent everywhere or drop it entirely; half-applied it looks like an accident.

Spend the boldness here. Everything else stays restrained.

### Motion

Minimal. CSS transitions on hover and focus only (150–200ms). No scroll-triggered reveals — they need JS to do well and read as filler without it. Wrap any transform in `@media (prefers-reduced-motion: no-preference)`.

---

## Page structure

The live site uses a 4-slide JS carousel. **Do not attempt a CSS-only carousel** — the checkbox/`:target` hacks are fragile and inaccessible. Instead:

1. Hero states one thesis.
2. The four industries become a static four-up index strip directly beneath it.

This keeps every message visible at once, which suits a supplier catalogue better than a rotator anyway.

```
┌────────────────────────────────────────────┐
│ TOP BAR   phone · email · location          │  slim, --blue-deep
├────────────────────────────────────────────┤
│ HEADER    [logo]        nav        [Quote]  │  sticky, white
├────────────────────────────────────────────┤
│ HERO      eyebrow / h1 / sub / 2 CTAs       │  white, generous space
│           ┌──────────────────────────────┐  │
│           │  placeholder 16:9            │  │
│           └──────────────────────────────┘  │
├────────────────────────────────────────────┤
│ INDUSTRY INDEX   4 across → 2 → 1           │  --mist
├────────────────────────────────────────────┤
│ ABOUT     [placeholder 4:3] │ copy          │  white, 2-col
├────────────────────────────────────────────┤
│ PRODUCTS  8 cards, 4 → 2 → 1                │  --mist
├────────────────────────────────────────────┤
│ CAPABILITIES  4 blocks, 2 → 1               │  --blue-deep, reversed
├────────────────────────────────────────────┤
│ BRANDS    11 logo placeholders, wrapping    │  white
├────────────────────────────────────────────┤
│ CTA BAND  headline + contact button          │  --blue
├────────────────────────────────────────────┤
│ FOOTER    4 columns → stacked                │  --ink
└────────────────────────────────────────────┘
```

Because it's a single page, all nav links are in-page anchors: `#about`, `#products`, `#industries`, `#brands`, `#contact`. Add `scroll-behavior: smooth` and `scroll-margin-top` on targets to clear the sticky header.

**Mobile nav without JS:** don't build a hamburger. Collapse the nav into a horizontally scrollable row of anchor links beneath the logo, or hide it and rely on the footer sitemap plus the persistent "Get a quote" button.

---

## Content

Everything below is paraphrased. Use it directly.

### Company

- **Name:** BMGT Enterprise Private Limited
- **Phone:** +91 96325 68371
- **Email:** sales@topexenterprise.com ⚠️ _still the old domain — replace with the BMGT address before building_
- **Address:** Patvardhan Layout, Vadgaon, Belagavi, Karnataka – 590005, India
- **Positioning:** Single-source supplier of industrial materials to shipbuilding, oil & gas, construction and general engineering.

### Hero

- Eyebrow: `── BELAGAVI, INDIA — SUPPLYING WORLDWIDE`
- H1: **Strong foundations. Supplied.**
- Sub: One source for the materials that shipyards, rigs, sites and workshops run on — sourced properly, priced sensibly, delivered when we said we would.
- Primary CTA: **Get a quote** → `#contact`
- Secondary CTA: **See what we supply** → `#products`

### Industry index (4 cards)

| Label                                               | Line                                                            |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `IND / 01` Shipbuilding, Ship Repair & Yacht Refits | Materials that keep yards moving and vessels seaworthy.         |
| `IND / 02` Construction                             | Supply that lifts the whole project, from groundwork to finish. |
| `IND / 03` Oil & Gas                                | Parts and materials that keep operations running without pause. |
| `IND / 04` General Engineering                      | Precision components and deep inventory for every build.        |

### About

- Eyebrow: `── SEC / 02 — ABOUT`
- H2: **Your global partner in industrial materials**
- Body:

> Shipbuilding, ship repair, oil and gas, and construction are unforgiving sectors, and BMGT Enterprise Private Limited was built for them. We source and supply industrial materials through a single point of contact, pairing modern sourcing with people who have worked these industries first-hand.
>
> Every order gets judged on three things: whether it moves fast, whether it holds up on site, and whether it was sourced responsibly. Our catalogue is broad and priced to keep project budgets intact — and we would rather keep a client for a decade than win one purchase order.

### Products (8 cards)

The first six appear as cards on the live homepage; the last two come from the site's navigation. Each card: mono label, placeholder image, name, one line, "View products" link (anchor to `#contact` since there are no inner pages).

| #   | Name                                     | Line                                                           |
| --- | ---------------------------------------- | -------------------------------------------------------------- |
| 01  | Electrical                               | Cabling, switchgear, panel components and site power.          |
| 02  | Valves & Pumps                           | Flow control and fluid handling across pressure classes.       |
| 03  | Mechanical                               | Bearings, couplings, fasteners, drives and transmission parts. |
| 04  | Shipbuilding, Ship Repair & Yacht Refits | Hull plate through to fit-out, sourced for marine service.     |
| 05  | Steel                                    | Plate, sections, bar and pipe in project quantities.           |
| 06  | Construction                             | Bulk raw materials through to finishing hardware.              |
| 07  | Granite                                  | Dimension stone and slab supply for build and finish work.     |
| 08  | Personal Protective Equipment (PPE)      | Site-rated protective gear for crews on and offshore.          |

> ⚠️ **Flag for review.** The one-line descriptions above are written from category names only — I could not retrieve the eight product pages. They are plausible and non-specific by design, but they are **not** taken from the client's own copy. Have BMGT confirm or replace each line before this goes live. Same applies to Granite and PPE, which do not appear on the homepage at all.

### Capabilities (4 blocks, dark section)

| Heading                                  | Copy                                                                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shipbuilding, Ship Repair & Yacht Refits | From hull plate to switchgear, we supply yards and repair docks worldwide. Less a vendor, more the crew handling your material chain.                     |
| Oil & Gas                                | Rigs, refineries and pipelines run on parts arriving on time. We handle sourcing, documentation and logistics so the schedule holds.                      |
| Construction                             | Whatever the site, whatever the stage — bulk raw material through to final fittings. Deliveries land when promised and someone always picks up the phone. |
| General Engineering                      | Bearings, couplings, valves and the precision parts around them. We work alongside your engineers rather than quoting off a list.                         |

> ⚠️ **Flag.** On the live site, the Oil & Gas blurb is an accidental duplicate of the maritime one — it talks about ships. I have written proper Oil & Gas copy above instead of paraphrasing the error. Worth telling the client their live page has this bug.

### Brands (11)

Legrand · Black+Decker · FAG · Schneider Electric · Makita · Polycab · SKF · Janatics · ELGi · Kirloskar · Siemens

Render as a wrapping grid of greyscale logo placeholders. Add a line beneath: _Authorised and stocked lines from established industrial manufacturers._

### CTA band

- H2: **Tell us what the project needs.**
- Sub: Send the spec, the quantity and the date. We will come back with how we would supply it.
- Button: **Contact us**

### Footer (4 columns)

1. **BMGT Enterprise Private Limited** — logo placeholder + _BMGT keeps expanding what it supplies and where it supplies it. This site is where we keep that current._
2. **Site** — Home, About, Products, Industries, Brands, Contact (in-page anchors)
3. **Contact** — phone, email, address, all as `tel:` / `mailto:` links
4. **Legal** — © 2026 BMGT Enterprise Private Limited. All rights reserved.

---

## Placeholder system

Every image is a `<div class="ph">`. One class, aspect ratio set per modifier, easy to swap for `<img>` later.

```css
.ph {
	background: var(--mist);
	border: 1px dashed var(--line);
	display: grid;
	place-items: center;
	font:
		500 0.72rem/1 "IBM Plex Mono",
		monospace;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--steel);
	border-radius: 4px;
}
.ph--16x9 {
	aspect-ratio: 16 / 9;
}
.ph--4x3 {
	aspect-ratio: 4 / 3;
}
.ph--card {
	aspect-ratio: 3 / 2;
}
.ph--logo {
	aspect-ratio: 5 / 2;
}
```

Markup carries the intended subject so it is obvious what belongs there:

```html
<div
	class="ph ph--card"
	role="img"
	aria-label="Steel plate stock">
	IMG · STEEL · 600×400
</div>
```

---

## Quality floor

- Semantic `<header> <main> <section> <footer>`; one `<h1>`.
- CSS Grid for card layouts, `clamp()` for fluid type, custom properties for all tokens.
- Watch selector specificity on section padding — the frontend-design skill flags this specifically. Use one `.section` padding rule and modifiers, not competing element and class selectors.
- `:focus-visible` outline in `--accent`, 2px, with offset. Never `outline: none`.
- Colour contrast ≥ 4.5:1 for body text. Check `--steel` on `--mist`.
- Breakpoints: 1024px, 768px, 480px.

## Known gaps

1. **Inner pages were not retrievable.** Only the homepage could be fetched; the site's ~15 sub-pages are not in any search index and could not be reached directly. Product and industry detail copy is therefore missing.
2. To close this: paste the inner-page content in directly, and this file can be extended with real per-category copy.
3. No real logo asset — the header and footer use `.ph--logo` placeholders.
4. Footer year on the live site reads 2026 in one place and 2024 in another. Standardise on 2026.
5. **Rename is text-only so far.** The company reads BMGT throughout, but two things still carry the old brand: the email address (`sales@topexenterprise.com`) and the phone number, which may or may not follow the company. Confirm both. If BMGT is a genuinely separate entity rather than a rebrand, the Belagavi address and the eleven brand affiliations need confirming too — those were scraped from the old site and should not be assumed to transfer.
