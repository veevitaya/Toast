import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Locale, LanguagePreference } from "./index";
import {
  resolveLocale,
  getStoredPreference,
  setStoredPreference,
  t as translateFn,
  getLocalizedValue as getLocalizedFn,
} from "./index";

interface LanguageContextValue {
  locale: Locale;
  preference: LanguagePreference;
  setLanguage: (pref: LanguagePreference) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedValue: (obj: Record<string, any> | string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<LanguagePreference>(getStoredPreference);
  const locale = resolveLocale(preference);

  const setLanguage = useCallback((pref: LanguagePreference) => {
    setPreference(pref);
    setStoredPreference(pref);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translateFn(key, locale, params),
    [locale]
  );

  const getLocalizedValue = useCallback(
    (obj: Record<string, any> | string | null | undefined) => getLocalizedFn(obj, locale),
    [locale]
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, preference, setLanguage, t, getLocalizedValue }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
