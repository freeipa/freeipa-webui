export type IdviewAddArgs = {
  cn: string;
};

export type IdviewAddOptions = {
  description?: string;
  ipadomainresolutionorder?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type IdviewApplyArgs = {
  cn: string;
};

export type IdviewApplyOptions = {
  host?: string;
  hostgroup?: string;
  version?: string;
};

export type IdviewDelArgs = {
  cn: string;
};

export type IdviewDelOptions = {
  continue: boolean;
  version?: string;
};

export type IdviewFindArgs = {
  criteria?: string;
};

export type IdviewFindOptions = {
  cn?: string;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type IdviewModArgs = {
  cn: string;
};

export type IdviewModOptions = {
  description?: string;
  ipadomainresolutionorder?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  rename?: string;
};

export type IdviewShowArgs = {
  cn: string;
};

export type IdviewShowOptions = {
  rights: boolean;
  show_hosts?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type IdviewUnapplyArgs = null;

export type IdviewUnapplyOptions = {
  host?: string;
  hostgroup?: string;
  version?: string;
};
