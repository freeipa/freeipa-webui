import { DN } from "../types/primitives";

export type CaAddArgs = {
  cn: string;
};

export type CaAddOptions = {
  description?: string;
  ipacasubjectdn: DN;
  setattr?: string;
  addattr?: string;
  chain: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type CaDelArgs = {
  cn: string;
};

export type CaDelOptions = {
  continue: boolean;
  version?: string;
};

export type CaDisableArgs = {
  cn: string;
};

export type CaDisableOptions = {
  version?: string;
};

export type CaEnableArgs = {
  cn: string;
};

export type CaEnableOptions = {
  version?: string;
};

export type CaFindArgs = {
  criteria?: string;
};

export type CaFindOptions = {
  cn?: string;
  description?: string;
  ipacaid?: string;
  ipacasubjectdn?: DN;
  ipacaissuerdn?: DN;
  ipacarandomserialnumberversion?: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type CaIsEnabledArgs = null;

export type CaIsEnabledOptions = {
  version?: string;
};

export type CaModArgs = {
  cn: string;
};

export type CaModOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  rename?: string;
};

export type CaShowArgs = {
  cn: string;
};

export type CaShowOptions = {
  rights: boolean;
  chain: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
