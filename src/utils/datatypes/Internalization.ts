import { ErrorRPCResponse, ValidResponse } from "src/services/rpc";
import { TRANSLATIONS } from "./InternationalizationKeys";

export type InternalizationResponse =
  | ErrorRPCResponse
  | ValidResponse<Translations>;

export type Translations = {
  [K in TranslationKey]: string;
};

export type TranslationKey = keyof typeof TRANSLATIONS;

export type TranslationReplaces<K extends TranslationKey> =
  (typeof TRANSLATIONS)[K] extends readonly []
    ? undefined
    : {
        [P in (typeof TRANSLATIONS)[K][number]]: string;
      };
