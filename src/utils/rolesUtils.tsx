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

  return {
    ...createEmptyRole(),
    ...converted,
    member_user: (apiRecord.member_user as string[]) || [],
    member_group: (apiRecord.member_group as string[]) || [],
    member_host: (apiRecord.member_host as string[]) || [],
    member_hostgroup: (apiRecord.member_hostgroup as string[]) || [],
    member_service: (apiRecord.member_service as string[]) || [],
    member_idoverrideuser: (apiRecord.member_idoverrideuser as string[]) || [],
    member_sysaccount: (apiRecord.member_sysaccount as string[]) || [],
    memberof_privilege: (apiRecord.memberof_privilege as string[]) || [],
  };
}

export function partialRoleToRole(partialRole: Partial<Role>): Role {
  return {
    ...createEmptyRole(),
    ...partialRole,
  };
}

export function createEmptyRole(): Role {
  const role: Role = {
    cn: "",
    description: "",
    dn: "",
    member_user: [],
    member_group: [],
    member_host: [],
    member_hostgroup: [],
    member_service: [],
    member_idoverrideuser: [],
    member_sysaccount: [],
    memberof_privilege: [],
  };

  return role;
}
