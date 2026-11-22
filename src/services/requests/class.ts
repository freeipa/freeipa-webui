export type ClassFindArgs = {
  criteria?: string;
};

export type ClassFindOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type ClassShowArgs = {
  full_name: string;
};

export type ClassShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
