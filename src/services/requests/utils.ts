import { DN, Principal } from "../types/primitives";

export type AdtrustIsEnabledArgs = null;

export type AdtrustIsEnabledOptions = {
  version?: string;
};

export type BatchArgs = {
  methods?: Record<string, unknown>;
};

export type BatchOptions = {
  keeponly?: string;
  version?: string;
};

export type CompatIsEnabledArgs = null;

export type CompatIsEnabledOptions = {
  version?: string;
};

export type DomainlevelGetArgs = null;

export type DomainlevelGetOptions = {
  version?: string;
};

export type DomainlevelSetArgs = {
  ipadomainlevel: number;
};

export type DomainlevelSetOptions = {
  version?: string;
};

export type EnvArgs = {
  variables?: string[];
};

export type EnvOptions = {
  server?: boolean;
  all: boolean;
  version?: string;
};

export type HbactestArgs = null;

export type HbactestOptions = {
  user: string;
  sourcehost?: string;
  targethost: string;
  service: string;
  rules?: string;
  nodetail?: boolean;
  enabled?: boolean;
  disabled?: boolean;
  sizelimit?: number;
  version?: string;
};

export type I18nMessagesArgs = null;

export type I18nMessagesOptions = {
  version?: string;
};

export type JoinArgs = {
  cn: string;
};

export type JoinOptions = {
  realm: string;
  nshardwareplatform?: string;
  nsosversion?: string;
  version?: string;
};

export type JsonMetadataArgs = {
  objname?: string;
  methodname?: string;
};

export type JsonMetadataOptions = {
  object?: string;
  method?: string;
  command?: string;
  version?: string;
};

export type KraIsEnabledArgs = null;

export type KraIsEnabledOptions = {
  version?: string;
};

export type MigrateDsArgs = {
  ldapuri: string;
  bindpw: string;
};

export type MigrateDsOptions = {
  binddn?: DN;
  usercontainer: DN;
  groupcontainer: DN;
  userobjectclass: string;
  groupobjectclass: string;
  userignoreobjectclass?: string;
  userignoreattribute?: string;
  groupignoreobjectclass?: string;
  groupignoreattribute?: string;
  groupoverwritegid: boolean;
  schema?: "RFC2307bis" | "RFC2307";
  continue?: boolean;
  basedn?: DN;
  compat?: boolean;
  cacertfile?: string;
  use_def_group?: boolean;
  scope: "base" | "onelevel" | "subtree";
  version?: string;
  exclude_users?: string;
  exclude_groups?: string;
};

export type PasswdArgs = {
  principal: Principal;
  password: string;
  current_password: string;
};

export type PasswdOptions = {
  otp?: string;
  version?: string;
};

export type PingArgs = null;

export type PingOptions = {
  version?: string;
};

export type PluginsArgs = null;

export type PluginsOptions = {
  server?: boolean;
  all: boolean;
  version?: string;
};

export type SchemaArgs = null;

export type SchemaOptions = {
  known_fingerprints?: string;
  version?: string;
};

export type SessionLogoutArgs = null;

export type SessionLogoutOptions = {
  version?: string;
};

export type SidgenWasRunArgs = null;

export type SidgenWasRunOptions = {
  version?: string;
};

export type WhoamiArgs = null;

export type WhoamiOptions = {
  version?: string;
};
