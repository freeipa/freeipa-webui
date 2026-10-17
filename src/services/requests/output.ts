export type OutputFindArgs = {
  commandfull_name: string;
  criteria?: string;
};

export type OutputFindOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type OutputShowArgs = {
  commandfull_name: string;
  name: string;
};

export type OutputShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};
