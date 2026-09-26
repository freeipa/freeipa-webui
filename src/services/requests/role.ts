export type RoleAddArgs = {
  cn: string;
};

export type RoleAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type RoleAddMemberArgs = {
  cn: string;
};

export type RoleAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
  service?: string;
  idoverrideuser?: string;
  sysaccount?: string;
};

export type RoleAddPrivilegeArgs = {
  cn: string;
};

export type RoleAddPrivilegeOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  privilege?: string;
};

export type RoleDelArgs = {
  cn: string;
};

export type RoleDelOptions = {
  continue: boolean;
  version?: string;
};

export type RoleFindArgs = {
  criteria?: string;
};

export type RoleFindOptions = {
  cn?: string;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type RoleModArgs = {
  cn: string;
};

export type RoleModOptions = {
  description?: string;
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

export type RoleRemoveMemberArgs = {
  cn: string;
};

export type RoleRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
  service?: string;
  idoverrideuser?: string;
  sysaccount?: string;
};

export type RoleRemovePrivilegeArgs = {
  cn: string;
};

export type RoleRemovePrivilegeOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  privilege?: string;
};

export type RoleShowArgs = {
  cn: string;
};

export type RoleShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
