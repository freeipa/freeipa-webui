// Data types
import { GlobalTrustConfig } from "./datatypes/globalDataTypes";
import { convertApiObj } from "./ipaObjectUtils";

export const globalTrustConfigAsRecord = (
  element: Partial<GlobalTrustConfig>,
  onElementChange: (element: Partial<GlobalTrustConfig>) => void
) => {
  const ipaObject = element as Record<string, unknown>;

  function recordOnChange(ipaObject: Record<string, unknown>) {
    onElementChange(ipaObject as unknown as GlobalTrustConfig);
  }
  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "cn",
  "ipantsecurityidentifier",
  "ipantflatname",
  "ipantdomainguid",
  "ipantfallbackprimarygroup",
]);
const dateValues = new Set([]);

export function apiToGlobalTrustConfig(
  apiRecord: Record<string, unknown>
): GlobalTrustConfig {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<GlobalTrustConfig>;
  return partialGlobalTrustConfigToGlobalTrustConfig(converted);
}

export function partialGlobalTrustConfigToGlobalTrustConfig(
  partialGlobalTrustConfig: Partial<GlobalTrustConfig>
) {
  return {
    ...createEmptyGlobalTrustConfig(),
    ...partialGlobalTrustConfig,
  };
}

export function createEmptyGlobalTrustConfig(): GlobalTrustConfig {
  return {
    cn: "",
    ipantsecurityidentifier: "",
    ipantflatname: "",
    ipantdomainguid: "",
    ipantfallbackprimarygroup: "",
    ad_trust_agent_server: [],
    ad_trust_controller_server: [],
  };
}
