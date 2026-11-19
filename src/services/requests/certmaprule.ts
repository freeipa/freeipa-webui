import { DNSName } from "../types/primitives";

export type CertmapruleAddArgs = {
  cn: string;
};

export type CertmapruleAddOptions = {
  description?: string;
  ipacertmapmaprule?: string;
  ipacertmapmatchrule?: string;
  associateddomain?: DNSName;
  ipacertmappriority?: number;
  ipaenabledflag?: boolean;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CertmapruleDelArgs = {
  cn: string;
};

export type CertmapruleDelOptions = {
  continue: boolean;
  version?: string;
};

export type CertmapruleDisableArgs = {
  cn: string;
};

export type CertmapruleDisableOptions = {
  version?: string;
};

export type CertmapruleEnableArgs = {
  cn: string;
};

export type CertmapruleEnableOptions = {
  version?: string;
};

export type CertmapruleFindArgs = {
  criteria?: string;
};

export type CertmapruleFindOptions = {
  cn?: string;
  description?: string;
  ipacertmapmaprule?: string;
  ipacertmapmatchrule?: string;
  associateddomain?: DNSName;
  ipacertmappriority?: number;
  ipaenabledflag?: boolean;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type CertmapruleModArgs = {
  cn: string;
};

export type CertmapruleModOptions = {
  description?: string;
  ipacertmapmaprule?: string;
  ipacertmapmatchrule?: string;
  associateddomain?: DNSName;
  ipacertmappriority?: number;
  ipaenabledflag?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CertmapruleShowArgs = {
  cn: string;
};

export type CertmapruleShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
