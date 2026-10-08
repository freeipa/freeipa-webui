export type CommandDefaultsArgs = {
  full_name: string;
};

export type CommandDefaultsOptions = {
  params?: string;
  kw?: Record<string, unknown>;
  version?: string;
};

export type CommandFindArgs = {
  criteria?: string;
};

export type CommandFindOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type CommandShowArgs = {
  full_name: string;
};

export type CommandShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
