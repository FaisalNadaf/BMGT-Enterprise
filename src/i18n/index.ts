/** @format */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

/**
 * i18next setup.
 *
 * The locale is owned by the URL (`/en/...`, `/ar/...`) — see LocaleLayout in
 * App.tsx. A stored preference only decides where a bare `/` sends you; once
 * you are on a prefixed route that prefix wins, so a shared link always opens
 * in the language it was written in.
 *
 * No language detector plugin: detection here is one cheap read of
 * localStorage, and the plugin's own ordering would fight the router for
 * ownership of the active locale.
 */

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const STORAGE_KEY = "BMGT.locale";

export const isLocale = (value: unknown): value is Locale =>
	typeof value === "string" && (LOCALES as readonly string[]).includes(value);

export const DIR: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };

/** Native name, for the toggle. Each is set in its own language. */
export const LOCALE_LABEL: Record<Locale, string> = {
	en: "English",
	ar: "العربية",
};

/** Stored choice, else the browser's, else English. */
export function detectLocale(): Locale {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isLocale(stored)) return stored;
	} catch {
		/* Private mode / storage disabled — fall through to the browser. */
	}
	const nav = typeof navigator !== "undefined" ? navigator.language : "";
	return nav.toLowerCase().startsWith("ar") ? "ar" : DEFAULT_LOCALE;
}

export function storeLocale(locale: Locale) {
	try {
		localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		/* Not fatal — the URL still carries the locale. */
	}
}

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		ar: { translation: ar },
	},
	lng: DEFAULT_LOCALE,
	fallbackLng: DEFAULT_LOCALE,
	supportedLngs: LOCALES as unknown as string[],
	/* Keys are dotted paths; ':' would split 'a:b' into namespace + key. */
	nsSeparator: false,
	interpolation: {
		/* React escapes for us; double-escaping mangles &, ' and — in the copy. */
		escapeValue: false,
	},
	returnNull: false,
});

export default i18n;
