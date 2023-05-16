/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UserAuthTypes {
  password: boolean;
  radius: boolean;
  otp: boolean;
  pkinit: boolean;
  hardened: boolean;
  idp: boolean;
}

export interface User {
  // identity
  title: string;
  givenname: string;
  sn: string;
  displayname: string;
  initials: string;
  gecos: string;
  userclass: string;
  // account
  uid: string;
  has_password: boolean;
  krbpasswordexpiration: string;
  uidnumber: string;
  gidnumber: string;
  krbprincipalname: string;
  krbprincipalexpiration: string;
  loginshell: string;
  homedirectory: string;
  ipasshpubkey: string[]; // multivalue
  usercertificate: string[]; // multivalue
  ipacertmapdata: string[]; // multivalue
  ipauserauthtype: UserAuthTypes;
  ipatokenradiusconfiglink: string[];
  ipatokenradiususername: string;
  ipaidpconfiglink: string[];
  ipaidpsub: string;
  // pwpolicy
  krbmaxpwdlife: string;
  krbminpwdlife: string;
  krbpwdhistorylength: string;
  krbpwdmindiffchars: string;
  krbpwdminlength: string;
  krbpwdmaxfailure: string;
  krbpwdfailurecountinterval: string;
  krbpwdlockoutduration: string;
  passwordgracelimit: string;
  // krbtpolicy
  krbmaxrenewableage: string;
  krbmaxticketlife: string;
  // contact
  mail: string[]; // multivalue
  telephonenumber: string[]; // multivalue
  pager: string[]; // multivalue
  mobile: string[]; // multivalue
  facsimiletelephonenumber: string[]; // multivalue
  // mailing
  street: string;
  l: string;
  st: string;
  postalcode: string;
  // employee
  ou: string;
  manager: string[]; // multivalue
  departmentnumber: string[]; // multivalue
  employeenumber: string;
  employeetype: string;
  preferredlanguage: string;
  // misc
  carlicense: string[]; // multivalue
  // smb_attributes
  ipantlogonscript: string;
  ipantprofilepath: string;
  ipanthomedirectory: string;
  ipanthomedirectorydrive: string;
  // 'Member of' data
  memberof_group: string[]; // multivalue
  // 'Managed by' data
  mepmanagedentry: string[];
  // other
  cn: string;
  krbcanonicalname: string[];
  nsaccountlock: boolean; // status (Enable: False | Disabled: True)
  objectclass: any[];
  ipauniqueid: string;
  ipantsecurityidentifier: string;
  attributelevelrights: Record<string, unknown>; // Generic, any type of object
  has_keytab: boolean;
  preserved: boolean;
  dn: string;
}

export interface UserGroup {
  name: string;
  gid: string;
  description: string;
}

export interface Netgroup {
  name: string;
  description: string;
}

export interface Roles {
  name: string;
  description: string;
}

export interface HBACRules {
  name: string;
  status: string;
  description: string;
}

export interface SudoRules {
  name: string;
  status: string;
  description: string;
}

export interface Host {
  id: string;
  hostName: string;
  dnsZone: string;
  class: string;
  ipAddress: string;
  description: string;
  enrolled: boolean;
}

export interface HostGroup {
  name: string;
  description: string;
}

export interface Service {
  id: string;
  serviceType: string;
  host: string;
}

// Errors
export interface ErrorData {
  code: string;
  name: string;
  error: string;
}
