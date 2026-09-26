import { Principal } from "../types/primitives";

export type GroupAddArgs = {
  cn: string;
};

export type GroupAddOptions = {
  description?: string;
  gidnumber?: number;
  setattr?: string;
  addattr?: string;
  nonposix: boolean;
  external: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type GroupAddMemberArgs = {
  cn: string;
};

export type GroupAddMemberOptions = {
  ipaexternalmember?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  service?: string;
  idoverrideuser?: string;
};

export type GroupAddMemberManagerArgs = {
  cn: string;
};

export type GroupAddMemberManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type GroupDelArgs = {
  cn: string;
};

export type GroupDelOptions = {
  continue: boolean;
  version?: string;
};

export type GroupDetachArgs = {
  cn: string;
};

export type GroupDetachOptions = {
  version?: string;
};

export type GroupFindArgs = {
  criteria?: string;
};

export type GroupFindOptions = {
  cn?: string;
  description?: string;
  gidnumber?: number;
  timelimit?: number;
  sizelimit?: number;
  private: boolean;
  posix: boolean;
  external: boolean;
  nonposix: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  user?: string;
  no_user?: string;
  group?: string;
  no_group?: string;
  service?: Principal;
  no_service?: Principal;
  idoverrideuser?: string;
  no_idoverrideuser?: string;
  in_group?: string;
  not_in_group?: string;
  in_netgroup?: string;
  not_in_netgroup?: string;
  in_role?: string;
  not_in_role?: string;
  in_hbacrule?: string;
  not_in_hbacrule?: string;
  in_sudorule?: string;
  not_in_sudorule?: string;
  membermanager_user?: string;
  not_membermanager_user?: string;
  membermanager_group?: string;
  not_membermanager_group?: string;
};

export type GroupModArgs = {
  cn: string;
};

export type GroupModOptions = {
  description?: string;
  gidnumber?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  posix: boolean;
  external: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  rename?: string;
};

export type GroupRemoveMemberArgs = {
  cn: string;
};

export type GroupRemoveMemberOptions = {
  ipaexternalmember?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  service?: string;
  idoverrideuser?: string;
};

export type GroupRemoveMemberManagerArgs = {
  cn: string;
};

export type GroupRemoveMemberManagerOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type GroupShowArgs = {
  cn: string;
};

export type GroupShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
