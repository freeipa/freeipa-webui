// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "description", "dn"]);
const dateValues = new Set([]);

export function apiToRole(apiRecord: Record<string, unknown>): Role {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Role>;
  return partialRoleToRole(converted) as Role;
}

export function partialRoleToRole(partialGroup: Partial<Role>): Role {
  return {
    ...createEmptyRole(),
    ...partialGroup,
  };
}

// Get empty User object initialized with default values
export function createEmptyRole(): Role {
  const group: Role = {
    cn: "",
    description: "",
    dn: "",
  };

  return group;
}
