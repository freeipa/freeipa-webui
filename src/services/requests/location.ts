import { DNSName } from "../types/primitives";

export type LocationAddArgs = {
  idnsname: DNSName;
};

export type LocationAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type LocationDelArgs = {
  idnsname: DNSName;
};

export type LocationDelOptions = {
  continue: boolean;
  version?: string;
};

export type LocationFindArgs = {
  criteria?: string;
};

export type LocationFindOptions = {
  idnsname?: DNSName;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type LocationModArgs = {
  idnsname: DNSName;
};

export type LocationModOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type LocationShowArgs = {
  idnsname: DNSName;
};

export type LocationShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
