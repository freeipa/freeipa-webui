import { Certificate, Principal, DateTime, DN } from "../types/primitives";
import { IpaUserAuthType } from "./config";

export type IpaNtHomeDirectoryDrive =
  | "A:"
  | "B:"
  | "C:"
  | "D:"
  | "E:"
  | "F:"
  | "G:"
  | "H:"
  | "I:"
  | "J:"
  | "K:"
  | "L:"
  | "M:"
  | "N:"
  | "O:"
  | "P:"
  | "Q:"
  | "R:"
  | "S:"
  | "T:"
  | "U:"
  | "V:"
  | "W:"
  | "X:"
  | "Y:"
  | "Z:";

export type UserAddArgs = {
  uid: string;
};

export type UserAddOptions = {
  givenname: string;
  sn: string;
  cn: string;
  displayname?: string;
  initials?: string;
  homedirectory?: string;
  gecos?: string;
  loginshell?: string;
  krbprincipalname?: Principal;
  krbprincipalexpiration?: DateTime;
  krbpasswordexpiration?: DateTime;
  mail?: string;
  userpassword?: string;
  random?: boolean;
  uidnumber?: number;
  gidnumber?: number;
  street?: string;
  l?: string;
  st?: string;
  postalcode?: string;
  telephonenumber?: string;
  mobile?: string;
  pager?: string;
  facsimiletelephonenumber?: string;
  ou?: string;
  title?: string;
  manager?: string;
  carlicense?: string;
  ipasshpubkey?: string;
  ipauserauthtype?: IpaUserAuthType;
  userclass?: string;
  ipatokenradiusconfiglink?: string;
  ipatokenradiususername?: string;
  ipaidpconfiglink?: string;
  ipaidpsub?: string;
  departmentnumber?: string;
  employeenumber?: string;
  employeetype?: string;
  preferredlanguage?: string;
  usercertificate?: Certificate;
  nsaccountlock?: boolean;
  setattr?: string;
  addattr?: string;
  noprivate: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserAddCertArgs = {
  uid: string;
};

export type UserAddCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type UserAddCertmapdataArgs = {
  uid: string;
  ipacertmapdata?: string;
};

export type UserAddCertmapdataOptions = {
  issuer?: DN;
  subject?: DN;
  certificate?: Certificate;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserAddManagerArgs = {
  uid: string;
};

export type UserAddManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
};

export type UserAddPasskeyArgs = {
  uid: string;
  ipapasskey: string;
};

export type UserAddPasskeyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserAddPrincipalArgs = {
  uid: string;
  krbprincipalname: Principal;
};

export type UserAddPrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserDelArgs = {
  uid: string;
};

export type UserDelOptions = {
  continue: boolean;
  preserve?: boolean;
  version?: string;
};

export type UserDisableArgs = {
  uid: string;
};

export type UserDisableOptions = {
  version?: string;
};

export type UserEnableArgs = {
  uid: string;
};

export type UserEnableOptions = {
  version?: string;
};

export type UserFindArgs = {
  criteria?: string;
};

export type UserFindOptions = {
  uid?: string;
  givenname?: string;
  sn?: string;
  cn?: string;
  displayname?: string;
  initials?: string;
  homedirectory?: string;
  gecos?: string;
  loginshell?: string;
  krbprincipalname?: Principal;
  krbprincipalexpiration?: DateTime;
  krbpasswordexpiration?: DateTime;
  mail?: string;
  userpassword?: string;
  uidnumber?: number;
  gidnumber?: number;
  street?: string;
  l?: string;
  st?: string;
  postalcode?: string;
  telephonenumber?: string;
  mobile?: string;
  pager?: string;
  facsimiletelephonenumber?: string;
  ou?: string;
  title?: string;
  manager?: string;
  carlicense?: string;
  ipauserauthtype?: IpaUserAuthType;
  userclass?: string;
  ipatokenradiusconfiglink?: string;
  ipatokenradiususername?: string;
  ipaidpconfiglink?: string;
  ipaidpsub?: string;
  departmentnumber?: string;
  employeenumber?: string;
  employeetype?: string;
  preferredlanguage?: string;
  usercertificate?: Certificate;
  ipantlogonscript?: string;
  ipantprofilepath?: string;
  ipanthomedirectory?: string;
  ipanthomedirectorydrive?: IpaNtHomeDirectoryDrive;
  nsaccountlock?: boolean;
  preserved?: boolean;
  timelimit?: number;
  sizelimit?: number;
  whoami: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  in_group?: string;
  not_in_group?: string;
  in_netgroup?: string;
  not_in_netgroup?: string;
  in_role?: string;
  not_in_role?: string;
  in_hbacrule?: string;
  not_in_hbacrule?: string;
  in_sudorule?: string;
  not_in_sudorule?: string;
  in_subid?: string;
  not_in_subid?: string;
};

export type UserModArgs = {
  uid: string;
};

export type UserModOptions = {
  givenname?: string;
  sn?: string;
  cn?: string;
  displayname?: string;
  initials?: string;
  homedirectory?: string;
  gecos?: string;
  loginshell?: string;
  krbprincipalname?: Principal;
  krbprincipalexpiration?: DateTime;
  krbpasswordexpiration?: DateTime;
  mail?: string;
  userpassword?: string;
  random?: boolean;
  uidnumber?: number;
  gidnumber?: number;
  street?: string;
  l?: string;
  st?: string;
  postalcode?: string;
  telephonenumber?: string;
  mobile?: string;
  pager?: string;
  facsimiletelephonenumber?: string;
  ou?: string;
  title?: string;
  manager?: string;
  carlicense?: string;
  ipasshpubkey?: string;
  ipauserauthtype?: IpaUserAuthType;
  userclass?: string;
  ipatokenradiusconfiglink?: string;
  ipatokenradiususername?: string;
  ipaidpconfiglink?: string;
  ipaidpsub?: string;
  departmentnumber?: string;
  employeenumber?: string;
  employeetype?: string;
  preferredlanguage?: string;
  usercertificate?: Certificate;
  ipantlogonscript?: string;
  ipantprofilepath?: string;
  ipanthomedirectory?: string;
  ipanthomedirectorydrive?: IpaNtHomeDirectoryDrive;
  nsaccountlock?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  rename?: string;
};

export type UserRemoveCertArgs = {
  uid: string;
};

export type UserRemoveCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type UserRemoveCertmapdataArgs = {
  uid: string;
  ipacertmapdata?: string;
};

export type UserRemoveCertmapdataOptions = {
  issuer?: DN;
  subject?: DN;
  certificate?: Certificate;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserRemoveManagerArgs = {
  uid: string;
};

export type UserRemoveManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
};

export type UserRemovePasskeyArgs = {
  uid: string;
  ipapasskey: string;
};

export type UserRemovePasskeyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserRemovePrincipalArgs = {
  uid: string;
  krbprincipalname: Principal;
};

export type UserRemovePrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserShowArgs = {
  uid: string;
};

export type UserShowOptions = {
  rights: boolean;
  out?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type UserStageArgs = {
  uid: string;
};

export type UserStageOptions = {
  continue: boolean;
  version?: string;
};

export type UserStatusArgs = {
  useruid: string;
};

export type UserStatusOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};

export type UserUndelArgs = {
  uid: string;
};

export type UserUndelOptions = {
  version?: string;
};

export type UserUnlockArgs = {
  uid: string;
};

export type UserUnlockOptions = {
  version?: string;
};
