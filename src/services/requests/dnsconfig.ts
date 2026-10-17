import { IdnsForwardPolicy } from "./dns";

export type DnsconfigModArgs = null;

export type DnsconfigModOptions = {
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  idnsallowsyncptr?: boolean;
  idnszonerefresh?: number;
  ipadnsversion?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DnsconfigShowArgs = null;

export type DnsconfigShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
