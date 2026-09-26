export type ServicedelegationruleAddArgs = {
  cn: string;
};

export type ServicedelegationruleAddOptions = {
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServicedelegationruleAddMemberArgs = {
  cn: string;
};

export type ServicedelegationruleAddMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  principal?: string;
};

export type ServicedelegationruleAddTargetArgs = {
  cn: string;
};

export type ServicedelegationruleAddTargetOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  servicedelegationtarget?: string;
};

export type ServicedelegationruleDelArgs = {
  cn: string;
};

export type ServicedelegationruleDelOptions = {
  continue: boolean;
  version?: string;
};

export type ServicedelegationruleFindArgs = {
  criteria?: string;
};

export type ServicedelegationruleFindOptions = {
  cn?: string;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type ServicedelegationruleRemoveMemberArgs = {
  cn: string;
};

export type ServicedelegationruleRemoveMemberOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  principal?: string;
};

export type ServicedelegationruleRemoveTargetArgs = {
  cn: string;
};

export type ServicedelegationruleRemoveTargetOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  servicedelegationtarget?: string;
};

export type ServicedelegationruleShowArgs = {
  cn: string;
};

export type ServicedelegationruleShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
