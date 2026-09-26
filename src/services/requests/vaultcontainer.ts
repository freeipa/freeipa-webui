import { Principal } from "../types/primitives";

export type VaultcontainerAddOwnerArgs = null;

export type VaultcontainerAddOwnerOptions = {
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

export type VaultcontainerDelArgs = null;

export type VaultcontainerDelOptions = {
  continue: boolean;
  service?: Principal;
  shared?: boolean;
  username?: string;
  version?: string;
};

export type VaultcontainerRemoveOwnerArgs = null;

export type VaultcontainerRemoveOwnerOptions = {
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

export type VaultcontainerShowArgs = null;

export type VaultcontainerShowOptions = {
  rights: boolean;
  service?: Principal;
  shared?: boolean;
  username?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
