import { Bytes, Principal } from "../types/primitives";

type IpaVaultType = "standard" | "symmetric" | "asymmetric";
type IpaWrappingAlgo = "aes-128-cbc" | "des-ede3-cbc";

export type VaultAddInternalArgs = {
  cn: string;
};

export type VaultAddInternalOptions = {
  description?: string;
  ipavaulttype?: IpaVaultType;
  ipavaultsalt?: Bytes;
  ipavaultpublickey?: Bytes;
  setattr?: string;
  addattr?: string;
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type VaultAddMemberArgs = {
  cn: string;
};

export type VaultAddMemberOptions = {
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  services?: string;
};

export type VaultAddOwnerArgs = {
  cn: string;
};

export type VaultAddOwnerOptions = {
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  services?: string;
};

export type VaultArchiveInternalArgs = {
  cn: string;
};

export type VaultArchiveInternalOptions = {
  service?: Principal;
  shared?: boolean;
  username?: string;
  session_key: Bytes;
  vault_data: Bytes;
  nonce: Bytes;
  wrapping_algo?: IpaWrappingAlgo;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type VaultDelArgs = {
  cn: string;
};

export type VaultDelOptions = {
  continue: boolean;
  service?: Principal;
  shared?: boolean;
  username?: string;
  version?: string;
};

export type VaultFindArgs = {
  criteria?: string;
};

export type VaultFindOptions = {
  cn?: string;
  description?: string;
  ipavaulttype?: IpaVaultType;
  timelimit?: number;
  sizelimit?: number;
  service?: Principal;
  shared?: boolean;
  username?: string;
  services?: boolean;
  users?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
};

export type VaultModInternalArgs = {
  cn: string;
};

export type VaultModInternalOptions = {
  description?: string;
  ipavaulttype?: IpaVaultType;
  ipavaultsalt?: Bytes;
  ipavaultpublickey?: Bytes;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type VaultRemoveMemberArgs = {
  cn: string;
};

export type VaultRemoveMemberOptions = {
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  services?: string;
};

export type VaultRemoveOwnerArgs = {
  cn: string;
};

export type VaultRemoveOwnerOptions = {
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  services?: string;
};

export type VaultRetrieveInternalArgs = {
  cn: string;
};

export type VaultRetrieveInternalOptions = {
  service?: Principal;
  shared?: boolean;
  username?: string;
  session_key: Bytes;
  wrapping_algo?: IpaWrappingAlgo;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type VaultShowArgs = {
  cn: string;
};

export type VaultShowOptions = {
  rights: boolean;
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
