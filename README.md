<!-- @format -->

# BMGT Enterprise — React site

19-route marketing site for BMGT Enterprise, a Dubai-based single-source supplier of
industrial materials. React 18 + Vite + TypeScript, React Router v6, Framer Motion,
react-helmet-async. No backend, static build.

The HTML/CSS one-pager in the parent folder (`../index.html`, `../styles.css`) is the
source of truth for brand, copy and tokens; this app ports it and expands it. It has been
left untouched.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview
npm run typecheck
```

## Deploying

`dist/` is a static SPA and needs a fallback rewrite so deep routes like
`/industries/construction/granite` serve `index.html` instead of 404ing.

- **Netlify** — `public/_redirects` already does this.
- **Vercel** — add `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}` to `vercel.json`.
- **nginx** — `location / { try_files $uri $uri/ /index.html; }`
- **Apache** — a `.htaccess` with `FallbackResource /index.html`.

## Structure

```
src/
  App.tsx              router + page-transition shell; routes generated from data/
  data/                products.ts, industries.ts, brands.ts, site.ts
  components/          Header, MegaMenu, Footer, TopBar, SectionHead, Card,
                       ProductTile, Reveal, Button, SpecularEdge, BrandMarquee,
                       CTABand, PageShell, PageHero, Counter, Icons
  pages/               Home, About, Brands, Contact, Legal, NotFound,
                       ProductPage, IndustryPage
  styles/              tokens → base → components → pages → responsive
  lib/motion.ts        shared variants, easing, viewport rule
```

`data/products.ts` and `data/industries.ts` are the single source for cards, nav
dropdowns, footer sitemap **and** routes. Add a category to the array and its route,
dropdown entry, card and footer link all appear — they cannot drift apart.

## Catalogue provenance

The 67 `subProducts` line items were imported from the HTTrack mirror of the
predecessor site (`…\ttoop\topexenterprise.com`). What came from where:

| Field                       | Source                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `subProducts[].name`        | **Verbatim** from the mirror — these are catalogue facts                                                     |
| `subProducts[].line`        | **Written here**, in BMGT's voice. No grade, pressure class or certification is claimed                      |
| `subProducts[].image`       | Photograph pulled from the origin site, held locally under `public/images/catalogue/` — nothing is hotlinked |
| `intro` / `detail` / `lead` | Existing BMGT copy — the mirror's marketing prose was **not** reworded                                       |

Counts per category: electrical 12, valves & pumps 22, mechanical 9, shipbuilding 12,
steel 5, construction 5, granite 2, **PPE 0**.

Four things the mirror could **not** supply, all surfaced as visible TODOs rather than
filled with plausible substitutes:

1. **PPE line list** — its page carried nine photographs with no captions of any kind.
2. **Granite varieties** — 2 of 17 were named; the other 15 were unlabelled images.
3. **Certifications** — `legal-certifications/index.html` is a zero-byte file. A
   certification claim is a representation about a third-party audit, so
   `data/certifications.ts` ships empty rather than guessing at ISO numbers.
4. **Sub-product photography** — of 109 files in `wp-content/uploads/2024/06/`, 108 are
   zero-byte `.html` stubs; HTTrack recorded the URLs but never fetched the binaries.
   The origin still serves them, so **66 of 67** were pulled from there and are held
   locally in `public/images/catalogue/<category>/` (8.9 MB). One — "Megafiller, primer,
   paints, antifouling" — 404s at the origin in every size variant and renders a lettered
   fallback tile. ⚠️ **Image rights are unconfirmed**: these come from the client's own
   predecessor site, but several look like manufacturer or stock photography that the
   previous site may itself have used under licence.

`brands/index.html` is also empty, but the mirror's homepage carousel confirms exactly
the eleven brands already in `data/brands.ts` — no change was needed there.

### Industry photography

The four sector photographs in `public/images/industries/` are the one set of real
images the mirror _did_ hold, under `wp-content/uploads/slider/cache/`. Before this the
four industries reused product shots (marine, construction, valves, mechanical), which
mattered because the home page shows the same four sectors **twice** — the index strip
and the capabilities blocks. Those two sections must not carry the same photographs, so:

- **Index strip / About / sub-sector cards** → `industries[].image`, the real sector photos.
  These also now feed the industry `PageHero` and the Industries mega-menu.
- **Capabilities blocks** → the sector's _lead product category_ image, derived at render
  from `industry.products[0]`. Related content, different frame.

The two Construction children keep their product photos, which are correct for what
those sub-pages actually cover. Same ⚠️ rights caveat as the catalogue photography.

## Design system

Tokens are carried over verbatim from the demo's `styles.css`, including the
contrast-derived ones. Each is annotated with the ratio it was measured at; do not swap
one for a "close enough" hex without re-checking:

| Token           | Value     | Note                                            |
| --------------- | --------- | ----------------------------------------------- |
| `--ink`         | `#0B1F33` | headings                                        |
| `--blue`        | `#0E5C9E` | buttons, links — 6.90:1 on white                |
| `--blue-deep`   | `#072F52` | dark sections                                   |
| `--accent`      | `#17A2B8` | rules, borders, focus rings — **non-text only** |
| `--accent-ink`  | `#0C6F80` | teal _text_ on light, 5.83:1                    |
| `--accent-pale` | `#B7ECF3` | teal _text_ on dark, 10.6:1 on blue-deep        |
| `--mist`        | `#E4ECF5` | tint; clears 4.5:1 for `--steel` body copy      |
| `--steel`       | `#5A6B7C` | body copy                                       |
| `--steel-lt`    | `#A9BDD1` | body copy on dark                               |
| `--brand-blue`  | `#299AD2` | the mark's own blue — 3.16:1, decorative only   |

