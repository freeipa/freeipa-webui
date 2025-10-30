// Data types
import { DnsForwardZoneModPayload } from "src/services/rpcDnsForwardZones";
import { DNSForwardZone } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

export const dnsForwardZoneAsRecord = (
  element: Partial<DnsForwardZoneModPayload>,
  onElementChange: (element: Partial<DnsForwardZoneModPayload>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recordOnChange = (ipaObject: Record<string, any>) => {
    onElementChange(ipaObject as DnsForwardZoneModPayload);
  };

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set<keyof DNSForwardZone>([
  "dn",
  "idnsforwardpolicy",
  "idnszoneactive",
  "name_from_ip",
  "managedby",
]);
const dateValues = new Set<keyof DNSForwardZone>([]);
const complexValues = new Map<keyof DNSForwardZone, string>([
  ["idnsname", "__dns_name__"],
]);

export function apiToDnsForwardZone(apiRecord: unknown): DNSForwardZone {
  const converted = convertApiObj(
    apiRecord as Record<string, unknown>,
    simpleValues,
    dateValues,
    complexValues
  ) as Partial<DNSForwardZone>;
  return partialDnsForwardZoneToDnsForwardZone(converted);
}

export function partialDnsForwardZoneToDnsForwardZone(
  partialDnsZone: Partial<DNSForwardZone>
): DNSForwardZone {
  return {
    ...createEmptyDnsForwardZone(),
    ...partialDnsZone,
  };
}

export function createEmptyDnsForwardZone(): DNSForwardZone {
  return {
    dn: "",
    idnsname: "",
    idnsforwarders: [],
    idnsforwardpolicy: "first",
    idnszoneactive: false,
  };
}
