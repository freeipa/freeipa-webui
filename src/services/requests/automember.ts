export type AutomemberAddArgs = {
  cn: string;
};

export type AutomemberAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberAddConditionArgs = {
  cn: string;
};

export type AutomemberAddConditionOptions = {
  description?: string;
  automemberinclusiveregex?: string;
  automemberexclusiveregex?: string;
  key: string;
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberDefaultGroupRemoveArgs = null;

export type AutomemberDefaultGroupRemoveOptions = {
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberDefaultGroupSetArgs = null;

export type AutomemberDefaultGroupSetOptions = {
  automemberdefaultgroup: string;
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberDefaultGroupShowArgs = null;

export type AutomemberDefaultGroupShowOptions = {
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberDelArgs = {
  cn: string;
};

export type AutomemberDelOptions = {
  type: "group" | "hostgroup";
  version?: string;
};

export type AutomemberFindArgs = {
  criteria?: string;
};

export type AutomemberFindOptions = {
  description?: string;
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type AutomemberFindOrphansArgs = {
  criteria?: string;
};

export type AutomemberFindOrphansOptions = {
  description?: string;
  type: "group" | "hostgroup";
  remove?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type AutomemberModArgs = {
  cn: string;
};

export type AutomemberModOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberRebuildArgs = null;

export type AutomemberRebuildOptions = {
  type?: "group" | "hostgroup";
  users?: string;
  hosts?: string;
  no_wait?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberRemoveConditionArgs = {
  cn: string;
};

export type AutomemberRemoveConditionOptions = {
  description?: string;
  automemberinclusiveregex?: string;
  automemberexclusiveregex?: string;
  key: string;
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomemberShowArgs = {
  cn: string;
};

export type AutomemberShowOptions = {
  type: "group" | "hostgroup";
  all: boolean;
  raw: boolean;
  version?: string;
};
