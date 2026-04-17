import { useState } from "react";
import { useGetInternalizationQuery } from "src/services/rpci18n";
import invariant from "tiny-invariant";
import {
  Translations,
  TranslationKey,
  TranslationReplaces,
} from "../utils/datatypes/Internalization";

// Source - https://stackoverflow.com/a/37510735
// Posted by Pranav C Balan, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-09, License - CC BY-SA 3.0
const getNestedProperty = (
  i18n: Translations,
  key: TranslationKey
): string | undefined => {
  // We know that the server response must be a string,
  // otherwise something is wrong with the server
  return key.split(".").reduce((o, k) => o && o[k], i18n) as unknown as
    | string
    | undefined;
};

export const useTranslation = () => {
  const [language, setLanguage] = useState(navigator.language);
  const { data, isLoading } = useGetInternalizationQuery({ language });

  if (isLoading) {
    return { t: () => "", language: "", setLanguage: () => {} };
  }

  invariant(data !== undefined, "Data is not defined");
  invariant(data.result !== null, "Error obtaining response");

  const t = <K extends TranslationKey>(
    key: K,
    ...args: TranslationReplaces<K> extends undefined
      ? []
      : [TranslationReplaces<K>]
  ): string => {
    let str = getNestedProperty(data.result, key);

    if (str === undefined) {
      console.warn(`Key ${key} doesn't exist in i18n`);
      return key;
    }

    const replaces = args[0];

    if (!replaces) {
      return str;
    }

    for (const [k, v] of Object.entries(replaces)) {
      invariant(str.includes(`\${${k}}`), `Key ${k} not in ${str}!`);

      str = str.replace(new RegExp(`\\\${${k}}`, "g"), String(v));
    }

    return str;
  };

  return { t, language, setLanguage };
};
