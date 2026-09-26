// Data types
import { SysAccount } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const asRecord = (
  element: Partial<SysAccount>,
  onElementChange: (element: Partial<SysAccount>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as SysAccount);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "uid",
  "description",
  "dn",
  "userpassword",
  "randompassword",
]);
const dateValues = new Set([]);

export function apiToSysAccount(
  apiRecord: Record<string, unknown>
): SysAccount {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<SysAccount>;

  return {
    ...createEmptySysAccount(),
    ...converted,
    memberof: (apiRecord.memberof as string[]) || [],
  };
}

export function partialSysAccountToSysAccount(
  partial: Partial<SysAccount>
): SysAccount {
  return {
    ...createEmptySysAccount(),
    ...partial,
  };
}

export function createEmptySysAccount(): SysAccount {
  return {
    uid: "",
    dn: "",
    description: "",
    userpassword: "",
    random: false,
    randompassword: "",
    nsaccountlock: false,
    memberof: [],
  };
}