Styling is global CSS in load order (tokens → base → components → pages → responsive)
rather than Tailwind or CSS Modules. The demo's stylesheet is hand-tuned — measured scrim
alphas, clip-path geometry, contrast-derived colours — and re-expressing it in utilities
would have meant re-deriving all of it. Section padding is one `.section` rule plus
background modifiers, with no competing element-level rules.

## Motion

Framer Motion throughout, except the brand marquee, which stays a CSS keyframe
(an infinite transform is cheaper in CSS, and pause-on-hover is one `:hover` rule).

- Route change: fade + 12px slide, 320ms in / 200ms out, `AnimatePresence mode="wait"`.
- Scroll reveals: `Reveal` / `Stagger` / `StaggerItem` in `components/Reveal.tsx`,
  `whileInView` with `once: true`, children staggered 60–80ms.
- **Header is a fixed overlay, not a sticky bar.** At rest (`.site-header--top`) it is
  fully transparent with light text, sitting on the dark hero; past 12px of scroll it
  shrinks and becomes a frosted white bar with dark text
  (`rgba(255,255,255,0.82)` + `backdrop-filter: blur(14px) saturate(150%)`), with an
  `@supports not` fallback to a solid bar where `backdrop-filter` is unavailable —
  a translucent bar without the blur would let page content collide with the nav text.
  Two things swap with the state: the brand mark gains its white chip over the hero
  (its hull is `#454B50` and vanishes into navy) and loses it on the white bar, and the
  CTA runs `light` over the hero, `primary` on the bar.

  ⚠️ **Precondition:** every route must open on a dark band — the home hero, a
  `PageHero`, or the 404's `PageHero`. A route that opens on white would render the
  resting header invisible. `--header-h` is what page content clears; `.page-hero` and
  `.hero__body` both pad by it.

- **Active-route indicator** (`components/NavIndicator.tsx`) — one 2px underline shared
  across the whole nav via a global Framer `layoutId`, so it glides between items on a
  route change instead of blinking out and back in. Exactly one nav item is ever active,
  which is the precondition that makes a shared `layoutId` safe. Under reduced motion it
  renders as a plain span with no `layoutId` and simply appears in place.
