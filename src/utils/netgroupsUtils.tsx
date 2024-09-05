// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "nisdomainname",
  "description",
  "dn",
  "usercategory",
  "hostcategory",
]);
const dateValues = new Set([]);

export function apiToNetgroup(apiRecord: Record<string, unknown>): Netgroup {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Netgroup>;
  return partialNetgroupToNetgroup(converted) as Netgroup;
}

export function partialNetgroupToNetgroup(
  partialGroup: Partial<Netgroup>
): Netgroup {
  return {
    ...createEmptyNetgroup(),
    ...partialGroup,
  };
}

// Get empty User object initialized with default values
export function createEmptyNetgroup(): Netgroup {
  const group: Netgroup = {
    cn: "",
    nisdomainname: "",
    description: "",
    dn: "",
    usercategory: "",
    hostcategory: "",
    memberof_netgroup: [],
    member_netgroup: [],
    memberhost_host: [],
    memberhost_hostgroup: [],
    memberuser_user: [],
    memberuser_group: [],
    memberindirect_netgroup: [],
    externalhost: [],
  };

  return group;
}
