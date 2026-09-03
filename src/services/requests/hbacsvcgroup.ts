export type HbacsvcgroupAddArgs = {
  cn: string;
};

export type HbacsvcgroupAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HbacsvcgroupAddMemberArgs = {
  cn: string;
};

export type HbacsvcgroupAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  hbacsvc?: string;
};

export type HbacsvcgroupDelArgs = {
  cn: string;
};

export type HbacsvcgroupDelOptions = {
  continue: boolean;
  version?: string;
};

export type HbacsvcgroupFindArgs = {
  criteria?: string;
};

export type HbacsvcgroupFindOptions = {
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

export type HbacsvcgroupModArgs = {
  cn: string;
};

export type HbacsvcgroupModOptions = {
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

export type HbacsvcgroupRemoveMemberArgs = {
  cn: string;
};

export type HbacsvcgroupRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  hbacsvc?: string;
};

export type HbacsvcgroupShowArgs = {
  cn: string;
};

export type HbacsvcgroupShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
