// Data types
import { Privilege } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "description"]);
const dateValues = new Set([]);

export function apiToPrivilege(apiRecord: Record<string, unknown>): Privilege {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Privilege>;
  return partialPrivilegeToPrivilege(converted) as Privilege;
}

export function partialPrivilegeToPrivilege(
  partialPrivilege: Partial<Privilege>
): Privilege {
  return {
    ...createEmptyPrivilege(),
    ...partialPrivilege,
  };
}

export function createEmptyPrivilege(): Privilege {
  const privilege: Privilege = {
    cn: "",
    description: "",
  };

  return privilege;
}
