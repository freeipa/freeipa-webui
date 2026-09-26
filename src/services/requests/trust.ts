export type TrustAddArgs = {
  cn: string;
};

export type TrustAddOptions = {
  setattr?: string;
  addattr?: string;
  trust_type: "ad";
  realm_admin?: string;
  realm_passwd?: string;
  realm_server?: string;
  trust_secret?: string;
  base_id?: number;
  range_size?: number;
  range_type?: "ipa-ad-trust" | "ipa-ad-trust-posix";
  bidirectional?: boolean;
  external?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TrustDelArgs = {
  cn: string;
};

export type TrustDelOptions = {
  continue: boolean;
  version?: string;
};

export type TrustEnableAgentArgs = {
  remote_cn: string;
};

export type TrustEnableAgentOptions = {
  enable_compat: boolean;
  version?: string;
};

export type TrustFetchDomainsArgs = {
  cn: string;
};

export type TrustFetchDomainsOptions = {
  rights: boolean;
  realm_admin?: string;
  realm_passwd?: string;
  realm_server?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TrustFindArgs = {
  criteria?: string;
};

export type TrustFindOptions = {
  cn?: string;
  ipantflatname?: string;
  ipanttrusteddomainsid?: string;
  ipantsidblacklistincoming?: string;
  ipantsidblacklistoutgoing?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type TrustModArgs = {
  cn: string;
};

export type TrustModOptions = {
  ipantsidblacklistincoming?: string;
  ipantsidblacklistoutgoing?: string;
  ipantadditionalsuffixes?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TrustResolveArgs = null;

export type TrustResolveOptions = {
  sids: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TrustShowArgs = {
  cn: string;
};

export type TrustShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
