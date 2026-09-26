export type AutomountlocationAddArgs = {
  cn: string;
};

export type AutomountlocationAddOptions = {
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountlocationDelArgs = {
  cn: string;
};

export type AutomountlocationDelOptions = {
  continue: boolean;
  version?: string;
};

export type AutomountlocationFindArgs = {
  criteria?: string;
};

export type AutomountlocationFindOptions = {
  cn?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type AutomountlocationShowArgs = {
  cn: string;
};

export type AutomountlocationShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountlocationTofilesArgs = {
  cn: string;
};

export type AutomountlocationTofilesOptions = {
  version?: string;
};
