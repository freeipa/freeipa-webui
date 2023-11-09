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
  return objectToPwPolicy(converted);
}

// Convert an partial PwPolicy object into a full PwPolicy object
// (initializing the undefined params with default empty values)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectToPwPolicy = (partialPwPolicy: any | Partial<PwPolicy>) => {
  const pwPolicy: PwPolicy = {
    attributelevelrights: partialPwPolicy.attributelevelrights || {},
    name: partialPwPolicy.cn || partialPwPolicy.name || "",
    dn: partialPwPolicy.dn || "",
    krbmaxpwdlife: partialPwPolicy.krbmaxpwdlife || "",
    krbminpwdlife: partialPwPolicy.krbminpwdlife || "",
    krbpwdfailurecountinterval:
      partialPwPolicy.krbpwdfailurecountinterval || "",
    krbpwdhistorylength: partialPwPolicy.krbpwdhistorylength || "",
    krbpwdlockoutduration: partialPwPolicy.krbpwdlockoutduration || "",
    krbpwdmaxfailure: partialPwPolicy.krbpwdmaxfailure || "",
    krbpwdmindiffchars: partialPwPolicy.krbpwdmindiffchars || "",
    krbpwdminlength: partialPwPolicy.krbpwdminlength || "",
    passwordgracelimit: partialPwPolicy.passwordgracelimit || "",
  };
  return pwPolicy;
};
