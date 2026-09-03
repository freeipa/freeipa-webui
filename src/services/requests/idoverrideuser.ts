import { Certificate } from "../types/primitives";

export type IdoverrideuserAddArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverrideuserAddOptions = {
  description?: string;
  uid?: string;
  uidnumber?: number;
  gecos?: string;
  gidnumber?: number;
  homedirectory?: string;
  loginshell?: string;
  ipaoriginaluid?: string;
  ipasshpubkey?: string;
  usercertificate?: Certificate;
  setattr?: string;
  addattr?: string;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type IdoverrideuserAddCertArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverrideuserAddCertOptions = {
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type IdoverrideuserDelArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverrideuserDelOptions = {
  continue: boolean;
  fallback_to_ldap?: boolean;
  version?: string;
};

export type IdoverrideuserFindArgs = {
  idviewcn: string;
  criteria?: string;
};

export type IdoverrideuserFindOptions = {
  ipaanchoruuid?: string;
  description?: string;
  uid?: string;
  uidnumber?: number;
  gecos?: string;
  gidnumber?: number;
  homedirectory?: string;
  loginshell?: string;
  ipaoriginaluid?: string;
  timelimit?: number;
  sizelimit?: number;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type IdoverrideuserModArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverrideuserModOptions = {
  description?: string;
  uid?: string;
  uidnumber?: number;
  gecos?: string;
  gidnumber?: number;
  homedirectory?: string;
  loginshell?: string;
  ipaoriginaluid?: string;
  ipasshpubkey?: string;
  usercertificate?: Certificate;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  rename?: string;
};

export type IdoverrideuserRemoveCertArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverrideuserRemoveCertOptions = {
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type IdoverrideuserShowArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverrideuserShowOptions = {
  rights: boolean;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
