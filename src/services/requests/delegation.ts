export type DelegationAddArgs = {
  aciname: string;
};

export type DelegationAddOptions = {
  permissions?: string;
  attrs: string;
  memberof: string;
  group: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DelegationDelArgs = {
  aciname: string;
};

export type DelegationDelOptions = {
  version?: string;
};

export type DelegationFindArgs = {
  criteria?: string;
};

export type DelegationFindOptions = {
  aciname?: string;
  permissions?: string;
  attrs?: string;
  memberof?: string;
  group?: string;
  pkey_only?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DelegationModArgs = {
  aciname: string;
};

export type DelegationModOptions = {
  permissions?: string;
  attrs?: string;
  memberof?: string;
  group?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DelegationShowArgs = {
  aciname: string;
};

export type DelegationShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
