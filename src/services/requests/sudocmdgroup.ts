export type SudocmdgroupAddArgs = {
  cn: string;
};

export type SudocmdgroupAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SudocmdgroupAddMemberArgs = {
  cn: string;
};

export type SudocmdgroupAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  sudocmd?: string;
};

export type SudocmdgroupDelArgs = {
  cn: string;
};

export type SudocmdgroupDelOptions = {
  continue: boolean;
  version?: string;
};

export type SudocmdgroupFindArgs = {
  criteria?: string;
};

export type SudocmdgroupFindOptions = {
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

export type SudocmdgroupModArgs = {
  cn: string;
};

export type SudocmdgroupModOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SudocmdgroupRemoveMemberArgs = {
  cn: string;
};

export type SudocmdgroupRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  sudocmd?: string;
};

export type SudocmdgroupShowArgs = {
  cn: string;
};

export type SudocmdgroupShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
