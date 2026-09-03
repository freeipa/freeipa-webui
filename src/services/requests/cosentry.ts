import { DN } from "../types/primitives";

export type CosentryAddArgs = {
  cn: string;
};

export type CosentryAddOptions = {
  krbpwdpolicyreference: DN;
  cospriority: number;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CosentryDelArgs = {
  cn: string;
};

export type CosentryDelOptions = {
  continue: boolean;
  version?: string;
};

export type CosentryFindArgs = {
  criteria?: string;
};

export type CosentryFindOptions = {
  cn?: string;
  krbpwdpolicyreference?: DN;
  cospriority?: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type CosentryModArgs = {
  cn: string;
};

export type CosentryModOptions = {
  krbpwdpolicyreference?: DN;
  cospriority?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CosentryShowArgs = {
  cn: string;
};

export type CosentryShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
