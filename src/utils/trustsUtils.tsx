import { Trust, TrustDomain } from "./datatypes/globalDataTypes";
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
  "dn",
  "gidnumber",
  "homedirectory",
  "ipanttrustposixoffset",
  "ipanttrustpartner",
  "uid",
  "uidnumber",
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
    dn: "",
    gidnumber: "",
    homedirectory: "",
    ipanttrustposixoffset: "",
    ipanttrustpartner: "",
    uid: "",
    uidnumber: "",
  };
};

// Trust domains utils
const simpleTrustDomainValues = new Set([
  "cn",
  "dn",
  "ipantflatname",
  "ipanttrusteddomainsid",
  "domain_enabled",
]);
const dateTrustDomainValues = new Set([]);

export const apiToTrustDomain = (
  apiRecord: Record<string, unknown>
): TrustDomain => {
  const converted = convertApiObj(
    apiRecord,
    simpleTrustDomainValues,
    dateTrustDomainValues
  ) as Partial<TrustDomain>;
  return partialTrustDomainToTrustDomain(converted);
};

export const partialTrustDomainToTrustDomain = (
  partialTrustDomain: Partial<TrustDomain>
): TrustDomain => {
  return { ...createEmptyTrustDomain(), ...partialTrustDomain };
};

export const createEmptyTrustDomain = (): TrustDomain => {
  return {
    cn: "",
    dn: "",
    ipantflatname: "",
    ipanttrusteddomainsid: "",
    domain_enabled: false,
  };
};

/**
 * Validates if a string has SID format and limits
 * @param {string} sid - The SID to validate
 * @returns {boolean} - True if the SID is valid, false otherwise
 */
export const isValidSID = (sid: string): boolean => {
  // Clean spaces and force uppercase for security
  const cleanSid = sid.trim().toUpperCase();

  // 1. Basic structure: S-1-Authority-SubAuthorities (1 to 16 parts)
  const sidRegex = /^S-1(-[0-9]+){1,16}$/;
  if (!sidRegex.test(cleanSid)) return false;

  // Extract the numeric parts ignoring the "S" and the "1"
  const [, , authority, ...subAuthorities] = cleanSid.split("-");

  // 2. Validate Authority (Maximum 48 bits: 281,474,976,710,655)
  const authNum = parseInt(authority, 10);
  if (authNum > 281474976710655) return false;

  // 3. Validate Sub-Authorities (Maximum 32 bits: 4,294,967,295)
  for (const sa of subAuthorities) {
    const saNum = parseInt(sa, 10);
    if (saNum > 4294967295) return false;
  }

  return true;
};
