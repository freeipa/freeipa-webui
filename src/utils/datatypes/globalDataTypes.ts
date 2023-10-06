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

// Identity Provider server
export interface IDPServer {
  cn: string;
  dn: string;
  ipaidpauthendpoint: string;
  ipaidpclientid: string[];
  ipaidpdevauthendpoint: string[];
  ipaidpscope: string;
  ipaidpsub: string;
  ipaidptokenendpoint: string;
  ipaidpuserinfoendpoint: string[];
}

export interface Metadata {
  commands?: Record<string, unknown>;
  methods?: Record<string, unknown>;
  objects?: ObjectsMetadata;
}

export interface ObjectsMetadata {
  [key: string]: ObjectMetadata;
}

export interface ObjectMetadata {
  name: string;
  aciattrs?: string[];
  attribute_members?: { [key: string]: string[] };
  bindable?: boolean;
  can_have_permissions?: boolean;
  takes_params: ParamMetadata[];
  [key: string]: unknown; // TODO add missing properties
}

export interface ParamMetadata {
  alwaysask: boolean;
  attribute: boolean;
  autofill: boolean;
  class: string;
  cli_metavar: string;
  cli_name: string;
  confirm: boolean;
  deprecated_cli_aliases: string[];
  deprecated: boolean;
  doc: string;
  flags: string[];
  label: string;
  maxlength: number;
  multivalue: boolean;
  name: string;
  no_convert: boolean;
  noextrawhitespace: boolean;
  pattern_errmsg: string;
  pattern: string;
  primary_key: boolean;
  query: boolean;
  required: boolean;
  sortorder: number;
  type: string;
}

export interface RadiusServer {
  ipatokenradiusserver: string;
  cn: string;
  dn: string;
}

export interface Certificate {
  cacn: string;
  certificate_chain: string[];
  serial_number: string;
  certificate: string;
  subject: string;
  issuer: string;
  serial_number_hex: string;
  valid_not_before: string;
  valid_not_after: string;
  sha1_fingerprint: string;
  sha256_fingerprint: string;
  san_rfc822name: string[];
  owner_user: string[];
  revocation_reason: number;
  revoked: boolean;
  status: string;
}

export interface DN {
  c: string;
  cn: string;
  o: string;
  ou?: string;
}

export interface CertificateAuthority {
  cn: string;
  description: string;
  dn: string;
  ipacaid: string;
  ipacaissuerdn: string;
  ipacarandomserialnumberversion: string;
  ipacasubjectdn: string;
}
