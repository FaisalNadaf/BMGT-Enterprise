/** @format */

import {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "../lib/motion";
import { productPath } from "../data/products";
import { industryPath } from "../data/industries";
import { site } from "../data/site";
import { useProducts, useIndustries } from "../i18n/content";
import { stripLocale, useLocale } from "../i18n/useLocale";
import { Button } from "./Button";
import { MegaMenu } from "./MegaMenu";
import { NavIndicator } from "./NavIndicator";
import { LocaleToggle } from "./LocaleToggle";
import { Caret, Close } from "./Icons";

/* One plain top-level nav item. Renders the shared travelling indicator when
   it is the active route — see NavIndicator for why that is safe. */
function NavItem({
	to,
	label,
	end = false,
}: {
	to: string;
	label: string;
	end?: boolean;
}) {
	const { lp } = useLocale();
	return (
		<li className="nav__item">
			<NavLink
				to={lp(to)}
				end={end}
				className={({ isActive }) =>
					`nav__link${isActive ? " is-active" : ""}`
				}>
				{({ isActive }) => (
					<>
						{label}
						{isActive && <NavIndicator />}
					</>
				)}
			</NavLink>
		</li>
	);
}

/* ── brand lockup ─────────────────────────────────────────────────────────
   Reused in the header, the drawer and the footer. Pass chip on dark
   backgrounds: the mark's hull is #454B50 and vanishes against navy, so it
   sits on its own white tile there.
   The wordmark stays Latin in both locales — it is a trademark, and the
   confirmed carve-out keeps company and manufacturer names untranslated.
   ⚠️ CONFIRM: "BMGT" set in Archivo is a composition, not a supplied
   lockup. Replace if an official one exists. */
export function Brand({ chip = false }: { chip?: boolean }) {
	const mark = (
		<img
			className="brand__mark"
			src="/images/logo.png"
			alt=""
			width={256}
			height={235}
		/>
	);
	return (
		<>
			{chip ?
				<span className="brand__chip">{mark}</span>
			:	mark}
			<span
				className="brand__name latin"
				aria-hidden="true"
				dir="ltr">
				<span className="brand__word">BMGT</span>
			</span>
		</>
	);
}

/* One collapsible group in the drawer.
 *
 * Products and Industries carry 9 and 6 links; left open they made the drawer
 * a 20-item scroll where the useful top-level routes sat above the fold and
 * everything else was a hunt. Collapsed by default, except the group that
 * contains the current route — landing on a product page with Products shut
 * would hide where you already are.
 *
 * A real <button> with aria-expanded/aria-controls, so it is a disclosure to
 * assistive tech rather than a div that happens to toggle. */
function DrawerGroup({
	title,
	openByDefault,
	children,
}: {
	title: string;
	openByDefault: boolean;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(openByDefault);
	const reduced = useReducedMotion();
	const panelId = useId();

	return (
		<div className="drawer__group">
			<button
				type="button"
				className="drawer__toggle"
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((v) => !v)}>
				<span className="drawer__heading">{title}</span>
				<Caret className={`drawer__caret${open ? " is-open" : ""}`} />
			</button>

			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						id={panelId}
						className="drawer__panel"
						/* Height auto animates cleanly here because the panel is a plain
               stack; overflow hidden stops the links spilling mid-collapse. */
						initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
						animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
						exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
						transition={{ duration: reduced ? 0.12 : 0.24, ease: EASE }}>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/* ── mobile drawer ────────────────────────────────────────────────────────
   Keeps focus inside while open, restores it to the toggle on close, and
   locks page scroll behind the scrim. */
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
	const panelRef = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const { t, lp, isRTL } = useLocale();
	const location = useLocation();
	const products = useProducts();
	const industries = useIndustries();

	/* Strip the /en|/ar prefix before matching, or nothing ever matches. */
	const path = stripLocale(location.pathname);
	const section =
		path.startsWith("/products") ? "products"
		: path.startsWith("/industries") ? "industries"
		: null;

	useEffect(() => {
		if (!open) return;

		document.body.classList.add("is-locked");
		const previouslyFocused = document.activeElement as HTMLElement | null;
		panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
				return;
			}
			if (event.key !== "Tab") return;

			const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
				"a[href], button:not([disabled])",
			);
			if (!focusables || focusables.length === 0) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.classList.remove("is-locked");
			previouslyFocused?.focus();
		};
	}, [open, onClose]);

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		`drawer__link${isActive ? " is-active" : ""}`;

	/* CSS pins the panel to the inline-end edge, which is the left in Arabic —
     so it has to slide in from the left too. A hardcoded '100%' would fly it
     in from the opposite side of the screen it is anchored to. */
	const offscreen = isRTL ? "-100%" : "100%";

	/* Portalled to <body>, NOT rendered where it sits in the tree.
	   <Drawer /> is written inside </header>, and the header carries a
	   backdrop-filter. A backdrop-filter makes its element a containing block
	   for fixed-position descendants — so left in place, the scrim and the panel
	   resolve `position: fixed` against the ~84px header strip instead of the
	   viewport, and the whole menu collapses into the bar.

	   That was already latent whenever the header was scrolled; pinning the
	   filter on permanently (see components.css) would have made it constant.
	   The portal takes the drawer out of the header's containing block for good,
	   and it belongs at the body level anyway — it is a viewport overlay, not
	   part of the header's box. */
	return createPortal(
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						className="drawer-scrim"
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>
					<motion.div
						className="drawer"
						ref={panelRef}
						role="dialog"
						aria-modal="true"
						aria-label={t("ui.nav.menuLabel")}
						initial={reduced ? { opacity: 0 } : { x: offscreen }}
						animate={reduced ? { opacity: 1 } : { x: 0 }}
						exit={reduced ? { opacity: 0 } : { x: offscreen }}
						transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}>
						<div className="drawer__head">
							<span className="brand">
								<Brand />
							</span>
							<button
								type="button"
								className="drawer__close"
								onClick={onClose}>
								<Close />
								<span className="visually-hidden">{t("ui.nav.closeMenu")}</span>
							</button>
						</div>

						<nav
							className="drawer__body"
							aria-label={t("ui.nav.mobile")}>
							<div className="drawer__group drawer__group--flat">
								<p className="drawer__heading">{t("ui.drawer.menu")}</p>
								<NavLink
									to={lp("/")}
									className={linkClass}
									end
									onClick={onClose}>
									{t("ui.drawer.home")}
								</NavLink>
								<NavLink
									to={lp("/about")}
									className={linkClass}
									onClick={onClose}>
									{t("ui.drawer.about")}
								</NavLink>
								<NavLink
									to={lp("/brands")}
									className={linkClass}
									onClick={onClose}>
									{t("ui.drawer.brands")}
								</NavLink>
								<NavLink
									to={lp("/contact")}
									className={linkClass}
									onClick={onClose}>
									{t("ui.drawer.contact")}
								</NavLink>
								<NavLink
									to={lp("/legal")}
									className={linkClass}
									onClick={onClose}>
									{t("ui.drawer.legal")}
								</NavLink>
							</div>

							<DrawerGroup
								title={t("ui.drawer.products")}
								openByDefault={section === "products"}>
								<NavLink
									to={lp("/products")}
									className={linkClass}
									onClick={onClose}
									end>
									{t("ui.drawer.allProducts")}
								</NavLink>
								{products.map((product) => (
									<NavLink
										key={product.slug}
										to={lp(productPath(product))}
										className={linkClass}
										onClick={onClose}>
										{product.name}
									</NavLink>
								))}
							</DrawerGroup>

							<DrawerGroup
								title={t("ui.drawer.industries")}
								openByDefault={section === "industries"}>
								{industries.map((industry) => (
									<div key={industry.slug}>
										<NavLink
											to={lp(industryPath(industry))}
											className={linkClass}
											onClick={onClose}
											end>
											{industry.name}
										</NavLink>
										{industry.children?.map((child) => (
											<NavLink
												key={child.slug}
												to={lp(industryPath(child, industry))}
												className={({ isActive }) =>
													`${linkClass({ isActive })} drawer__link--child`
												}
												onClick={onClose}>
												{child.name}
											</NavLink>
										))}
									</div>
								))}
							</DrawerGroup>
						</nav>

						<div className="drawer__foot">
							{/* Language first: someone who opened the menu because the site
                  is in the wrong language should not have to scroll for it. */}
							<LocaleToggle block />
							<Button
								to={lp("/contact")}
								block>
								{t("ui.drawer.cta")}
							</Button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>,
		document.body,
	);
}

