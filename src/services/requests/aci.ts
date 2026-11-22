import { DN } from "../types/primitives";

type AciType =
  | "user"
  | "group"
  | "host"
  | "service"
  | "hostgroup"
  | "netgroup"
  | "dnsrecord";
type AciPrefix = "permission" | "delegation" | "selfservice" | "none";

export type AciAddArgs = {
  aciname: string;
};

export type AciAddOptions = {
  permission?: string;
  group?: string;
  permissions: string;
  attrs?: string;
  type?: AciType;
  memberof?: string;
  filter?: string;
  subtree?: string;
  targetgroup?: string;
  selfaci?: boolean;
  aciprefix: AciPrefix;
  test?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AciDelArgs = {
  aciname: string;
};

export type AciDelOptions = {
  aciprefix: AciPrefix;
  version?: string;
};

export type AciFindArgs = {
  criteria?: string;
};

export type AciFindOptions = {
  aciname?: string;
  permission?: string;
  group?: string;
  permissions?: string;
  attrs?: string;
  type?: AciType;
  memberof?: string;
  filter?: string;
  subtree?: string;
  targetgroup?: string;
  selfaci?: boolean;
  aciprefix?: AciPrefix;
  pkey_only?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AciModArgs = {
  aciname: string;
};

export type AciModOptions = {
  permission?: string;
  group?: string;
  permissions?: string;
  attrs?: string;
  type?: AciType;
  memberof?: string;
  filter?: string;
  subtree?: string;
  targetgroup?: string;
  selfaci?: boolean;
  aciprefix: AciPrefix;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AciRenameArgs = {
  aciname: string;
};

export type AciRenameOptions = {
  permission?: string;
  group?: string;
  permissions?: string;
  attrs?: string;
  type?: AciType;
  memberof?: string;
  filter?: string;
  subtree?: string;
  targetgroup?: string;
  selfaci?: boolean;
  aciprefix: AciPrefix;
  newname: string;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type AciShowArgs = {
  aciname: string;
};

export type AciShowOptions = {
  aciprefix: AciPrefix;
  location?: DN;
  all: boolean;
  raw: boolean;
  version?: string;
};
