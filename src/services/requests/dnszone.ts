import { DNSName } from "../types/primitives";
import { DnsClass, IdnsForwardPolicy } from "./dns";

export type DnszoneAddArgs = {
  idnsname: DNSName;
};

export type DnszoneAddOptions = {
  name_from_ip?: string;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  idnssoamname?: DNSName;
  idnssoarname: DNSName;
  idnssoaserial?: number;
  idnssoarefresh: number;
  idnssoaretry: number;
  idnssoaexpire: number;
  idnssoaminimum: number;
  dnsttl?: number;
  dnsdefaultttl?: number;
  dnsclass?: DnsClass;
  idnsupdatepolicy?: string;
  idnsallowdynupdate?: boolean;
  idnsallowquery?: string;
  idnsallowtransfer?: string;
  idnsallowsyncptr?: boolean;
  idnssecinlinesigning?: boolean;
  nsec3paramrecord?: string;
  setattr?: string;
  addattr?: string;
  skip_overlap_check: boolean;
  force: boolean;
  skip_nameserver_check: boolean;
  ip_address?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DnszoneAddPermissionArgs = {
  idnsname: DNSName;
};

export type DnszoneAddPermissionOptions = {
  version?: string;
};

export type DnszoneDelArgs = {
  idnsname: DNSName;
};

export type DnszoneDelOptions = {
  continue: boolean;
  version?: string;
};

export type DnszoneDisableArgs = {
  idnsname: DNSName;
};

export type DnszoneDisableOptions = {
  version?: string;
};

export type DnszoneEnableArgs = {
  idnsname: DNSName;
};

export type DnszoneEnableOptions = {
  version?: string;
};

export type DnszoneFindArgs = {
  criteria?: string;
};

export type DnszoneFindOptions = {
  idnsname?: DNSName;
  name_from_ip?: string;
  idnszoneactive?: boolean;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  idnssoamname?: DNSName;
  idnssoarname?: DNSName;
  idnssoaserial?: number;
  idnssoarefresh?: number;
  idnssoaretry?: number;
  idnssoaexpire?: number;
  idnssoaminimum?: number;
  dnsttl?: number;
  dnsdefaultttl?: number;
  dnsclass?: DnsClass;
  idnsupdatepolicy?: string;
  idnsallowdynupdate?: boolean;
  idnsallowquery?: string;
  idnsallowtransfer?: string;
  idnsallowsyncptr?: boolean;
  idnssecinlinesigning?: boolean;
  nsec3paramrecord?: string;
  timelimit?: number;
  sizelimit?: number;
  forward_only: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type DnszoneModArgs = {
  idnsname: DNSName;
};

export type DnszoneModOptions = {
  name_from_ip?: string;
  idnsforwarders?: string;
  idnsforwardpolicy?: IdnsForwardPolicy;
  idnssoamname?: DNSName;
  idnssoarname?: DNSName;
  idnssoaserial?: number;
  idnssoarefresh?: number;
  idnssoaretry?: number;
  idnssoaexpire?: number;
  idnssoaminimum?: number;
  dnsttl?: number;
  dnsdefaultttl?: number;
  dnsclass?: DnsClass;
  idnsupdatepolicy?: string;
  idnsallowdynupdate?: boolean;
  idnsallowquery?: string;
  idnsallowtransfer?: string;
  idnsallowsyncptr?: boolean;
  idnssecinlinesigning?: boolean;
  nsec3paramrecord?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  force: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type DnszoneRemovePermissionArgs = {
  idnsname: DNSName;
};

export type DnszoneRemovePermissionOptions = {
  version?: string;
};

export type DnszoneShowArgs = {
  idnsname: DNSName;
};

export type DnszoneShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