export function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const location = useLocation();
	const { t, lp } = useLocale();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	/* Stable identity. As an inline arrow this was a new function on every
     Header render, and Header re-renders whenever `scrolled` flips — which
     made the Drawer's lock/focus effect tear down and re-run mid-scroll,
     briefly releasing the body scroll lock and yanking focus back to the top
     of the drawer. */
	const closeDrawer = useCallback(() => setDrawerOpen(false), []);

	/* Any navigation closes the drawer, including a browser back button. */
	useEffect(() => setDrawerOpen(false), [location.pathname]);

	/* Rotating a phone or widening the window past the breakpoint hides the
     toggle that opened the drawer, so close it rather than leaving a panel
     with no way back to it. */
	useEffect(() => {
		if (!drawerOpen) return;
		const mq = window.matchMedia("(min-width: 1025px)");
		const onChange = () => mq.matches && setDrawerOpen(false);
		onChange();
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [drawerOpen]);

	return (
		<header
			className={`site-header${scrolled ? " site-header--scrolled" : " site-header--top"}`}>
			<div className="container site-header__inner">
				{/* Over the hero the mark needs its white chip — its hull is #454B50
            and disappears into navy. On the frosted bar the chip would be a
            white tile on white, so it comes off again. */}
				<Link
					className="brand"
					to={lp("/")}
					aria-label={t("ui.nav.homeAria", { name: site.name })}>
					<Brand chip={!scrolled} />
				</Link>

				<nav
					className="nav"
					aria-label={t("ui.nav.primary")}>
					<ul className="nav__list">
						<NavItem
							to="/"
							label={t("ui.nav.home")}
							end
						/>
						<NavItem
							to="/about"
							label={t("ui.nav.about")}
						/>
						<MegaMenu
							label={t("ui.nav.products")}
							kind="products"
							matchPrefix="/products"
							layout="rows"
						/>
						<MegaMenu
							label={t("ui.nav.industries")}
							kind="industries"
							matchPrefix="/industries"
							layout="stack"
						/>
						<NavItem
							to="/brands"
							label={t("ui.nav.brands")}
						/>
						{/* Contact sits in the nav as a destination; the CTA beside it is
                the action. They point at the same route but read differently,
                so the two no longer duplicate each other. */}
						<NavItem
							to="/contact"
							label={t("ui.nav.contact")}
						/>
					</ul>
				</nav>

				{/* Grouped so the header can be a three-column grid (brand · nav · end)
            and the nav sits centred on the header rather than centred in
            whatever space the brand and CTA leave over. */}
				<div className="site-header__end">
					<LocaleToggle />

					{/* Solid blue reads as a low-contrast blob against the navy hero, so
              over the hero the CTA goes white and swaps back on the frosted bar. */}
					<Button
						to={lp("/contact")}
						size="sm"
						variant={scrolled ? "primary" : "light"}
						className="site-header__cta">
						{t("ui.nav.cta")}
					</Button>

					<button
						type="button"
						className="nav-toggle"
						aria-expanded={drawerOpen}
						onClick={() => setDrawerOpen(true)}>
						<span
							className="nav-toggle__bars"
							aria-hidden="true">
							<span />
							<span />
							<span />
						</span>
						<span className="visually-hidden">{t("ui.nav.openMenu")}</span>
					</button>
				</div>
			</div>

			<Drawer
				open={drawerOpen}
				onClose={closeDrawer}
			/>
		</header>
	);
}
