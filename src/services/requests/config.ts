type IpaConfigString =
  | "AllowNThash"
  | "KDC:Disable Last Success"
  | "KDC:Disable Lockout"
  | "KDC:Disable Default Preauth for SPNs"
  | "EnforceLDAPOTP"
  | "SubID:Disable";

export type IpaKrbAuthzData = "MS-PAC" | "PAD" | "nfs:NONE";

export type IpaUserAuthType =
  | "password"
  | "radius"
  | "otp"
  | "pkinit"
  | "hardened"
  | "idp"
  | "passkey"
  | "disabled";

export type ConfigModArgs = null;

export type ConfigModOptions = {
  ipamaxusernamelength?: number;
  ipamaxhostnamelength?: number;
  ipahomesrootdir?: string;
  ipadefaultloginshell?: string;
  ipadefaultprimarygroup?: string;
  ipadefaultemaildomain?: string;
  ipasearchtimelimit?: number;
  ipasearchrecordslimit?: number;
  ipausersearchfields?: string;
  ipagroupsearchfields?: string;
  ipamigrationenabled?: boolean;
  ipagroupobjectclasses?: string;
  ipauserobjectclasses?: string;
  ipapwdexpadvnotify?: number;
  ipaconfigstring?: IpaConfigString[];
  ipaselinuxusermaporder?: string;
  ipaselinuxusermapdefault?: string;
  ipakrbauthzdata?: IpaKrbAuthzData[];
  ipauserauthtype?: IpaUserAuthType[];
  ipauserdefaultsubordinateid?: boolean;
  ca_renewal_master_server?: string;
  ipadomainresolutionorder?: string;
  enable_sid?: boolean;
  add_sids?: boolean;
  netbios_name?: string;
  ipaservicekeytypesize?: string;
  setattr?: string;
  addattr?: string;
  delattr?: string;
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};

export type ConfigShowArgs = null;

export type ConfigShowOptions = {
  rights: boolean;
  all: boolean;
  raw: boolean;
  version?: string;
};
