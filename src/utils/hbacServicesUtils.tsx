// Data types
import { HBACService } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "dn"]);
const dateValues = new Set([]);

export function apiToHBACService(
  apiRecord: Record<string, unknown>
): HBACService {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<HBACService>;
  return partialHBACServiceToHBACService(converted) as HBACService;
}

export function partialHBACServiceToHBACService(
  partialHbacRule: Partial<HBACService>
): HBACService {
  return {
    ...createEmptyHBACService(),
    ...partialHbacRule,
  };
}

// Get empty User object initialized with default values
export function createEmptyHBACService(): HBACService {
  const hbacService: HBACService = {
    description: "",
    cn: "",
    dn: "",
    memberof_hbacsvcgroup: [],
  };

  return hbacService;
}
