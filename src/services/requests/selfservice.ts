export type SelfserviceAddArgs = {
  aciname: string;
};

export type SelfserviceAddOptions = {
  permissions?: string;
  attrs: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SelfserviceDelArgs = {
  aciname: string;
};

export type SelfserviceDelOptions = {
  version?: string;
};

export type SelfserviceFindArgs = {
  criteria?: string;
};

export type SelfserviceFindOptions = {
  aciname?: string;
  permissions?: string;
  attrs?: string;
  pkey_only?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SelfserviceModArgs = {
  aciname: string;
};

export type SelfserviceModOptions = {
  permissions?: string;
  attrs?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SelfserviceShowArgs = {
  aciname: string;
};

export type SelfserviceShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
