import { DNSName } from "../types/primitives";
import { IdnsForwardPolicy } from "./dns";

export type DnsforwardzoneAddArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneAddOptions = {
  name_from_ip?: string;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  setattr?: string;
  addattr?: string;
  skip_overlap_check: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DnsforwardzoneAddPermissionArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneAddPermissionOptions = {
  version?: string;
};

export type DnsforwardzoneDelArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneDelOptions = {
  continue: boolean;
  version?: string;
};

export type DnsforwardzoneDisableArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneDisableOptions = {
  version?: string;
};

export type DnsforwardzoneEnableArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneEnableOptions = {
  version?: string;
};

export type DnsforwardzoneFindArgs = {
  criteria?: string;
};

export type DnsforwardzoneFindOptions = {
  idnsname?: DNSName;
  name_from_ip?: string;
  idnszoneactive?: boolean;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type DnsforwardzoneModArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneModOptions = {
  name_from_ip?: string;
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

export type DnsforwardzoneRemovePermissionArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneRemovePermissionOptions = {
  version?: string;
};

export type DnsforwardzoneShowArgs = {
  idnsname: DNSName;
};

export type DnsforwardzoneShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
