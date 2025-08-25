// Data types
import { DnsConfig } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const dnsConfigAsRecord = (
  element: Partial<DnsConfig>,
  onElementChange: (element: Partial<DnsConfig>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as DnsConfig);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "idnsforwardpolicy",
  "idnsallowsyncptr",
  "idnszonerefresh",
  "ipadnsversion",
  "dns_server_server",
  "dns_server_server_id",
  "dn",
  "cn",
  "ipaconfigstring",
  "aci",
]);
const dateValues = new Set([]);

export function apiToDnsConfig(apiRecord: Record<string, unknown>): DnsConfig {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<DnsConfig>;
  return partialDnsConfigToDnsConfig(converted);
}

export function partialDnsConfigToDnsConfig(
  partialDnsConfig: Partial<DnsConfig>
) {
  return {
    ...createEmptyDnsConfig(),
    ...partialDnsConfig,
  };
}

export function createEmptyDnsConfig(): DnsConfig {
  return {
    idnsforwarders: [],
    idnsforwardpolicy: "none",
    idnsallowsyncptr: false,
    idnszonerefresh: 0,
    ipadnsversion: 0,
    dns_server_server: "",
    dns_server_server_id: "",
    dn: "",
    cn: "",
    ipaconfigstring: "",
    aci: [],
  };
}
