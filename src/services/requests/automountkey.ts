export type AutomountkeyAddArgs = {
  automountlocationcn: string;
  automountmapautomountmapname: string;
};

export type AutomountkeyAddOptions = {
  automountkey: string;
  automountinformation: string;
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountkeyDelArgs = {
  automountlocationcn: string;
  automountmapautomountmapname: string;
};

export type AutomountkeyDelOptions = {
  continue: boolean;
  automountkey: string;
  automountinformation?: string;
  version?: string;
};

export type AutomountkeyFindArgs = {
  automountlocationcn: string;
  automountmapautomountmapname: string;
  criteria?: string;
};

export type AutomountkeyFindOptions = {
  automountkey?: string;
  automountinformation?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AutomountkeyModArgs = {
  automountlocationcn: string;
  automountmapautomountmapname: string;
};

export type AutomountkeyModOptions = {
  automountkey: string;
  automountinformation?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  newautomountinformation?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  rename?: string;
};

export type AutomountkeyShowArgs = {
  automountlocationcn: string;
  automountmapautomountmapname: string;
};

export type AutomountkeyShowOptions = {
  rights: boolean;
  automountkey: string;
  automountinformation?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};
