// Data types
import { HostGroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set(["cn", "description", "dn"]);
const dateValues = new Set([]);

export function apiToHostGroup(apiRecord: Record<string, unknown>): HostGroup {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<HostGroup>;
  return partialGroupToGroup(converted) as HostGroup;
}

export function partialGroupToGroup(
  partialGroup: Partial<HostGroup>
): HostGroup {
  return {
    ...createEmptyGroup(),
    ...partialGroup,
  };
}

// Get empty User object initialized with default values
export function createEmptyGroup(): HostGroup {
  const group: HostGroup = {
    dn: "",
    cn: "",
    description: "",
    membermanager_user: [],
    membermanager_group: [],
    member_host: [],
    member_hostgroup: [],
    memberindirect_host: [],
    memberindirect_hostgroup: [],
    memberof_hostgroup: [],
    memberof_netgroup: [],
    memberof_hbacrule: [],
    memberof_sudorule: [],
    memberofindirect_hostgroup: [],
    memberofindirect_hbacrule: [],
    memberofindirect_sudorule: [],
  };

  return group;
}
