export type HbacruleAddArgs = {
  cn: string;
};

export type HbacruleAddOptions = {
  accessruletype: "allow" | "deny";
  usercategory?: "all";
  hostcategory?: "all";
  sourcehostcategory?: "all";
  servicecategory?: "all";
  description?: string;
  ipaenabledflag?: boolean;
  externalhost?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HbacruleAddHostArgs = {
  cn: string;
};

export type HbacruleAddHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type HbacruleAddServiceArgs = {
  cn: string;
};

export type HbacruleAddServiceOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  hbacsvc?: string;
  hbacsvcgroup?: string;
};

export type HbacruleAddSourcehostArgs = {
  cn: string;
};

export type HbacruleAddSourcehostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type HbacruleAddUserArgs = {
  cn: string;
};

export type HbacruleAddUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type HbacruleDelArgs = {
  cn: string;
};

export type HbacruleDelOptions = {
  continue: boolean;
  version?: string;
};

export type HbacruleDisableArgs = {
  cn: string;
};

export type HbacruleDisableOptions = {
  version?: string;
};

export type HbacruleEnableArgs = {
  cn: string;
};

export type HbacruleEnableOptions = {
  version?: string;
};

export type HbacruleFindArgs = {
  criteria?: string;
};

export type HbacruleFindOptions = {
  cn?: string;
  accessruletype?: "allow" | "deny";
  usercategory?: "all";
  hostcategory?: "all";
  sourcehostcategory?: "all";
  servicecategory?: "all";
  description?: string;
  ipaenabledflag?: boolean;
  externalhost?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type HbacruleModArgs = {
  cn: string;
};

export type HbacruleModOptions = {
  accessruletype?: "allow" | "deny";
  usercategory?: "all";
  hostcategory?: "all";
  sourcehostcategory?: "all";
  servicecategory?: "all";
  description?: string;
  ipaenabledflag?: boolean;
  externalhost?: string;
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

export type HbacruleRemoveHostArgs = {
  cn: string;
};

export type HbacruleRemoveHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type HbacruleRemoveServiceArgs = {
  cn: string;
};

export type HbacruleRemoveServiceOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  hbacsvc?: string;
  hbacsvcgroup?: string;
};

export type HbacruleRemoveSourcehostArgs = {
  cn: string;
};

export type HbacruleRemoveSourcehostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type HbacruleRemoveUserArgs = {
  cn: string;
};

export type HbacruleRemoveUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type HbacruleShowArgs = {
  cn: string;
};

export type HbacruleShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
