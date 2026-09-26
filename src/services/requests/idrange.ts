export type IpaRangeType = "ipa-ad-trust" | "ipa-ad-trust-posix" | "ipa-local";

type IpaAutoPrivGroups = "true" | "false" | "hybrid";

export type IdrangeAddArgs = {
  cn: string;
};

export type IdrangeAddOptions = {
  ipabaseid: number;
  ipaidrangesize: number;
  ipabaserid?: number;
  ipasecondarybaserid?: number;
  ipanttrusteddomainsid?: string;
  ipanttrusteddomainname?: string;
  iparangetype?: IpaRangeType;
  ipaautoprivategroups?: IpaAutoPrivGroups;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type IdrangeDelArgs = {
  cn: string;
};

export type IdrangeDelOptions = {
  continue: boolean;
  version?: string;
};

export type IdrangeFindArgs = {
  criteria?: string;
};

export type IdrangeFindOptions = {
  cn?: string;
  ipabaseid?: number;
  ipaidrangesize?: number;
  ipabaserid?: number;
  ipasecondarybaserid?: number;
  ipanttrusteddomainsid?: string;
  iparangetype?: IpaRangeType;
  ipaautoprivategroups?: IpaAutoPrivGroups;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type IdrangeModArgs = {
  cn: string;
};

export type IdrangeModOptions = {
  ipabaseid?: number;
  ipaidrangesize?: number;
  ipabaserid?: number;
  ipasecondarybaserid?: number;
  ipaautoprivategroups?: IpaAutoPrivGroups;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  ipanttrusteddomainsid?: string;
  ipanttrusteddomainname?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type IdrangeShowArgs = {
  cn: string;
};

export type IdrangeShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
