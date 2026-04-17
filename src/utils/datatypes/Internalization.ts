import { ErrorRPCResponse, ValidResponse } from "src/services/rpc";

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

export const TRANSLATIONS = {
  "texts.ajax.401.message": [],
  "texts.actions.apply": [],
  "texts.actions.automember_rebuild": [],
  "texts.actions.automember_rebuild_confirm": [],
  "texts.actions.automember_rebuild_success": [],
  "texts.actions.confirm": [],
  "texts.actions.delete_confirm": ["object"],
  "texts.actions.disable_confirm": ["object"],
  "texts.actions.enable_confirm": ["object"],
  "texts.actions.title": [],
  "texts.association.paging": ["start", "end", "total"],
  // Example errors:
  "texts.association.removed": ["error"],
  "texts.association.error-key": ["start", "end", "total"],
} as const;
