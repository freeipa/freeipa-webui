// Data types
import { Permission } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<Permission>,
  onElementChange: (element: Partial<Permission>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Permission);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "cn",
  "ipapermbindruletype",
  "ipapermlocation",
  "ipapermtarget",
  "ipapermtargetto",
  "ipapermtargetfrom",
  "targetgroup",
  "type",
]);
const dateValues = new Set([]);

export function apiToPermission(
  apiRecord: Record<string, unknown>
): Permission {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Permission>;

  return {
    ...createEmptyPermission(),
    ...converted,
    ipapermright: (apiRecord.ipapermright as string[]) || [],
    attrs: (apiRecord.attrs as string[]) || [],
    ipapermincludedattrmultivalued:
      (apiRecord.ipapermincludedattrmultivalued as string[]) || [],
    ipapermexcludedattrmultivalued:
      (apiRecord.ipapermexcludedattrmultivalued as string[]) || [],
    extratargetfilter: (apiRecord.extratargetfilter as string[]) || [],
    ipapermtargetfilter: (apiRecord.ipapermtargetfilter as string[]) || [],
    memberof: (apiRecord.memberof as string[]) || [],
    member_privilege: (apiRecord.member_privilege as string[]) || [],
  };
}

export function partialPermissionToPermission(
  partialPermission: Partial<Permission>
): Permission {
  return {
    ...createEmptyPermission(),
    ...partialPermission,
  };
}

export function createEmptyPermission(): Permission {
  return {
    cn: "",
    ipapermright: [],
    attrs: [],
    ipapermincludedattrmultivalued: [],
    ipapermexcludedattrmultivalued: [],
    ipapermbindruletype: "",
    ipapermlocation: "",
    extratargetfilter: [],
    ipapermtargetfilter: [],
    ipapermtarget: "",
    ipapermtargetto: "",
    ipapermtargetfrom: "",
    memberof: [],
    member_privilege: [],
    targetgroup: "",
    type: "",
  };
}
