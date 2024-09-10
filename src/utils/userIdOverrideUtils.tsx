// Data types
import { UserIDOverride } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "description",
  "dn",
  "gecos",
  "gidnumber",
  "homedirectory",
  "ipaanchoruuid",
  "ipaoriginaluid",
  "loginshell",
  "uid",
  "uidnumber",
]);

const dateValues = new Set([]);

export function apiToUserIDOverride(
  apiRecord: Record<string, unknown>
): UserIDOverride {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<UserIDOverride>;
  return partialUserIDOverrideToUserIDOverride(converted) as UserIDOverride;
}

export function partialUserIDOverrideToUserIDOverride(
  partialUserIDOverride: Partial<UserIDOverride>
): UserIDOverride {
  return {
    ...createEmptyUserIDOverride(),
    ...partialUserIDOverride,
  };
}

// Get empty User object initialized with default values
export function createEmptyUserIDOverride(): UserIDOverride {
  const userIdOverride: UserIDOverride = {
    description: "",
    gecos: "",
    gidnumber: "",
    homedirectory: "",
    ipaanchoruuid: "",
    ipaoriginaluid: "",
    ipasshpubkey: [],
    loginshell: "",
    memberof_group: [],
    memberofindirect_group: [],
    memberof_role: [],
    memberofindirect_role: [],
    objectclass: [],
    uid: "",
    uidnumber: "",
    usercertificate: [],
  };

  return userIdOverride;
}
