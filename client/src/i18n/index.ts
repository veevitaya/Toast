import en from "../locales/en.json";
import th from "../locales/th.json";

export type Locale = "en" | "th";
export type TranslationKeys = typeof en;

const translations: Record<Locale, TranslationKeys> = { en, th };

const SUPPORTED_LOCALES: Locale[] = ["en", "th"];
const FALLBACK_LOCALE: Locale = "en";
const STORAGE_KEY = "toast_app_language";

export type LanguagePreference = "auto" | Locale;

export function getSupportedLocales(): Locale[] {
  return SUPPORTED_LOCALES;
}

export function detectDeviceLocale(): Locale {
  const browserLang = navigator.language || (navigator as any).userLanguage || "";
  const langCode = browserLang.split("-")[0].toLowerCase();
  if (SUPPORTED_LOCALES.includes(langCode as Locale)) {
    return langCode as Locale;
  }
  return FALLBACK_LOCALE;
}

export function getStoredPreference(): LanguagePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "auto" || SUPPORTED_LOCALES.includes(stored as Locale)) {
      return stored as LanguagePreference;
    }
  } catch {}
  return "auto";
}

export function setStoredPreference(pref: LanguagePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {}
}

export function resolveLocale(pref: LanguagePreference): Locale {
  if (pref === "auto") {
    return detectDeviceLocale();
  }
  return pref;
}

export function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

export function t(key: string, locale: Locale = "en", params?: Record<string, string | number>): string {
  let value = getNestedValue(translations[locale], key);
  if (value === undefined) {
    value = getNestedValue(translations[FALLBACK_LOCALE], key);
  }
  if (value === undefined) {
    return key;
  }
  if (params) {
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v)),
      value
    );
  }
  return value;
}

export function getLocalizedValue(
  obj: Record<string, any> | string | null | undefined,
  locale: Locale
): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (obj[locale]) return obj[locale];
  if (obj[FALLBACK_LOCALE]) return obj[FALLBACK_LOCALE];
  const firstValue = Object.values(obj).find((v) => typeof v === "string" && v.length > 0);
  return (firstValue as string) || "";
}
