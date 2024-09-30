import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "./vi/translation.json";

export const LANGUAGE_VI = "vi";

export const translationsJson = {
    [LANGUAGE_VI]: {
        translation: vi,
    },
};

export const languages = Object.keys(translationsJson);
export const DEFAULT_LANGUAGE = LANGUAGE_VI;

export const i18n = i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: translationsJson,
        fallbackLng: "vi",
        lng: "vi",
        interpolation: {
            escapeValue: false,
        },
    });
