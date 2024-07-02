// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "gidnumber",
  "description",
  "dn",
  "objectclass",
  "member",
]);

const dateValues = new Set([]);

export function apiToGroup(apiRecord: Record<string, unknown>): UserGroup {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<UserGroup>;
  return partialGroupToGroup(converted) as UserGroup;
}

export function partialGroupToGroup(
  partialGroup: Partial<UserGroup>
): UserGroup {
  return {
    ...createEmptyGroup(),
    ...partialGroup,
  };
}

// Get empty User object initialized with default values
export function createEmptyGroup(): UserGroup {
  const group: UserGroup = {
    cn: "",
    gidnumber: "",
    description: "",
    dn: "",
    objectclass: [],
    member: [],
  };

  return group;
}
