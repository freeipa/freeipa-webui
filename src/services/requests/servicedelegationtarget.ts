export type ServicedelegationtargetAddArgs = {
  cn: string;
};

export type ServicedelegationtargetAddOptions = {
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type ServicedelegationtargetAddMemberArgs = {
  cn: string;
};

export type ServicedelegationtargetAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  principal?: string;
};

export type ServicedelegationtargetDelArgs = {
  cn: string;
};

export type ServicedelegationtargetDelOptions = {
  continue: boolean;
  version?: string;
};

export type ServicedelegationtargetFindArgs = {
  criteria?: string;
};

export type ServicedelegationtargetFindOptions = {
  cn?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  pkey_only?: boolean;
};

export type ServicedelegationtargetRemoveMemberArgs = {
  cn: string;
};

export type ServicedelegationtargetRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  principal?: string;
};

export type ServicedelegationtargetShowArgs = {
  cn: string;
};

export type ServicedelegationtargetShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
