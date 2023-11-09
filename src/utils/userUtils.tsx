// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "src/utils/ipaObjectUtils";
import { parseAPIDatetime } from "./utils";

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

export function apiToUser(apiRecord: Record<string, unknown>): User {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<User>;
  return objectToUser(converted) as User;
}

// Determines whether a given property name is a simple value or is it multivalue (Array)
//  - Returns: boolean
export const isSimpleValue = (propertyName) => {
  return simpleValues.has(propertyName);
};

// Covert an partial User object into a full User object
// (initializing the undefined params with default empty values)
export const objectToUser = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partialUser: Record<string, any> | Partial<User>,
  oldUserObject?: Partial<User> // Optional: To override the current object values
): User => {
  const user: User = {
    // identity
    title: partialUser.title || oldUserObject?.title || "",
    givenname: partialUser.givenname || oldUserObject?.givenname || "",
    sn: partialUser.sn || oldUserObject?.sn || "",
    cn: partialUser.cn || oldUserObject?.cn || "",
    displayname: partialUser.displayname || oldUserObject?.displayname || "",
    initials: partialUser.initials || oldUserObject?.initials || "",
    gecos: partialUser.gecos || oldUserObject?.gecos || "",
    userclass: partialUser.userclass || oldUserObject?.userclass || [],
    // account
    uid: partialUser.uid || oldUserObject?.uid || "",
    has_password:
      partialUser.has_password || oldUserObject?.has_password || false,
    krbpasswordexpiration: parseAPIDatetime(partialUser.krbpasswordexpiration),
    uidnumber: partialUser.uidnumber || oldUserObject?.uidnumber || "",
    gidnumber: partialUser.gidnumber || oldUserObject?.gidnumber || "",
    krbprincipalname:
      partialUser.krbprincipalname || oldUserObject?.krbprincipalname || [],
    krbprincipalexpiration: parseAPIDatetime(
      partialUser.krbprincipalexpiration
    ),
    loginshell: partialUser.loginshell || oldUserObject?.loginshell || "",
    homedirectory:
      partialUser.homedirectory || oldUserObject?.homedirectory || "",
    ipasshpubkey: partialUser.ipasshpubkey || oldUserObject?.ipasshpubkey || [],
    usercertificate:
      partialUser.usercertificate || oldUserObject?.usercertificate || [],
    ipacertmapdata:
      partialUser.ipacertmapdata || oldUserObject?.ipacertmapdata || [],
    ipauserauthtype:
      partialUser.ipauserauthtype || oldUserObject?.ipauserauthtype || [],
    ipatokenradiusconfiglink:
      partialUser.ipatokenradiusconfiglink ||
      oldUserObject?.ipatokenradiusconfiglink ||
      "",
    ipatokenradiususername:
      partialUser.ipatokenradiususername ||
      oldUserObject?.ipatokenradiususername ||
      "",
    ipaidpconfiglink:
      partialUser.ipaidpconfiglink || oldUserObject?.ipaidpconfiglink || "",
    ipaidpsub: partialUser.ipaidpsub || oldUserObject?.ipaidpsub || "",
    // pwpolicy
    krbmaxpwdlife:
      partialUser.krbmaxpwdlife || oldUserObject?.krbmaxpwdlife || "",
    krbminpwdlife:
      partialUser.krbminpwdlife || oldUserObject?.krbminpwdlife || "",
    krbpwdhistorylength:
      partialUser.krbpwdhistorylength ||
      oldUserObject?.krbpwdhistorylength ||
      "",
    krbpwdmindiffchars:
      partialUser.krbpwdmindiffchars || oldUserObject?.krbpwdmindiffchars || "",
    krbpwdminlength:
      partialUser.krbpwdminlength || oldUserObject?.krbpwdminlength || "",
    krbpwdmaxfailure:
      partialUser.krbpwdmaxfailure || oldUserObject?.krbpwdmaxfailure || "",
    krbpwdfailurecountinterval:
      partialUser.krbpwdfailurecountinterval ||
      oldUserObject?.krbpwdfailurecountinterval ||
      "",
    krbpwdlockoutduration:
      partialUser.krbpwdlockoutduration ||
      oldUserObject?.krbpwdlockoutduration ||
      "",
    passwordgracelimit:
      partialUser.passwordgracelimit || oldUserObject?.passwordgracelimit || "",
    // krbtpolicy
    krbmaxrenewableage:
      partialUser.krbmaxrenewableage || oldUserObject?.krbmaxrenewableage || "",
    krbmaxticketlife:
      partialUser.krbmaxticketlife || oldUserObject?.krbmaxticketlife || "",
    // contact
    mail: partialUser.mail || oldUserObject?.mail || [],
    telephonenumber:
      partialUser.telephonenumber || oldUserObject?.telephonenumber || [],
    pager: partialUser.pager || oldUserObject?.pager || [],
    mobile: partialUser.mobile || oldUserObject?.mobile || [],
    facsimiletelephonenumber:
      partialUser.facsimiletelephonenumber ||
      oldUserObject?.facsimiletelephonenumber ||
      [],
    // mailing
    street: partialUser.street || oldUserObject?.street || "",
    l: partialUser.l || oldUserObject?.l || "",
    st: partialUser.st || oldUserObject?.st || "",
    postalcode: partialUser.postalcode || oldUserObject?.postalcode || "",
    // employee
    ou: partialUser.ou || oldUserObject?.ou || "",
    manager: partialUser.manager || oldUserObject?.manager || "",
    departmentnumber:
      partialUser.departmentnumber || oldUserObject?.departmentnumber || [],
    employeenumber:
      partialUser.employeenumber || oldUserObject?.employeenumber || "",
    employeetype: partialUser.employeetype || oldUserObject?.employeetype || "",
    preferredlanguage:
      partialUser.preferredlanguage || oldUserObject?.preferredlanguage || "",
    // misc
    carlicense: partialUser.carlicense || oldUserObject?.carlicense || [],
    // smb_attributes
    ipantlogonscript:
      partialUser.ipantlogonscript || oldUserObject?.ipantlogonscript || "",
    ipantprofilepath:
      partialUser.ipantprofilepath || oldUserObject?.ipantprofilepath || "",
    ipanthomedirectory:
      partialUser.ipanthomedirectory || oldUserObject?.ipanthomedirectory || "",
    ipanthomedirectorydrive:
      partialUser.ipanthomedirectorydrive ||
      oldUserObject?.ipanthomedirectorydrive ||
      "",
    // 'Member of' data
    memberof_group:
      partialUser.memberof_group || oldUserObject?.memberof_group || [],
    // 'Managed by' data
    mepmanagedentry:
      partialUser.mepmanagedentry || oldUserObject?.mepmanagedentry || [],
    // other
    krbcanonicalname:
      partialUser.krbcanonicalname || oldUserObject?.krbcanonicalname || [],
    nsaccountlock:
      partialUser.nsaccountlock || oldUserObject?.nsaccountlock || true,
    objectclass: partialUser.objectclass || oldUserObject?.objectclass || [],
    ipauniqueid: partialUser.ipauniqueid || oldUserObject?.ipauniqueid || "",
    ipantsecurityidentifier:
      partialUser.ipantsecurityidentifier ||
      oldUserObject?.ipantsecurityidentifier ||
      "",
    attributelevelrights:
      partialUser.attributelevelrights ||
      oldUserObject?.attributelevelrights ||
      {},
    has_keytab: partialUser.has_keytab || oldUserObject?.has_keytab || false,
    preserved: partialUser.preserved || oldUserObject?.preserved || false,
    dn: partialUser.dn || oldUserObject?.dn || "",
    sshpubkeyfp: partialUser.sshpubkeyfp || oldUserObject?.sshpubkeyfp || [],
  };

  return user;
};
