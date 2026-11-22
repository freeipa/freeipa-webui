export type IdoverridegroupAddArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverridegroupAddOptions = {
  description?: string;
  cn?: string;
  gidnumber?: number;
  setattr?: string;
  addattr?: string;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type IdoverridegroupDelArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverridegroupDelOptions = {
  continue: boolean;
  fallback_to_ldap?: boolean;
  version?: string;
};

export type IdoverridegroupFindArgs = {
  idviewcn: string;
  criteria?: string;
};

export type IdoverridegroupFindOptions = {
  ipaanchoruuid?: string;
  description?: string;
  cn?: string;
  gidnumber?: number;
  timelimit?: number;
  sizelimit?: number;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type IdoverridegroupModArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverridegroupModOptions = {
  description?: string;
  cn?: string;
  gidnumber?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  rename?: string;
};

export type IdoverridegroupShowArgs = {
  idviewcn: string;
  ipaanchoruuid: string;
};

export type IdoverridegroupShowOptions = {
  rights: boolean;
  fallback_to_ldap?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
