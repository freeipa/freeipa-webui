import { useState } from "react";
import { useGetInternalizationQuery } from "src/services/rpci18n";
import invariant from "tiny-invariant";
import { Internalization } from "../utils/datatypes/Internalization";

// Converts nested type into outer.middle.nested notation
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & string];

// Source - https://stackoverflow.com/a/37510735
// Posted by Pranav C Balan, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-09, License - CC BY-SA 3.0
const getNestedProperty = (
  i18n: Internalization,
  key: NestedKeyOf<Internalization>
): string | undefined => {
  // We know that the server response must be a string,
  // otherwise something is wrong with the server
  return key.split(".").reduce((o, k) => o && o[k], i18n) as unknown as
    | string
    | undefined;
};

export const useInternalization = () => {
  const [language, setLanguage] = useState(navigator.language);
  const { data, isLoading } = useGetInternalizationQuery({ language });

  if (isLoading) {
    return { t: () => "", language: "", setLanguage: () => {} };
  }

  invariant(data !== undefined, "Data is not defined");
  invariant(data.result !== null, "Error obtaining response");

  const t = (
    key: NestedKeyOf<Internalization>,
    replaces?: Record<string, string>
  ): string => {
    const str = getNestedProperty(data.result, key);

    invariant(str !== undefined, `Key ${key} doesn't exist in i18n`);

    if (!replaces) {
      return str;
    }

    Object.entries(replaces).forEach(([k, v]) => {
      invariant(str.includes(k), `Key ${k} not in ${str}!`);

      str.replace(k, v);
    });

    return str;
  };

  return { t, language, setLanguage };
};
