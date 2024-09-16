// Data types
import { HBACServiceGroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "dn", "description"]);
const dateValues = new Set([]);

export function apiToHBACServiceGroup(
  apiRecord: Record<string, unknown>
): HBACServiceGroup {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<HBACServiceGroup>;
  return partialHBACSvcGrpToHBACSvcGrp(converted) as HBACServiceGroup;
}

export function partialHBACSvcGrpToHBACSvcGrp(
  partialHbacRule: Partial<HBACServiceGroup>
): HBACServiceGroup {
  return {
    ...createEmptyHBACGroupService(),
    ...partialHbacRule,
  };
}

// Get empty object initialized with default values
export function createEmptyHBACGroupService(): HBACServiceGroup {
  const hbacService: HBACServiceGroup = {
    description: "",
    cn: "",
    dn: "",
    member_hbacsvc: [],
  };

  return hbacService;
}
