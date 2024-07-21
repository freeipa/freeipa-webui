// Data types
import { HBACRule } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "hostcategory",
  "servicecategory",
  "description",
  "usercategory",
  "cn",
  "ipaenabledflag",
  "dn",
]);
const dateValues = new Set([]);

export function apiToHBACRule(apiRecord: Record<string, unknown>): HBACRule {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<HBACRule>;
  return partialHBACRuleToHBACRule(converted) as HBACRule;
}

export function partialHBACRuleToHBACRule(
  partialHbacRule: Partial<HBACRule>
): HBACRule {
  return {
    ...createEmptyHBACRule(),
    ...partialHbacRule,
  };
}

// Get empty User object initialized with default values
export function createEmptyHBACRule(): HBACRule {
  const hbacRule: HBACRule = {
    hostcategory: "",
    servicecategory: "",
    description: "",
    usercategory: "",
    cn: "",
    ipaenabledflag: true,
    dn: "",
    memberhost_host: [],
    memberhost_hostgroup: [],
    memberuser_user: [],
    memberuser_group: [],
    memberservice_hbacsvc: [],
    memberservice_hbacsvcgroup: [],
  };

  return hbacRule;
}
