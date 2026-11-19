export type SubidAddArgs = {
  ipauniqueid?: string;
};

export type SubidAddOptions = {
  description?: string;
  ipaowner: string;
  ipasubuidnumber?: number;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SubidDelArgs = {
  ipauniqueid: string;
};

export type SubidDelOptions = {
  continue: boolean;
  version?: string;
};

export type SubidFindArgs = {
  criteria?: string;
};

export type SubidFindOptions = {
  ipauniqueid?: string;
  description?: string;
  ipaowner?: string;
  ipasubuidnumber?: number;
  ipasubgidnumber?: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type SubidGenerateArgs = null;

export type SubidGenerateOptions = {
  ipaowner?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SubidMatchArgs = {
  criteria?: string;
};

export type SubidMatchOptions = {
  ipasubuidnumber: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type SubidModArgs = {
  ipauniqueid: string;
};

export type SubidModOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SubidShowArgs = {
  ipauniqueid: string;
};

export type SubidShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type SubidStatsArgs = null;

export type SubidStatsOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
