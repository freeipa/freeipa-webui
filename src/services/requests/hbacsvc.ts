export type HbacsvcAddArgs = {
  cn: string;
};

export type HbacsvcAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HbacsvcDelArgs = {
  cn: string;
};

export type HbacsvcDelOptions = {
  continue: boolean;
  version?: string;
};

export type HbacsvcFindArgs = {
  criteria?: string;
};

export type HbacsvcFindOptions = {
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

export type HbacsvcModArgs = {
  cn: string;
};

export type HbacsvcModOptions = {
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

export type HbacsvcShowArgs = {
  cn: string;
};

export type HbacsvcShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
