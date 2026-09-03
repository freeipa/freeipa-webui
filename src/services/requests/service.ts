import { Certificate, Principal } from "../types/primitives";
import { IpaKrbAuthzData } from "./config";
import { IpaKrbPrincipalAuthind } from "./host";

export type ServiceAddArgs = {
  krbcanonicalname: Principal;
};

export type ServiceAddOptions = {
  usercertificate?: Certificate;
  ipakrbauthzdata?: IpaKrbAuthzData;
  krbprincipalauthind?: IpaKrbPrincipalAuthind;
  ipakrbrequirespreauth?: boolean;
  ipakrbokasdelegate?: boolean;
  ipakrboktoauthasdelegate?: boolean;
  setattr?: string;
  addattr?: string;
  force: boolean;
  skip_host_check: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceAddCertArgs = {
  krbcanonicalname: Principal;
};

export type ServiceAddCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type ServiceAddDelegationArgs = {
  krbcanonicalname: Principal;
  memberprincipal: string;
};

export type ServiceAddDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceAddHostArgs = {
  krbcanonicalname: Principal;
};

export type ServiceAddHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
};

export type ServiceAddPrincipalArgs = {
  krbcanonicalname: Principal;
  krbprincipalname: Principal;
};

export type ServiceAddPrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceAddSmbArgs = {
  fqdn: string;
  ipantflatname?: string;
};

export type ServiceAddSmbOptions = {
  setattr?: string;
  addattr?: string;
  usercertificate?: Certificate;
  ipakrbokasdelegate?: boolean;
  ipakrboktoauthasdelegate?: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceAllowAddDelegationArgs = {
  krbcanonicalname: Principal;
};

export type ServiceAllowAddDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type ServiceAllowCreateKeytabArgs = {
  krbcanonicalname: Principal;
};

export type ServiceAllowCreateKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type ServiceAllowRetrieveKeytabArgs = {
  krbcanonicalname: Principal;
};

export type ServiceAllowRetrieveKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type ServiceDelArgs = {
  krbcanonicalname: Principal;
};

export type ServiceDelOptions = {
  continue: boolean;
  version?: string;
};

export type ServiceDisableArgs = {
  krbcanonicalname: Principal;
};

export type ServiceDisableOptions = {
  version?: string;
};

export type ServiceDisallowAddDelegationArgs = {
  krbcanonicalname: Principal;
};

export type ServiceDisallowAddDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type ServiceDisallowCreateKeytabArgs = {
  krbcanonicalname: Principal;
};

export type ServiceDisallowCreateKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type ServiceDisallowRetrieveKeytabArgs = {
  krbcanonicalname: Principal;
};

export type ServiceDisallowRetrieveKeytabOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  user?: string;
  group?: string;
  host?: string;
  hostgroup?: string;
};

export type ServiceFindArgs = {
  criteria?: string;
};

export type ServiceFindOptions = {
  krbcanonicalname?: Principal;
  krbprincipalname?: Principal;
  ipakrbauthzdata?: IpaKrbAuthzData;
  krbprincipalauthind?: IpaKrbPrincipalAuthind;
  timelimit?: number;
  sizelimit?: number;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  pkey_only?: boolean;
  man_by_host?: string;
  not_man_by_host?: string;
};

export type ServiceModArgs = {
  krbcanonicalname: Principal;
};

export type ServiceModOptions = {
  krbprincipalname?: Principal;
  usercertificate?: Certificate;
  ipakrbauthzdata?: IpaKrbAuthzData;
  krbprincipalauthind?: IpaKrbPrincipalAuthind;
  ipakrbrequirespreauth?: boolean;
  ipakrbokasdelegate?: boolean;
  ipakrboktoauthasdelegate?: boolean;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceRemoveCertArgs = {
  krbcanonicalname: Principal;
};

export type ServiceRemoveCertOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  usercertificate: Certificate;
};

export type ServiceRemoveDelegationArgs = {
  krbcanonicalname: Principal;
  memberprincipal: string;
};

export type ServiceRemoveDelegationOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceRemoveHostArgs = {
  krbcanonicalname: Principal;
};

export type ServiceRemoveHostOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
  host?: string;
};

export type ServiceRemovePrincipalArgs = {
  krbcanonicalname: Principal;
  krbprincipalname: Principal;
};

export type ServiceRemovePrincipalOptions = {
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};

export type ServiceShowArgs = {
  krbcanonicalname: Principal;
};

export type ServiceShowOptions = {
  rights: boolean;
  out?: string;
  all: boolean;
  raw: boolean;
  version?: string;
  no_members: boolean;
};
