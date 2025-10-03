import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";
import { DnsRecordType } from "src/utils/datatypes/globalDataTypes";

const dnsRecordTypes: DnsRecordType[] = [
  "A",
  "AAAA",
  "A6",
  "AFSDB",
  "CERT",
  "CNAME",
  "DNAME",
  "DS",
  "DLV",
  "KX",
  "LOC",
  "MX",
  "NAPTR",
  "NS",
  "PTR",
  "SRV",
  "SSHFP",
  "TLSA",
  "TXT",
  "URI",
];

defineParameterType({
  name: "DnsRecordType",
  regexp: new RegExp(dnsRecordTypes.join("|")),
  transformer: (s: string) => s as DnsRecordType,
});
