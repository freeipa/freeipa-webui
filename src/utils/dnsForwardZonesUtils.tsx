// Data types
import { DNSForwardZone } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

export const dnsForwardZoneAsRecord = (
  element: Partial<DNSForwardZone>,
  onElementChange: (element: Partial<DNSForwardZone>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recordOnChange = (ipaObject: Record<string, any>) => {
    onElementChange(ipaObject as DNSForwardZone);
  };

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set<keyof DNSForwardZone>([
  "dn",
  "idnsforwardpolicy",
  "idnszoneactive",
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
) {
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
