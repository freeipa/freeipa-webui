export type HostgroupAddArgs = {
  cn: string;
};

export type HostgroupAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostgroupAddMemberArgs = {
  cn: string;
};

export type HostgroupAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type HostgroupAddMemberManagerArgs = {
  cn: string;
};

export type HostgroupAddMemberManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type HostgroupDelArgs = {
  cn: string;
};

export type HostgroupDelOptions = {
  continue: boolean;
  version?: string;
};

export type HostgroupFindArgs = {
  criteria?: string;
};

export type HostgroupFindOptions = {
  cn?: string;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  host?: string;
  no_host?: string;
  hostgroup?: string;
  no_hostgroup?: string;
  in_hostgroup?: string;
  not_in_hostgroup?: string;
  in_netgroup?: string;
  not_in_netgroup?: string;
  in_hbacrule?: string;
  not_in_hbacrule?: string;
  in_sudorule?: string;
  not_in_sudorule?: string;
  membermanager_user?: string;
  not_membermanager_user?: string;
  membermanager_group?: string;
  not_membermanager_group?: string;
};

export type HostgroupModArgs = {
  cn: string;
};

export type HostgroupModOptions = {
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

export type HostgroupRemoveMemberArgs = {
  cn: string;
};

export type HostgroupRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type HostgroupRemoveMemberManagerArgs = {
  cn: string;
};

export type HostgroupRemoveMemberManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type HostgroupShowArgs = {
  cn: string;
};

export type HostgroupShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
