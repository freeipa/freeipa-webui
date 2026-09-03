import { DN } from "../types/primitives";

export type TopologysuffixAddArgs = {
  cn: string;
};

export type TopologysuffixAddOptions = {
  iparepltopoconfroot: DN;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TopologysuffixDelArgs = {
  cn: string;
};

export type TopologysuffixDelOptions = {
  continue: boolean;
  version?: string;
};

export type TopologysuffixFindArgs = {
  criteria?: string;
};

export type TopologysuffixFindOptions = {
  cn?: string;
  iparepltopoconfroot?: DN;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type TopologysuffixModArgs = {
  cn: string;
};

export type TopologysuffixModOptions = {
  iparepltopoconfroot?: DN;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TopologysuffixShowArgs = {
  cn: string;
};

export type TopologysuffixShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TopologysuffixVerifyArgs = {
  cn: string;
};

export type TopologysuffixVerifyOptions = {
  version?: string;
};
