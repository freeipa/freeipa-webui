// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj, convertToApiObj } from "src/utils/ipaObjectUtils";

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
const dateValues = new Set([
  "krbpasswordexpiration",
  "krbprincipalexpiration",
  "krblastadminunlock",
  "krblastfailedauth",
  "krblastpwdchange",
]);

export function apiToUser(apiRecord: Record<string, unknown>): User {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<User>;
  return partialUserToUser(converted) as User;
}

export function partialUserToUser(partialUser: Partial<User>): User {
  return {
    ...createEmptyUser(),
    ...partialUser,
  };
}

export function userToApi(user: Partial<User>): Record<string, unknown> {
  return convertToApiObj(user as Record<string, unknown>, dateValues);
}

// Get empty User object initialized with default values
export function createEmptyUser(): User {
  const user: User = {
    // identity
    title: "",
    givenname: "",
    sn: "",
    cn: "",
    displayname: "",
    initials: "",
    gecos: "",
    userclass: [],
    // account
    uid: "",
    has_password: false,
    krbpasswordexpiration: null,
    uidnumber: "",
    gidnumber: "",
    krbprincipalname: [],
    krbprincipalexpiration: null,
    loginshell: "",
    homedirectory: "",
    ipasshpubkey: [],
    usercertificate: [],
    ipacertmapdata: [],
    ipauserauthtype: [],
    ipatokenradiusconfiglink: "",
    ipatokenradiususername: "",
    ipaidpconfiglink: "",
    ipaidpsub: "",
    // pwpolicy
    krbmaxpwdlife: "",
    krbminpwdlife: "",
    krbpwdhistorylength: "",
    krbpwdmindiffchars: "",
    krbpwdminlength: "",
    krbpwdmaxfailure: "",
    krbpwdfailurecountinterval: "",
    krbpwdlockoutduration: "",
    passwordgracelimit: "",
    // krbtpolicy
    krbmaxrenewableage: "",
    krbmaxticketlife: "",
    // contact
    mail: [],
    telephonenumber: [],
    pager: [],
    mobile: [],
    facsimiletelephonenumber: [],
    // mailing
    street: "",
    l: "",
    st: "",
    postalcode: "",
    // employee
    ou: "",
    manager: "",
    departmentnumber: [],
    employeenumber: "",
    employeetype: "",
    preferredlanguage: "",
    // misc
    carlicense: [],
    // smb_attributes
    ipantlogonscript: "",
    ipantprofilepath: "",
    ipanthomedirectory: "",
    ipanthomedirectorydrive: "",
    // 'Member of' data
    memberof_group: [],
    memberof_netgroup: [],
    memberof_role: [],
    memberof_hbacrule: [],
    memberof_sudorule: [],
    memberof_subid: [],
    // Indirect membership
    memberofindirect_group: [],
    memberofindirect_netgroup: [],
    memberofindirect_role: [],
    memberofindirect_hbacrule: [],
    memberofindirect_sudorule: [],
    memberofindirect_subid: [],
    // 'Managed by' data
    mepmanagedentry: [],
    // other
    krbcanonicalname: [],
    nsaccountlock: false,
    objectclass: [],
    ipauniqueid: "",
    ipantsecurityidentifier: "",
    attributelevelrights: {},
    has_keytab: false,
    preserved: false,
    dn: "",
    sshpubkeyfp: [],
    krbextradata: "",
    krblastadminunlock: null,
    krblastfailedauth: null,
    krblastpwdchange: null,
    krbloginfailedcount: "",
  };

  return user;
}
