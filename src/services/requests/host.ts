import { Certificate, Principal } from "../types/primitives";

export type IpaKrbPrincipalAuthind =
  | "radius"
  | "otp"
  | "pkinit"
  | "hardened"
  | "idp"
  | "passkey";

export type HostAddArgs = {
  fqdn: string;
};

export type HostAddOptions = {
  description?: string;
  l?: string;
  nshostlocation?: string;
  nshardwareplatform?: string;
  nsosversion?: string;
  userpassword?: string;
  random?: boolean;
  usercertificate?: Certificate;
  macaddress?: string;
  ipasshpubkey?: string;
  userclass?: string;
  ipaassignedidview?: string;
  krbprincipalauthind?: IpaKrbPrincipalAuthind;
  ipakrbrequirespreauth?: boolean;
  ipakrbokasdelegate?: boolean;
  ipakrboktoauthasdelegate?: boolean;
  setattr?: string;
  addattr?: string;
  force: boolean;
  no_reverse: boolean;
  ip_address?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostAddCertArgs = {
  fqdn: string;
};

export type HostAddCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type HostAddDelegationArgs = {
  fqdn: string;
  memberprincipal: string;
};

export type HostAddDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostAddManagedbyArgs = {
  fqdn: string;
};

export type HostAddManagedbyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
};

export type HostAddPrincipalArgs = {
  fqdn: string;
  krbprincipalname: Principal;
};

export type HostAddPrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostAllowAddDelegationArgs = {
  fqdn: string;
};

export type HostAllowAddDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type HostAllowCreateKeytabArgs = {
  fqdn: string;
};

export type HostAllowCreateKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type HostAllowRetrieveKeytabArgs = {
  fqdn: string;
};

export type HostAllowRetrieveKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type HostDelArgs = {
  fqdn: string;
};

export type HostDelOptions = {
  continue: boolean;
  updatedns?: boolean;
  version?: string;
};

export type HostDisableArgs = {
  fqdn: string;
};

export type HostDisableOptions = {
  version?: string;
};

export type HostDisallowAddDelegationArgs = {
  fqdn: string;
};

export type HostDisallowAddDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type HostDisallowCreateKeytabArgs = {
  fqdn: string;
};

export type HostDisallowCreateKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type HostDisallowRetrieveKeytabArgs = {
  fqdn: string;
};

export type HostDisallowRetrieveKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type HostFindArgs = {
  criteria?: string;
};

export type HostFindOptions = {
  fqdn?: string;
  description?: string;
  l?: string;
  nshostlocation?: string;
  nshardwareplatform?: string;
  nsosversion?: string;
  usercertificate?: Certificate;
  macaddress?: string;
  userclass?: string;
  ipaassignedidview?: string;
  krbprincipalauthind?: IpaKrbPrincipalAuthind;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  in_hostgroup?: string;
  not_in_hostgroup?: string;
  in_netgroup?: string;
  not_in_netgroup?: string;
  in_role?: string;
  not_in_role?: string;
  in_hbacrule?: string;
  not_in_hbacrule?: string;
  in_sudorule?: string;
  not_in_sudorule?: string;
  enroll_by_user?: string;
  not_enroll_by_user?: string;
  man_by_host?: string;
  not_man_by_host?: string;
  man_host?: string;
  not_man_host?: string;
};

export type HostModArgs = {
  fqdn: string;
};

export type HostModOptions = {
  description?: string;
  l?: string;
  nshostlocation?: string;
  nshardwareplatform?: string;
  nsosversion?: string;
  userpassword?: string;
  random?: boolean;
  usercertificate?: Certificate;
  krbprincipalname?: Principal;
  macaddress?: string;
  ipasshpubkey?: string;
  userclass?: string;
  ipaassignedidview?: string;
  krbprincipalauthind?: IpaKrbPrincipalAuthind;
  ipakrbrequirespreauth?: boolean;
  ipakrbokasdelegate?: boolean;
  ipakrboktoauthasdelegate?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  updatedns?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostRemoveCertArgs = {
  fqdn: string;
};

export type HostRemoveCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type HostRemoveDelegationArgs = {
  fqdn: string;
  memberprincipal: string;
};

export type HostRemoveDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostRemoveManagedbyArgs = {
  fqdn: string;
};

export type HostRemoveManagedbyOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
};

export type HostRemovePrincipalArgs = {
  fqdn: string;
  krbprincipalname: Principal;
};

export type HostRemovePrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type HostShowArgs = {
  fqdn: string;
};

export type HostShowOptions = {
  rights: boolean;
  out?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
