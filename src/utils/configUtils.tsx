// Data types
import { Config } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "dn",
  "cn",
  "ipamaxusernamelength",
  "ipahomesrootdir",
  "ipadefaultloginshell",
  "ipadefaultprimarygroup",
  "ipadefaultemaildomain",
  "ipasearchtimelimit",
  "ipasearchrecordslimit",
  "ipausersearchfields",
  "ipagroupsearchfields",
  "ipacertificatesubjectbase",
  "ipapwdexpadvnotify",
  "ipaselinuxusermapdefault",
  "ipadomainresolutionorder",
  "ipamaxhostnamelength",
  "ipaselinuxusermaporder",
  "ca_renewal_master_server",
  "ipamigrationenabled",
  "ipauserdefaultsubordinateid",
]);

const dateValues = new Set([]);

export function apiToConfig(apiRecord: Record<string, unknown>): Config {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Config>;
  return partialConfigToConfig(converted) as Config;
}

export function partialConfigToConfig(partialConfig: Partial<Config>): Config {
  return {
    ...createEmptyConfig(),
    ...partialConfig,
  };
}

// Get empty User object initialized with default values
export function createEmptyConfig(): Config {
  const config: Config = {
    dn: "",
    cn: "",
    ipamaxusernamelength: "",
    ipahomesrootdir: "",
    ipadefaultloginshell: "",
    ipadefaultprimarygroup: "",
    ipadefaultemaildomain: "",
    ipasearchtimelimit: "",
    ipasearchrecordslimit: "",
    ipausersearchfields: "",
    ipagroupsearchfields: "",
    ipacertificatesubjectbase: "",
    ipapwdexpadvnotify: "",
    ipaselinuxusermapdefault: "",
    ipadomainresolutionorder: "",
    ipamaxhostnamelength: "",
    ipaselinuxusermaporder: "",
    ca_renewal_master_server: "",
    ipaconfigstring: [],
    ipakrbauthzdata: [],
    ipauserauthtype: [],
    ipagroupobjectclasses: [],
    ipauserobjectclasses: [],
    ca_server_server: [],
    kra_server_server: [],
    ipa_master_server: [],
    pkinit_server_server: [],
    dns_server_server: [],
    ipamigrationenabled: false,
    ipauserdefaultsubordinateid: false,
  };

  return config;
}
