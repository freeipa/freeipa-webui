export type TrustdomainAddArgs = {
  trustcn: string;
  cn: string;
};

export type TrustdomainAddOptions = {
  ipantflatname?: string;
  ipanttrusteddomainsid?: string;
  setattr?: string;
  addattr?: string;
  trust_type: "ad";
  all: boolean;
  raw: boolean;
  version?: string;
};

export type TrustdomainDelArgs = {
  trustcn: string;
  cn: string;
};

export type TrustdomainDelOptions = {
  continue: boolean;
  version?: string;
};

export type TrustdomainDisableArgs = {
  trustcn: string;
  cn: string;
};

export type TrustdomainDisableOptions = {
  version?: string;
};

export type TrustdomainEnableArgs = {
  trustcn: string;
  cn: string;
};

export type TrustdomainEnableOptions = {
  version?: string;
};

export type TrustdomainFindArgs = {
  trustcn: string;
  criteria?: string;
};

export type TrustdomainFindOptions = {
  cn?: string;
  ipantflatname?: string;
  ipanttrusteddomainsid?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type TrustdomainModArgs = {
  trustcn: string;
  cn: string;
};

export type TrustdomainModOptions = {
  ipantflatname?: string;
  ipanttrusteddomainsid?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  trust_type: "ad";
  all: boolean;
  raw: boolean;
  version?: string;
};
