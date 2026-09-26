export type PasskeyconfigModArgs = null;

export type PasskeyconfigModOptions = {
  iparequireuserverification?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type PasskeyconfigShowArgs = null;

export type PasskeyconfigShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
