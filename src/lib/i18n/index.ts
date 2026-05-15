import en from "./en.json";
import ru from "./ru.json";

export type Locale = "en" | "ru";
export const SUPPORTED_LOCALES: Locale[] = ["en", "ru"];
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries = { en, ru } as const;
export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function resolveLocale(input: string | undefined | null): Locale {
  if (!input) return DEFAULT_LOCALE;
  const lower = input.toLowerCase();
  if (lower.startsWith("ru")) return "ru";
  return "en";
}
