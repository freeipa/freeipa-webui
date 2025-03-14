// Data types
import { KrbTicket } from "./datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "src/utils/ipaObjectUtils";

export const asRecord = (
  element: Partial<KrbTicket>,
  onElementChange: (element: Partial<KrbTicket>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as KrbTicket);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "uid",
  "cn",
  "krbauthindmaxticketlife_otp",
  "krbauthindmaxrenewableage_otp",
  "krbauthindmaxticketlife_radius",
  "krbauthindmaxrenewableage_radius",
  "krbauthindmaxticketlife_pkinit",
  "krbauthindmaxrenewableage_pkinit",
  "krbauthindmaxticketlife_hardened",
  "krbauthindmaxrenewableage_hardened",
  "krbauthindmaxticketlife_idp",
  "krbauthindmaxticketlife_passkey",
  "krbauthindmaxrenewableage_passkey",
  "krbsubtrees",
  "krbsearchscope",
  "krbpwdpolicyreference",
  "krbmaxticketlife",
  "krbmaxrenewableage",
  "dn",
]);
const dateValues = new Set([]);

export function apiToKrbTicket(apiRecord: Record<string, unknown>): KrbTicket {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<KrbTicket>;
  return partialKrbTicketToKrbTicket(converted);
}

export function partialKrbTicketToKrbTicket(
  partialKrbTicket: Partial<KrbTicket>
) {
  return {
    ...createEmptyKrbTicket(),
    ...partialKrbTicket,
  };
}

export function createEmptyKrbTicket(): KrbTicket {
  return {
    uid: "",
    cn: "",
    krbauthindmaxticketlife_otp: "",
    krbauthindmaxrenewableage_otp: "",
    krbauthindmaxticketlife_radius: "",
    krbauthindmaxrenewableage_radius: "",
    krbauthindmaxticketlife_pkinit: "",
    krbauthindmaxrenewableage_pkinit: "",
    krbauthindmaxticketlife_hardened: "",
    krbauthindmaxrenewableage_hardened: "",
    krbauthindmaxticketlife_idp: "",
    krbauthindmaxrenewableage_idp: "",
    krbauthindmaxticketlife_passkey: "",
    krbauthindmaxrenewableage_passkey: "",
    objectclass: [],
    krbsubtrees: "",
    krbsearchscope: "",
    krbsupportedencsalttypes: [],
    krbdefaultencsalttypes: [],
    krbpwdpolicyreference: "",
    krbmaxticketlife: "",
    krbmaxrenewableage: "",
    aci: [],
    dn: "",
  };
}
