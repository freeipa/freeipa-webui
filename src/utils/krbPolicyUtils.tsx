// Data types
import { KrbPolicy } from "./datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "src/utils/ipaObjectUtils";
import { parseAPIDatetime } from "./utils";

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
  return objectToKrbPolicy(converted);
}

// Convert an partial KrbPolicy object into a full KrbPolicy object
// (initializing the undefined params with default empty values)
export const objectToKrbPolicy = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partialKrbPolicy: any | Partial<KrbPolicy>
) => {
  const krbPolicy: KrbPolicy = {
    attributelevelrights: partialKrbPolicy.attributelevelrights || {},
    cn: partialKrbPolicy.cn || "",
    ipacertmapdata: partialKrbPolicy.ipacertmapdata || [],
    ipantsecurityidentifier: partialKrbPolicy.ipantsecurityidentifier || "",
    ipasshpubkey: partialKrbPolicy.ipasshpubkey || [],
    ipauniqueid: partialKrbPolicy.ipauniqueid || "",
    krbcanonicalname: partialKrbPolicy.krbcanonicalname || "",
    krbmaxrenewableage: partialKrbPolicy.krbmaxrenewableage || "",
    krbmaxticketlife: partialKrbPolicy.krbmaxticketlife || "",
    krbprincipalexpiration: parseAPIDatetime(
      partialKrbPolicy.krbprincipalexpiration
    ),
    krbprincipalname: partialKrbPolicy.krbprincipalname || [],
    loginshell: partialKrbPolicy.loginshell || "",
    mail: partialKrbPolicy.mail || [],
    memberof: partialKrbPolicy.memberof || "",
    mepmanagedentry: partialKrbPolicy.mepmanagedentry || "",
    usercertificatebinary: partialKrbPolicy.usercertificatebinary || [],
  };
  return krbPolicy;
};
