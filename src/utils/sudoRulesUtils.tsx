// Data types
import { SudoRule } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "ipaenabledflag",
  "dn",
  "description",
  "sudoorder",
  "usercategory",
  "hostcategory",
  "cmdcategory",
  "ipasudorunasusercategory",
  "ipasudorunasgroupcategory",
  "hostmask",
  "ipasudorunasextusergroup",
  "ipasudorunasextgroup",
  "ipasudorunasextuser",
]);
const dateValues = new Set([]);

export function apiToSudoRule(apiRecord: Record<string, unknown>): SudoRule {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SudoRule>;
  return partialSudoRuleToSudoRule(converted) as SudoRule;
}

export function partialSudoRuleToSudoRule(
  partialSudoRule: Partial<SudoRule>
): SudoRule {
  return {
    ...createEmptySudoRule(),
    ...partialSudoRule,
  };
}

// Get empty User object initialized with default values
export function createEmptySudoRule(): SudoRule {
  const sudoRule: SudoRule = {
    cn: "",
    ipaenabledflag: true,
    dn: "",
    description: "",
    sudoorder: "",
    externaluser: [],
    usercategory: "",
    hostcategory: "",
    cmdcategory: "",
    memberuser_user: [],
    memberhost_host: [],
    memberhost_hostgroup: [],
    memberallowcmd_sudocmd: [],
    memberallowcmd_sudocmdgroup: [],
    memberdenycmd_sudocmd: [],
    memberdenycmd_sudocmdgroup: [],
    ipasudoopt: [],
    ipasudorunas_user: [],
    ipasudorunas_group: [],
    ipasudorunasgroup_group: [],
    ipasudorunasusercategory: "",
    ipasudorunasgroupcategory: "",
    hostmask: "",
    externalhost: [],
    ipasudorunasextusergroup: "",
    ipasudorunasextgroup: "",
    ipasudorunasextuser: "",
    memberuser_group: [],
  };

  return sudoRule;
}

// Parse the 'textInputField' data into expected data type
// - TODO: Adapt it to work with many types of data
export const asRecord = (
  element: Partial<SudoRule>,
  onElementChange: (element: Partial<SudoRule>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as SudoRule);
  }

  return { ipaObject, recordOnChange };
};
