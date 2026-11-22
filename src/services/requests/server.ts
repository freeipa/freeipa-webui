import { DNSName } from "../types/primitives";

type ServerRoleStatus = "enabled" | "configured" | "hidden" | "absent";

export type ServerConncheckArgs = {
  cn: string;
  remote_cn: string;
};

export type ServerConncheckOptions = {
  version?: string;
};

export type ServerDelArgs = {
  cn: string;
};

export type ServerDelOptions = {
  continue: boolean;
  ignore_topology_disconnect?: boolean;
  ignore_last_of_role?: boolean;
  force?: boolean;
  version?: string;
};

export type ServerFindArgs = {
  criteria?: string;
};

export type ServerFindOptions = {
  cn?: string;
  ipamindomainlevel?: number;
  ipamaxdomainlevel?: number;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  topologysuffix?: string;
  no_topologysuffix?: string;
  in_location?: DNSName;
  not_in_location?: DNSName;
  servrole?: string;
};

export type ServerModArgs = {
  cn: string;
};

export type ServerModOptions = {
  ipalocation_location?: DNSName;
  ipaserviceweight?: number;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServerRoleFindArgs = {
  criteria?: string;
};

export type ServerRoleFindOptions = {
  server_server?: string;
  role_servrole?: string;
  status?: ServerRoleStatus;
  timelimit?: number;
  sizelimit?: number;
  include_master: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type ServerRoleShowArgs = {
  server_server: string;
  role_servrole: string;
};

export type ServerRoleShowOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
};

export type ServerShowArgs = {
  cn: string;
};

export type ServerShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServerStateArgs = {
  cn: string;
};

export type ServerStateOptions = {
  state: "enabled" | "hidden";
  version?: string;
};
