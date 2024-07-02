// Data types
import { PwPolicy } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set([
  "name",
  "dn",
  "krbmaxpwdlife",
  "krbminpwdlife",
  "krbpwdfailurecountinterval",
  "krbpwdhistorylength",
  "krbpwdlockoutduration",
  "krbpwdmaxfailure",
  "krbpwdmindiffchars",
  "krbpwdminlength",
  "passwordgracelimit",
]);
const dateValues = new Set([]);

export function apiToPwPolicy(apiRecord: Record<string, unknown>): PwPolicy {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<PwPolicy>;
  return partialPwPolicyToPwPolicy(converted);
}

export function partialPwPolicyToPwPolicy(partialPwPolicy: Partial<PwPolicy>) {
  return {
    ...createEmptyPwPolicy(),
    ...partialPwPolicy,
  };
}

export function createEmptyPwPolicy(): PwPolicy {
  return {
    attributelevelrights: {},
    cn: "",
    dn: "",
    krbmaxpwdlife: "",
    krbminpwdlife: "",
    krbpwdfailurecountinterval: "",
    krbpwdhistorylength: "",
    krbpwdlockoutduration: "",
    krbpwdmaxfailure: "",
    krbpwdmindiffchars: "",
    krbpwdminlength: "",
    passwordgracelimit: "",
  };
}
