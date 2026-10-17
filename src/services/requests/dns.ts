export type IdnsForwardPolicy = "only" | "first" | "none";

export type DnsClass = "IN" | "CS" | "CH" | "HS";

export type DnsIsEnabledArgs = null;

export type DnsIsEnabledOptions = {
  version?: string;
};

export type DnsResolveArgs = {
  hostname: string;
};

export type DnsResolveOptions = {
  version?: string;
};

export type DnsUpdateSystemRecordsArgs = null;

export type DnsUpdateSystemRecordsOptions = {
  dry_run: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
