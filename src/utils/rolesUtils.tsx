// Data types
import { Role } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<Role>,
  onElementChange: (element: Partial<Role>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Role);
  }

  return { ipaObject, recordOnChange };
};

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
