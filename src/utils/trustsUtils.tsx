import { Trust } from "./datatypes/globalDataTypes";
import { convertApiObj } from "src/utils/ipaObjectUtils";

export const asRecord = (
  element: Partial<Trust>,
  onElementChange: (element: Partial<Trust>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Trust);
  }
  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "cn",
  "ipantflatname",
  "ipanttrusteddomainsid",
  "trustdirection",
  "trusttype",
  "truststatus",
]);
const dateValues = new Set([]);

export const apiToTrust = (apiRecord: Record<string, unknown>): Trust => {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Trust>;
  return partialTrustToTrust(converted);
};

export const partialTrustToTrust = (partialTrust: Partial<Trust>): Trust => {
  return { ...createEmptyTrust(), ...partialTrust };
};

export const createEmptyTrust = (): Trust => {
  return {
    cn: "",
    ipantflatname: "",
    ipanttrusteddomainsid: "",
    ipantsidblacklistincoming: [],
    ipantsidblacklistoutgoing: [],
    trustdirection: "",
    trusttype: "",
    truststatus: "",
    ipantadditionalsuffixes: [],
  };
};
