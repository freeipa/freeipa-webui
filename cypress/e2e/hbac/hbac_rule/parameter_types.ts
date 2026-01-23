import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";

export type HbacRuleUserType = "user" | "group";

const hbacRuleUserTypes: HbacRuleUserType[] = ["user", "group"];

defineParameterType({
  name: "HbacRuleUserType",
  regexp: new RegExp(hbacRuleUserTypes.join("|")),
  transformer: (s: string) => s as HbacRuleUserType,
});
