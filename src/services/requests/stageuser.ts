import { Principal, DateTime, DN, Certificate } from "../types/primitives";
import { IpaUserAuthType } from "./config";
import { IpaNtHomeDirectoryDrive } from "./user";

export type StageuserActivateArgs = {
  uid: string;
};

export type StageuserActivateOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserAddArgs = {
  uid: string;
};

export type StageuserAddOptions = {
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
  setattr?: string;
  addattr?: string;
  from_delete?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserAddCertArgs = {
  uid: string;
};

export type StageuserAddCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type StageuserAddCertmapdataArgs = {
  uid: string;
  ipacertmapdata?: string;
};

export type StageuserAddCertmapdataOptions = {
  issuer?: DN;
  subject?: DN;
  certificate?: Certificate;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserAddManagerArgs = {
  uid: string;
};

export type StageuserAddManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
};

export type StageuserAddPasskeyArgs = {
  uid: string;
  ipapasskey: string;
};

export type StageuserAddPasskeyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserAddPrincipalArgs = {
  uid: string;
  krbprincipalname: Principal;
};

export type StageuserAddPrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserDelArgs = {
  uid: string;
};

export type StageuserDelOptions = {
  continue: boolean;
  version?: string;
};

export type StageuserFindArgs = {
  criteria?: string;
};

export type StageuserFindOptions = {
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
  timelimit?: number;
  sizelimit?: number;
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

export type StageuserModArgs = {
  uid: string;
};

export type StageuserModOptions = {
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

export type StageuserRemoveCertArgs = {
  uid: string;
};

export type StageuserRemoveCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type StageuserRemoveCertmapdataArgs = {
  uid: string;
  ipacertmapdata?: string;
};

export type StageuserRemoveCertmapdataOptions = {
  issuer?: DN;
  subject?: DN;
  certificate?: Certificate;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserRemoveManagerArgs = {
  uid: string;
};

export type StageuserRemoveManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
};

export type StageuserRemovePasskeyArgs = {
  uid: string;
  ipapasskey: string;
};

export type StageuserRemovePasskeyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserRemovePrincipalArgs = {
  uid: string;
  krbprincipalname: Principal;
};

export type StageuserRemovePrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type StageuserShowArgs = {
  uid: string;
};

export type StageuserShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
