import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";

export type EntryType = "inclusive" | "exclusive";

defineParameterType({
  name: "EntryType",
  regexp: /inclusive|exclusive/,
  transformer: (s: string) => s as EntryType,
});
