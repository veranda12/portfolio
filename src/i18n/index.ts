import { en } from "./dictionaries/en";
import { id, type Dictionary } from "./dictionaries/id";
import type { Locale } from "./config";

export type { Dictionary };
export * from "./config";

const dictionaries: Record<Locale, Dictionary> = { id, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
