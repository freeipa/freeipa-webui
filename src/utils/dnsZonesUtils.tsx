// Data types
import { DNSZone } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

export const dnsZoneAsRecord = (
  element: Partial<DNSZone>,
  onElementChange: (element: Partial<DNSZone>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as DNSZone);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "idnssoaserial",
  "idnssoaexpire",
  "idnssoarefresh",
  "idnsallowdynupdate",
  "idnssoaminimum",
  "idnsallowquery",
  "idnssoaretry",
  "idnsupdatepolicy",
  "idnszoneactive",
  "idnsallowtransfer",
  "dn",
  "name_from_ip",
  "idnsforwardpolicy",
  "managedby",
  "dnsttl",
  "dnsdefaultttl",
  "dnsclass",
  "idnsallowsyncptr",
  "idnssecinlinesigning",
  "nsec3paramrecord",
]);
const dateValues = new Set([]);
const complexValues = new Map([
  ["idnsname", "__dns_name__"],
  ["idnssoarname", "__dns_name__"],
  ["idnssoamname", "__dns_name__"],
]);

export function apiToDnsZone(apiRecord: Record<string, unknown>): DNSZone {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues,
    complexValues
  ) as Partial<DNSZone>;
  return partialDnsZoneToDnsZone(converted);
}

export function partialDnsZoneToDnsZone(partialDnsZone: Partial<DNSZone>) {
  return {
    ...createEmptyDnsZone(),
    ...partialDnsZone,
  };
}

export function createEmptyDnsZone(): DNSZone {
  return {
    idnsname: "",
    idnssoarname: "",
    idnssoamname: "",
    idnssoaserial: 1,
    idnssoaexpire: 1209600, // 14 days in seconds
    idnssoarefresh: 3600, // 1 hour in seconds
    idnsallowdynupdate: false,
    idnssoaminimum: 3600, // 1 hour in seconds
    idnsallowquery: "",
    idnssoaretry: 900, // 15 minutes in seconds
    nsrecord: [],
    idnsupdatepolicy: "",
    idnszoneactive: true,
    idnsallowtransfer: "",
    dn: "",
    name_from_ip: "",
    idnsforwarders: [],
    idnsforwardpolicy: "",
    managedby: "",
    dnsttl: 0,
    dnsdefaultttl: 0,
    dnsclass: "",
    idnsallowsyncptr: true,
    idnssecinlinesigning: false,
    nsec3paramrecord: "",
  };
}
