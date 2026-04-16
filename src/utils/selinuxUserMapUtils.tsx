import { SELinuxUserMap } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "ipaselinuxuser",
  "seealso",
  "usercategory",
  "hostcategory",
  "description",
  "ipaenabledflag",
  "memberuser_user",
  "memberuser_group",
  "memberhost_host",
  "memberhost_hostgroup",
  "dn",
]);
const dateValues = new Set<string>([]);

export const apiToSelinuxUserMap = (
  apiRecord: Record<string, unknown>
): SELinuxUserMap => {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SELinuxUserMap>;
  return partialSelinuxUserMapToSelinuxUserMap(converted);
};

export const partialSelinuxUserMapToSelinuxUserMap = (
  partial: Partial<SELinuxUserMap>
): SELinuxUserMap => {
  return { ...createEmptySelinuxUserMap(), ...partial };
};

export const createEmptySelinuxUserMap = (): SELinuxUserMap => {
  return {
    cn: "",
    ipaselinuxuser: "",
    seealso: "",
    usercategory: "",
    hostcategory: "",
    description: "",
    ipaenabledflag: true,
    memberuser_user: "",
    memberuser_group: "",
    memberhost_host: "",
    memberhost_hostgroup: "",
    memberuser: [],
    memberhost: [],
    dn: "",
  };
};

export const asRecord = (
  element: Partial<SELinuxUserMap>,
  onElementChange: (element: Partial<SELinuxUserMap>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as SELinuxUserMap);
  }
  return { ipaObject, recordOnChange };
};
