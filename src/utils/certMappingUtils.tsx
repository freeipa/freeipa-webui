// Data types
import {
  CertificateMapping,
  CertificateMappingConfig,
} from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

export const certMapConfigAsRecord = (
  element: Partial<CertificateMappingConfig>,
  onElementChange: (element: Partial<CertificateMappingConfig>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as CertificateMappingConfig);
  }

  return { ipaObject, recordOnChange };
};

export const certMapRuleAsRecord = (
  element: Partial<CertificateMapping>,
  onElementChange: (element: Partial<CertificateMapping>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as CertificateMapping);
  }

  return { ipaObject, recordOnChange };
};

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
    ipacertmappriority: 0,
    ipaenabledflag: false,
  };
}
