export type AutomountmapAddArgs = {
  automountlocationcn: string;
  automountmapname: string;
};

export type AutomountmapAddOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountmapAddIndirectArgs = {
  automountlocationcn: string;
  automountmapname: string;
};

export type AutomountmapAddIndirectOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  key: string;
  parentmap?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountmapDelArgs = {
  automountlocationcn: string;
  automountmapname: string;
};

export type AutomountmapDelOptions = {
  continue: boolean;
  version?: string;
};

export type AutomountmapFindArgs = {
  automountlocationcn: string;
  criteria?: string;
};

export type AutomountmapFindOptions = {
  automountmapname?: string;
  description?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type AutomountmapModArgs = {
  automountlocationcn: string;
  automountmapname: string;
};

export type AutomountmapModOptions = {
  description?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountmapShowArgs = {
  automountlocationcn: string;
  automountmapname: string;
};

export type AutomountmapShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
