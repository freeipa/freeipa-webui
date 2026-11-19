export type SudocmdAddArgs = {
  sudocmd: string;
};

export type SudocmdAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SudocmdDelArgs = {
  sudocmd: string;
};

export type SudocmdDelOptions = {
  continue: boolean;
  version?: string;
};

export type SudocmdFindArgs = {
  criteria?: string;
};

export type SudocmdFindOptions = {
  sudocmd?: string;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type SudocmdModArgs = {
  sudocmd: string;
};

export type SudocmdModOptions = {
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

export type SudocmdShowArgs = {
  sudocmd: string;
};

export type SudocmdShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
