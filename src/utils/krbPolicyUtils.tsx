// Data types
import { KrbPolicy } from "./datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "ipantsecurityidentifier",
  "ipauniqueid",
  "krbcanonicalname",
  "krbmaxrenewableage",
  "krbmaxticketlife",
  "loginshell",
  "memberof",
  "mepmanagedentry",
]);
const dateValues = new Set(["krbprincipalexpiration"]);

export function apiToKrbPolicy(apiRecord: Record<string, unknown>) {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<KrbPolicy>;
  return partialKrbPolicyToKrbPolicy(converted);
}

export function partialKrbPolicyToKrbPolicy(
  partialKrbPolicy: Partial<KrbPolicy>
) {
  return {
    ...createEmptyKrbPolicy(),
    ...partialKrbPolicy,
  };
}

export function createEmptyKrbPolicy(): KrbPolicy {
  return {
    attributelevelrights: {},
    cn: "",
    ipacertmapdata: [],
    ipantsecurityidentifier: "",
    ipasshpubkey: [],
    ipauniqueid: "",
    krbcanonicalname: "",
    krbmaxrenewableage: "",
    krbmaxticketlife: "",
    krbprincipalexpiration: null,
    krbprincipalname: [],
    loginshell: "",
    mail: [],
    memberof: "",
    mepmanagedentry: "",
    usercertificatebinary: [],
  };
}
