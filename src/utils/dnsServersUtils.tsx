// Data types
import { DnsServer } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const dnsServerAsRecord = (
  element: Partial<DnsServer>,
  onElementChange: (element: Partial<DnsServer>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as DnsServer);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set(["idnsserverid", "idnsforwardpolicy"]);
const dateValues = new Set([]);
const complexValues = new Map([["idnssoamname", "__dns_name__"]]);

export function apiToDnsServer(apiRecord: Record<string, unknown>): DnsServer {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues,
    complexValues
  ) as Partial<DnsServer>;
  return partialDnsServerToDnsServer(converted);
}

export function partialDnsServerToDnsServer(
  partialDnsServer: Partial<DnsServer>
) {
  return {
    ...createEmptyDnsServer(),
    ...partialDnsServer,
  };
}

export function createEmptyDnsServer(): DnsServer {
  return {
    idnsserverid: "",
    idnssoamname: "",
    idnsforwarders: [],
    idnsforwardpolicy: "none",
  };
}
