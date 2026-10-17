export type SelinuxusermapAddArgs = {
  cn: string;
};

export type SelinuxusermapAddOptions = {
  ipaselinuxuser: string;
  seealso?: string;
  usercategory?: "all";
  hostcategory?: "all";
  description?: string;
  ipaenabledflag?: boolean;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SelinuxusermapAddHostArgs = {
  cn: string;
};

export type SelinuxusermapAddHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type SelinuxusermapAddUserArgs = {
  cn: string;
};

export type SelinuxusermapAddUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type SelinuxusermapDelArgs = {
  cn: string;
};

export type SelinuxusermapDelOptions = {
  continue: boolean;
  version?: string;
};

export type SelinuxusermapDisableArgs = {
  cn: string;
};

export type SelinuxusermapDisableOptions = {
  version?: string;
};

export type SelinuxusermapEnableArgs = {
  cn: string;
};

export type SelinuxusermapEnableOptions = {
  version?: string;
};

export type SelinuxusermapFindArgs = {
  criteria?: string;
};

export type SelinuxusermapFindOptions = {
  cn?: string;
  ipaselinuxuser?: string;
  seealso?: string;
  usercategory?: "all";
  hostcategory?: "all";
  description?: string;
  ipaenabledflag?: boolean;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type SelinuxusermapModArgs = {
  cn: string;
};

export type SelinuxusermapModOptions = {
  ipaselinuxuser?: string;
  seealso?: string;
  usercategory?: "all";
  hostcategory?: "all";
  description?: string;
  ipaenabledflag?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SelinuxusermapRemoveHostArgs = {
  cn: string;
};

export type SelinuxusermapRemoveHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type SelinuxusermapRemoveUserArgs = {
  cn: string;
};

export type SelinuxusermapRemoveUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type SelinuxusermapShowArgs = {
  cn: string;
};

export type SelinuxusermapShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
