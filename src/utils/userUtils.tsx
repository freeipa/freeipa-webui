// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

// Parse the 'textInputField' data into expected data type
// - TODO: Adapt it to work with many types of data
export const asRecord = (
  // property: string,
  element: Partial<User>,
  onElementChange: (element: Partial<User>) => void
  // metadata: Metadata
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as User);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "title",
  "givenname",
  "sn",
  "cn",
  "displayname",
  "initials",
  "gecos",
  "userclass",
  "uid",
  "uidnumber",
  "gidnumber",
  "loginshell",
  "homedirectory",
  "ipatokenradiusconfiglink",
  "ipatokenradiususername",
  "ipaidpconfiglink",
  "ipaidpsub",
  "krbmaxpwdlife",
  "krbminpwdlife",
  "krbpwdhistorylength",
  "krbpwdmindiffchars",
  "krbpwdminlength",
  "krbpwdmaxfailure",
  "krbpwdfailurecountinterval",
  "krbpwdlockoutduration",
  "passwordgracelimit",
  "krbmaxrenewableage",
  "krbmaxticketlife",
  "street",
  "l",
  "st",
  "postalcode",
  "ou",
  "manager",
  "employeenumber",
  "employeetype",
  "preferredlanguage",
  "ipantlogonscript",
  "ipantprofilepath",
  "ipanthomedirectory",
  "ipanthomedirectorydrive",
  "ipauniqueid",
  "ipantsecurityidentifier",
  "dn",
]);
const dateValues = new Set(["krbpasswordexpiration", "krbprincipalexpiration"]);

export function apiToUser(apiRecord: Record<string, unknown>) {
  return convertApiObj(apiRecord, simpleValues, dateValues) as Partial<User>;
}
