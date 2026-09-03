import { DNSName } from "../types/primitives";
import { IdnsForwardPolicy } from "./dns";

export type DnsserverFindArgs = {
  criteria?: string;
};

export type DnsserverFindOptions = {
  idnsserverid?: string;
  idnssoamname?: DNSName;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type DnsserverModArgs = {
  idnsserverid: string;
};

export type DnsserverModOptions = {
  idnssoamname?: DNSName;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DnsserverShowArgs = {
  idnsserverid: string;
};

export type DnsserverShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
