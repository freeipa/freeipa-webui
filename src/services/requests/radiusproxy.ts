export type RadiusproxyAddArgs = {
  cn: string;
};

export type RadiusproxyAddOptions = {
  description?: string;
  ipatokenradiusserver: string;
  ipatokenradiussecret: string;
  ipatokenradiustimeout?: number;
  ipatokenradiusretries?: number;
  ipatokenusermapattribute?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type RadiusproxyDelArgs = {
  cn: string;
};

export type RadiusproxyDelOptions = {
  continue: boolean;
  version?: string;
};

export type RadiusproxyFindArgs = {
  criteria?: string;
};

export type RadiusproxyFindOptions = {
  cn?: string;
  description?: string;
  ipatokenradiusserver?: string;
  ipatokenradiussecret?: string;
  ipatokenradiustimeout?: number;
  ipatokenradiusretries?: number;
  ipatokenusermapattribute?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type RadiusproxyModArgs = {
  cn: string;
};

export type RadiusproxyModOptions = {
  description?: string;
  ipatokenradiusserver?: string;
  ipatokenradiussecret?: string;
  ipatokenradiustimeout?: number;
  ipatokenradiusretries?: number;
  ipatokenusermapattribute?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  rename?: string;
};

export type RadiusproxyShowArgs = {
  cn: string;
};

export type RadiusproxyShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
