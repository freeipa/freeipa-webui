export type SudoruleAddArgs = {
  cn: string;
};

export type SudoruleAddOptions = {
  description?: string;
  ipaenabledflag?: boolean;
  usercategory?: "all";
  hostcategory?: "all";
  cmdcategory?: "all";
  ipasudorunasusercategory?: "all";
  ipasudorunasgroupcategory?: "all";
  sudoorder?: number;
  externaluser?: string;
  externalhost?: string;
  ipasudorunasextuser?: string;
  ipasudorunasextgroup?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SudoruleAddAllowCommandArgs = {
  cn: string;
};

export type SudoruleAddAllowCommandOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  sudocmd?: string;
  sudocmdgroup?: string;
};

export type SudoruleAddDenyCommandArgs = {
  cn: string;
};

export type SudoruleAddDenyCommandOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  sudocmd?: string;
  sudocmdgroup?: string;
};

export type SudoruleAddHostArgs = {
  cn: string;
};

export type SudoruleAddHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
  hostmask?: string;
};

export type SudoruleAddOptionArgs = {
  cn: string;
};

export type SudoruleAddOptionOptions = {
  ipasudoopt: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SudoruleAddRunasgroupArgs = {
  cn: string;
};

export type SudoruleAddRunasgroupOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  group?: string;
};

export type SudoruleAddRunasuserArgs = {
  cn: string;
};

export type SudoruleAddRunasuserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type SudoruleAddUserArgs = {
  cn: string;
};

export type SudoruleAddUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type SudoruleDelArgs = {
  cn: string;
};

export type SudoruleDelOptions = {
  continue: boolean;
  version?: string;
};

export type SudoruleDisableArgs = {
  cn: string;
};

export type SudoruleDisableOptions = {
  version?: string;
};

export type SudoruleEnableArgs = {
  cn: string;
};

export type SudoruleEnableOptions = {
  version?: string;
};

export type SudoruleFindArgs = {
  criteria?: string;
};

export type SudoruleFindOptions = {
  cn?: string;
  description?: string;
  ipaenabledflag?: boolean;
  usercategory?: "all";
  hostcategory?: "all";
  cmdcategory?: "all";
  ipasudorunasusercategory?: "all";
  ipasudorunasgroupcategory?: "all";
  sudoorder?: number;
  externaluser?: string;
  externalhost?: string;
  ipasudorunasextuser?: string;
  ipasudorunasextgroup?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type SudoruleModArgs = {
  cn: string;
};

export type SudoruleModOptions = {
  description?: string;
  ipaenabledflag?: boolean;
  usercategory?: "all";
  hostcategory?: "all";
  cmdcategory?: "all";
  ipasudorunasusercategory?: "all";
  ipasudorunasgroupcategory?: "all";
  sudoorder?: number;
  externaluser?: string;
  externalhost?: string;
  ipasudorunasextuser?: string;
  ipasudorunasextgroup?: string;
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

export type SudoruleRemoveAllowCommandArgs = {
  cn: string;
};

export type SudoruleRemoveAllowCommandOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  sudocmd?: string;
  sudocmdgroup?: string;
};

export type SudoruleRemoveDenyCommandArgs = {
  cn: string;
};

export type SudoruleRemoveDenyCommandOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  sudocmd?: string;
  sudocmdgroup?: string;
};

export type SudoruleRemoveHostArgs = {
  cn: string;
};

export type SudoruleRemoveHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
  hostmask?: string;
};

export type SudoruleRemoveOptionArgs = {
  cn: string;
};

export type SudoruleRemoveOptionOptions = {
  ipasudoopt: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SudoruleRemoveRunasgroupArgs = {
  cn: string;
};

export type SudoruleRemoveRunasgroupOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  group?: string;
};

export type SudoruleRemoveRunasuserArgs = {
  cn: string;
};

export type SudoruleRemoveRunasuserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type SudoruleRemoveUserArgs = {
  cn: string;
};

export type SudoruleRemoveUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type SudoruleShowArgs = {
  cn: string;
};

export type SudoruleShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
