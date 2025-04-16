// Data types
import { CertificateMapping } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "dn",
  "description",
  "ipacertmapmaprule",
  "ipacertmapmatchrule",
  "ipacertmappriority",
  "ipaenabledflag",
]);
const dateValues = new Set([]);

export function apiToCertificateMapping(
  apiRecord: Record<string, unknown>
): CertificateMapping {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<CertificateMapping>;
  return partialCertMappingToCertMapping(converted);
}

export function partialCertMappingToCertMapping(
  partialcertMapping: Partial<CertificateMapping>
) {
  return {
    ...createEmptyCertMapping(),
    ...partialcertMapping,
  };
}

export function createEmptyCertMapping(): CertificateMapping {
  return {
    cn: "",
    dn: "",
    description: "",
    ipacertmapmaprule: "",
    ipacertmapmatchrule: "",
    associateddomain: [],
    ipacertmappriority: "",
    ipaenabledflag: false,
  };
}
