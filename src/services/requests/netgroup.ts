export type NetgroupAddArgs = {
  cn: string;
};

export type NetgroupAddOptions = {
  description?: string;
  nisdomainname?: string;
  usercategory?: "all";
  hostcategory?: "all";
  externalhost?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type NetgroupAddMemberArgs = {
  cn: string;
};

export type NetgroupAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
  netgroup?: string;
};

export type NetgroupDelArgs = {
  cn: string;
};

export type NetgroupDelOptions = {
  continue: boolean;
  version?: string;
};

export type NetgroupFindArgs = {
  criteria?: string;
};

export type NetgroupFindOptions = {
  cn?: string;
  description?: string;
  nisdomainname?: string;
  ipauniqueid?: string;
  usercategory?: "all";
  hostcategory?: "all";
  externalhost?: string;
  timelimit?: number;
  sizelimit?: number;
  private: boolean;
  managed: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  netgroup?: string;
  no_netgroup?: string;
  user?: string;
  no_user?: string;
  group?: string;
  no_group?: string;
  host?: string;
  no_host?: string;
  hostgroup?: string;
  no_hostgroup?: string;
  in_netgroup?: string;
  not_in_netgroup?: string;
};

export type NetgroupModArgs = {
  cn: string;
};

export type NetgroupModOptions = {
  description?: string;
  nisdomainname?: string;
  usercategory?: "all";
  hostcategory?: "all";
  externalhost?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type NetgroupRemoveMemberArgs = {
  cn: string;
};

export type NetgroupRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
  netgroup?: string;
};

export type NetgroupShowArgs = {
  cn: string;
};

export type NetgroupShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
