// Data types
import { Privilege } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<Privilege>,
  onElementChange: (element: Partial<Privilege>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Privilege);
  }

  return { ipaObject, recordOnChange };
};

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
