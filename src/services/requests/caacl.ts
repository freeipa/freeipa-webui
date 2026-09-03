export type CaaclAddArgs = {
  cn: string;
};

export type CaaclAddOptions = {
  description?: string;
  ipaenabledflag?: boolean;
  ipacacategory?: "all";
  ipacertprofilecategory?: "all";
  usercategory?: "all";
  hostcategory?: "all";
  servicecategory?: "all";
  setattr?: string;
  addattr?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type CaaclAddCaArgs = {
  cn: string;
};

export type CaaclAddCaOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  ca?: string;
};

export type CaaclAddHostArgs = {
  cn: string;
};

export type CaaclAddHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type CaaclAddProfileArgs = {
  cn: string;
};

export type CaaclAddProfileOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  certprofile?: string;
};

export type CaaclAddServiceArgs = {
  cn: string;
};

export type CaaclAddServiceOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  service?: string;
};

export type CaaclAddUserArgs = {
  cn: string;
};

export type CaaclAddUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type CaaclDelArgs = {
  cn: string;
};

export type CaaclDelOptions = {
  continue: boolean;
  version?: string;
};

export type CaaclDisableArgs = {
  cn: string;
};

export type CaaclDisableOptions = {
  version?: string;
};

export type CaaclEnableArgs = {
  cn: string;
};

export type CaaclEnableOptions = {
  version?: string;
};

export type CaaclFindArgs = {
  criteria?: string;
};

export type CaaclFindOptions = {
  cn?: string;
  description?: string;
  ipaenabledflag?: boolean;
  ipacacategory?: "all";
  ipacertprofilecategory?: "all";
  usercategory?: "all";
  hostcategory?: "all";
  servicecategory?: "all";
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type CaaclModArgs = {
  cn: string;
};

export type CaaclModOptions = {
  description?: string;
  ipaenabledflag?: boolean;
  ipacacategory?: "all";
  ipacertprofilecategory?: "all";
  usercategory?: "all";
  hostcategory?: "all";
  servicecategory?: "all";
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type CaaclRemoveCaArgs = {
  cn: string;
};

export type CaaclRemoveCaOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  ca?: string;
};

export type CaaclRemoveHostArgs = {
  cn: string;
};

export type CaaclRemoveHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
  hostgroup?: string;
};

export type CaaclRemoveProfileArgs = {
  cn: string;
};

export type CaaclRemoveProfileOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  certprofile?: string;
};

export type CaaclRemoveServiceArgs = {
  cn: string;
};

export type CaaclRemoveServiceOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  service?: string;
};

export type CaaclRemoveUserArgs = {
  cn: string;
};

export type CaaclRemoveUserOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
};

export type CaaclShowArgs = {
  cn: string;
};

export type CaaclShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
