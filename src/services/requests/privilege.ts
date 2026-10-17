export type PrivilegeAddArgs = {
  cn: string;
};

export type PrivilegeAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type PrivilegeAddMemberArgs = {
  cn: string;
};

export type PrivilegeAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  role?: string;
};

export type PrivilegeAddPermissionArgs = {
  cn: string;
};

export type PrivilegeAddPermissionOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  permission?: string;
};

export type PrivilegeDelArgs = {
  cn: string;
};

export type PrivilegeDelOptions = {
  continue: boolean;
  version?: string;
};

export type PrivilegeFindArgs = {
  criteria?: string;
};

export type PrivilegeFindOptions = {
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

export type PrivilegeModArgs = {
  cn: string;
};

export type PrivilegeModOptions = {
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

export type PrivilegeRemoveMemberArgs = {
  cn: string;
};

export type PrivilegeRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  role?: string;
};

export type PrivilegeRemovePermissionArgs = {
  cn: string;
};

export type PrivilegeRemovePermissionOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  permission?: string;
};

export type PrivilegeShowArgs = {
  cn: string;
};

export type PrivilegeShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