- **Mega-menus** (`components/MegaMenu.tsx`) — two shapes off one component:
  Products is `layout="rows"` (8 categories, thumbnail left, 4 across × 2 down),
  Industries is `layout="stack"` (4 sectors, thumbnail on top, sub-pages listed
  beneath each card). The panel is positioned against `.site-header__inner`
  rather than its own `<li>`, so it spans the container width instead of
  overflowing the viewport from a trigger near the right edge; the `<li>` goes
  `position: static` for that to resolve upward. The panel stays a DOM child of
  the `<li>` so `mouseleave` does not fire crossing from trigger into panel.
  Closes on Escape (returning focus to the trigger), outside pointerdown, focus
  leaving the item, and route change. `ArrowDown` opens and focuses the first
  entry. Thumbnails lazy-load and zoom 6% on hover behind a reduced-motion gate.
  Each panel opens with a mono eyebrow + title strip in the same voice as
  the section heads, and its cells fade up staggered 35ms apart. Cell hover wipes a
  2px teal bar down the leading edge, lifts the cell 2px and slides in an arrow that
  is held out of the flow at rest so a two-line name does not reflow.
- **Specular buttons** (`components/SpecularEdge.tsx`, `ogl`) — the edge-highlight
  shader from React Bits' `<SpecularButton />`, lifted out of that component so it can
  sit inside whatever element `Button` renders. It is **not** used as a drop-in: 16 of
  the 18 buttons are navigation (router `Link`s and `mailto:`/`tel:` anchors) and the
  upstream component is a `<button>`, so swapping it in would have lost middle-click,
  open-in-new-tab, copy-link-address and the crawlable `href`. Here the canvas is an
  absolutely positioned child and `Link`/`a`/`button` each keep their own semantics.

  Three changes over upstream, all forced by running 5–7 of these per page:
  reduced motion skips WebGL entirely rather than shortening the loop; the renderer is
  created on first intersection and destroyed when the button scrolls out, so live
  contexts track what is on screen; and one shared `pointermove` listener serves every
  instance, with the rect cached (upstream calls `getBoundingClientRect()` per instance
  per pointer move — seven forced layouts per mouse move at this scale). It also bails
  cleanly where WebGL2 is missing, since the shaders are GLSL ES 3.00.

  `--btn-radius` and the `radius` prop passed in `Button.tsx` must stay equal — the
  shader traces that exact rounded-rect. Same for `.btn__fx { inset: -20px }` and `PAD`.

  Not applied to the hamburger, the drawer close button or the mega-menu triggers: those
  are icon/nav controls rather than CTAs, and giving them the treatment would add three
  more WebGL contexts per page for no gain.

- Hero has an 18%-of-scroll parallax and a slow settle out of a push-in.
- Spec-bar figures count up once, on entering view.

**Reduced motion** is handled twice over: `MotionConfig reducedMotion="user"` globally,
plus explicit `useReducedMotion()` checks in `Reveal`, `Counter`, `BrandMarquee`,
`PageHero`, `Button` and `Home` that skip the animation entirely rather than shortening
it. That matters — a reveal left mounted but unfired would sit at `opacity: 0` forever.
The marquee drops its duplicate row and becomes a plain horizontal scroller.

## What still needs the client

Search for `TODO` (visible teal boxes in the UI) and `CONFIRM` / `CLIENT REVIEW`
(comments in `src/data/*.ts`):

1. **Product scope lists** — written from category names, not BMGT's own product data.
2. **Industry pages** — no project references, approvals or certifications are claimed.
3. **Brand affiliations** — all eleven were carried over from the previous Belagavi site
   and should not be assumed to transfer to the Dubai entity.
4. **Contact form** — no backend. Submitting opens the visitor's mail client with the
   enquiry pre-filled. Wire to Formspree or the client's handler in `pages/Contact.tsx`.
5. **Legal page** — generic boilerplate, not reviewed by a lawyer, not checked against
   U.A.E. law.
6. **Registered name** — "Private Limited" is an India/UK suffix; a Dubai entity is
   normally LLC, FZ-LLC or FZE.
7. **Wordmark lockup** — "BMGT / ENTERPRISE" set in Archivo + IBM Plex Mono is a
   composition, not a supplied brand asset.
8. **Map** — placeholder, not an embed. A Google Maps iframe would be the only
   third-party tracker on the site.
9. **Opening hours** on `/contact` are a placeholder.
