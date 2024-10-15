// Data types
import {
  IDViewOverrideUser,
  IDViewOverrideGroup,
} from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleUserValues = new Set([
  "dn",
  "cn",
  "description",
  "homedirectory",
  "gecos",
  "gidnumber",
  "ipaanchoruuid",
  "ipaoriginaluid",
  "loginshell",
  "uid",
  "uidnumber",
]);

const simpleGroupValues = new Set([
  "cn",
  "description",
  "dn",
  "gidnumber",
  "ipaanchoruuid",
]);
const dateValues = new Set([]);

//
// ID Override Users
//
export function apiToOverrideUser(
  apiRecord: Record<string, unknown>
): IDViewOverrideUser {
  const converted = convertApiObj(
    apiRecord,
    simpleUserValues,
    dateValues
  ) as Partial<IDViewOverrideUser>;
  return partialOverrideUserToOverrideUser(converted) as IDViewOverrideUser;
}

export function partialOverrideUserToOverrideUser(
  partialOverride: Partial<IDViewOverrideUser>
): IDViewOverrideUser {
  return {
    ...createEmptyOverrideUser(),
    ...partialOverride,
  };
}

// Get empty User object initialized with default values
export function createEmptyOverrideUser(): IDViewOverrideUser {
  const override: IDViewOverrideUser = {
    dn: "",
    cn: "",
    description: "",
    homedirectory: "",
    gecos: "",
    gidnumber: "",
    ipaanchoruuid: "",
    ipaoriginaluid: "",
    ipasshpubkey: [],
    loginshell: "",
    uid: "",
    uidnumber: "",
    usercertificate: [],
    memberof_group: [],
    memberof_role: [],
    memberofindirect_group: [],
    memberofindirect_role: [],
  };

  return override;
}

//
// ID Override Groups
//
export function apiToOverrideGroup(
  apiRecord: Record<string, unknown>
): IDViewOverrideGroup {
  const converted = convertApiObj(
    apiRecord,
    simpleGroupValues,
    dateValues
  ) as Partial<IDViewOverrideGroup>;
  return partialOverrideGroupToOverrideGroup(converted) as IDViewOverrideGroup;
}

export function partialOverrideGroupToOverrideGroup(
  partialOverride: Partial<IDViewOverrideGroup>
): IDViewOverrideGroup {
  return {
    ...createEmptyOverrideGroup(),
    ...partialOverride,
  };
}

// Get empty User object initialized with default values
export function createEmptyOverrideGroup(): IDViewOverrideGroup {
  const override: IDViewOverrideGroup = {
    dn: "",
    cn: "",
    description: "",
    gidnumber: "",
    ipaanchoruuid: "",
    appliedtohosts: [],
  };

  return override;
}
