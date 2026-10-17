import { DN } from "../types/primitives";

type IpaPermRight =
  | "read"
  | "search"
  | "compare"
  | "write"
  | "add"
  | "delete"
  | "all";

type IpaPermBindRuleType = "permission" | "all" | "anonymous" | "self";

export type PermissionAddArgs = {
  cn: string;
};

export type PermissionAddOptions = {
  ipapermright?: IpaPermRight;
  attrs?: string;
  ipapermbindruletype: IpaPermBindRuleType;
  ipapermlocation?: DN;
  extratargetfilter?: string;
  ipapermtargetfilter?: string;
  ipapermtarget?: DN;
  ipapermtargetto?: DN;
  ipapermtargetfrom?: DN;
  memberof?: string;
  targetgroup?: string;
  type?: string;
  permissions?: string;
  filter?: string;
  subtree?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type PermissionAddMemberArgs = {
  cn: string;
};

export type PermissionAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  privilege?: string;
};

export type PermissionAddNoaciArgs = {
  cn: string;
};

export type PermissionAddNoaciOptions = {
  ipapermissiontype: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type PermissionDelArgs = {
  cn: string;
};

export type PermissionDelOptions = {
  continue: boolean;
  force: boolean;
  version?: string;
};

export type PermissionFindArgs = {
  criteria?: string;
};

export type PermissionFindOptions = {
  cn?: string;
  ipapermright?: IpaPermRight;
  attrs?: string;
  ipapermincludedattr?: string;
  ipapermexcludedattr?: string;
  ipapermdefaultattr?: string;
  ipapermbindruletype?: IpaPermBindRuleType;
  ipapermlocation?: DN;
  extratargetfilter?: string;
  ipapermtargetfilter?: string;
  ipapermtarget?: DN;
  ipapermtargetto?: DN;
  ipapermtargetfrom?: DN;
  memberof?: string;
  targetgroup?: string;
  type?: string;
  permissions?: string;
  filter?: string;
  subtree?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type PermissionModArgs = {
  cn: string;
};

export type PermissionModOptions = {
  ipapermright?: IpaPermRight;
  attrs?: string;
  ipapermincludedattr?: string;
  ipapermexcludedattr?: string;
  ipapermbindruletype?: IpaPermBindRuleType;
  ipapermlocation?: DN;
  extratargetfilter?: string;
  ipapermtargetfilter?: string;
  ipapermtarget?: DN;
  ipapermtargetto?: DN;
  ipapermtargetfrom?: DN;
  memberof?: string;
  targetgroup?: string;
  type?: string;
  permissions?: string;
  filter?: string;
  subtree?: string;
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

export type PermissionRemoveMemberArgs = {
  cn: string;
};

export type PermissionRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  privilege?: string;
};

export type PermissionShowArgs = {
  cn: string;
};

export type PermissionShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
