export type ConvertedToObjectType<T> = {
    [P in keyof T]: T[P] extends string ? string : ConvertedToObjectType<T[P]>;
};

export type TranslationJsonType = typeof import("./vi/translation.json");

export enum ELanguage {
    VI = "vi",
}
