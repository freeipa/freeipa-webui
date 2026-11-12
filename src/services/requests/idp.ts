type IdpProvider = "google" | "github" | "microsoft" | "okta" | "keycloak";

export type IdpAddArgs = {
  cn: string;
};

export type IdpAddOptions = {
  ipaidpauthendpoint?: string;
  ipaidpdevauthendpoint?: string;
  ipaidptokenendpoint?: string;
  ipaidpuserinfoendpoint?: string;
  ipaidpkeysendpoint?: string;
  ipaidpissuerurl?: string;
  ipaidpclientid: string;
  ipaidpclientsecret?: string;
  ipaidpscope?: string;
  ipaidpsub?: string;
  setattr?: string;
  addattr?: string;
  ipaidpprovider?: IdpProvider;
  ipaidporg?: string;
  ipaidpbaseurl?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type IdpDelArgs = {
  cn: string;
};

export type IdpDelOptions = {
  continue: boolean;
  version?: string;
};

export type IdpFindArgs = {
  criteria?: string;
};

export type IdpFindOptions = {
  cn?: string;
  ipaidpauthendpoint?: string;
  ipaidpdevauthendpoint?: string;
  ipaidptokenendpoint?: string;
  ipaidpuserinfoendpoint?: string;
  ipaidpkeysendpoint?: string;
  ipaidpissuerurl?: string;
  ipaidpclientid?: string;
  ipaidpclientsecret?: string;
  ipaidpscope?: string;
  ipaidpsub?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type IdpModArgs = {
  cn: string;
};

export type IdpModOptions = {
  ipaidpauthendpoint?: string;
  ipaidpdevauthendpoint?: string;
  ipaidptokenendpoint?: string;
  ipaidpuserinfoendpoint?: string;
  ipaidpkeysendpoint?: string;
  ipaidpissuerurl?: string;
  ipaidpclientid?: string;
  ipaidpclientsecret?: string;
  ipaidpscope?: string;
  ipaidpsub?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  rename?: string;
};

export type IdpShowArgs = {
  cn: string;
};

export type IdpShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
