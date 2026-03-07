export const locales = ["en", "de"] as const;

export const getLocale = () => "en";

export const setLocale = (_locale: (typeof locales)[number]) => {};
