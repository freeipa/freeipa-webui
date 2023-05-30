/* eslint-disable @typescript-eslint/no-explicit-any */

export interface User {
  // identity
  title: string;
  givenname: string; // required
  sn: string; // required
  displayname: string;
  initials: string;
  gecos: string;
  userclass: string[]; // multivalue
  // account
  uid: string; // required
  has_password: boolean;
  krbpasswordexpiration: Date | string;
  uidnumber: string;
  gidnumber: string;
  krbprincipalname: string[]; // multivalue
  krbprincipalexpiration: Date | string;
  loginshell: string;
  homedirectory: string;
  ipasshpubkey: string[]; // multivalue
  usercertificate: string[]; // multivalue
  ipacertmapdata: string[]; // multivalue
  ipauserauthtype: string[]; // multivalue
  ipatokenradiusconfiglink: string;
  ipatokenradiususername: string;
  ipaidpconfiglink: string;
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
  manager: string;
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
  cn: string; // required
  krbcanonicalname: string[];
  nsaccountlock: boolean; // status (Enable: False | Disabled: True)
  objectclass: any[];
  ipauniqueid: string;
  ipantsecurityidentifier: string;
  attributelevelrights: Record<string, unknown>; // Generic, any type of object
  has_keytab: boolean;
  preserved: boolean;
  dn: string;
  sshpubkeyfp: string[]; // multivalue
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

// Certificates
export interface Certificate {
  certificate: string;
  issuer: string;
  ownerUser: string[];
  serialNumber: number;
  serialNumberHex: string;
  sha1Fingerprint: string;
  sha256Fingerprint: string;
  subject: string;
  validNotAfter: string;
  validNotBefore: string;
}

// RADIUS server
export interface RadiusServer {
  cn: string;
  dn: string;
  ipatokenradiusserver: string;
}
