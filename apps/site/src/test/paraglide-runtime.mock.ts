export const locales = ["en", "de", "zh"] as const;

export const getLocale = () => "en";

export const setLocale = (_locale: (typeof locales)[number]) => {};
