export type SysaccountAddArgs = {
  uid: string;
};

export type SysaccountAddOptions = {
  description?: string;
  userpassword?: string;
  random?: boolean;
  nsaccountlock?: boolean;
  setattr?: string;
  addattr?: string;
  privileged?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SysaccountDelArgs = {
  uid: string;
};

export type SysaccountDelOptions = {
  continue: boolean;
  version?: string;
};

export type SysaccountDisableArgs = {
  uid: string;
};

export type SysaccountDisableOptions = {
  version?: string;
};

export type SysaccountEnableArgs = {
  uid: string;
};

export type SysaccountEnableOptions = {
  version?: string;
};

export type SysaccountFindArgs = {
  criteria?: string;
};

export type SysaccountFindOptions = {
  uid?: string;
  description?: string;
  nsaccountlock?: boolean;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type SysaccountModArgs = {
  uid: string;
};

export type SysaccountModOptions = {
  description?: string;
  userpassword?: string;
  random?: boolean;
  nsaccountlock?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  privileged?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SysaccountPolicyArgs = {
  uid: string;
};

export type SysaccountPolicyOptions = {
  rights: boolean;
  privileged?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type SysaccountShowArgs = {
  uid: string;
};

export type SysaccountShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
