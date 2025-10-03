// Data types
import { DNSForwardZone } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

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

function partialDnsForwardZoneToDnsForwardZone(
  partialDnsZone: Partial<DNSForwardZone>
): DNSForwardZone {
  return {
    ...createEmptyDnsForwardZone(),
    ...partialDnsZone,
  };
}

function createEmptyDnsForwardZone(): DNSForwardZone {
  return {
    dn: "",
    idnsname: "",
    idnsforwarders: [],
    idnsforwardpolicy: "first",
    idnszoneactive: false,
  };
}
