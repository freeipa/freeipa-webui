import { api, FindRPCResponse, getCommand } from "./rpc";
// utils
import { API_VERSION_BACKUP } from "../utils/utils";
import { KrbTicket } from "src/utils/datatypes/globalDataTypes";

/**
 * Password policies-related endpoints: useKrbtPolicyShowQuery, useKrbTicketModMutation
 *
 * API commands:
 * - krbtpolicy_show: https://freeipa.readthedocs.io/en/latest/api/krbtpolicy_show.html
 * - krbtpolicy_mod: https://freeipa.readthedocs.io/en/latest/api/krbtpolicy_mod.html
 */

export interface KrbTicketModPayload {
  krbauthindmaxticketlife_otp?: string;
  krbauthindmaxrenewableage_otp?: string;
  krbauthindmaxticketlife_radius?: string;
  krbauthindmaxrenewableage_radius?: string;
  krbauthindmaxticketlife_pkinit?: string;
  krbauthindmaxrenewableage_pkinit?: string;
  krbauthindmaxticketlife_hardened?: string;
  krbauthindmaxrenewableage_hardened?: string;
  krbauthindmaxticketlife_idp?: string;
  krbauthindmaxticketlife_passkey?: string;
  krbauthindmaxrenewableage_passkey?: string;
  krbsubtrees?: string;
  krbsearchscope?: string;
  krbpwdpolicyreference?: string;
  krbmaxticketlife?: string;
  krbmaxrenewableage?: string;
  krbauthindmaxrenewableage_idp?: string;
}

const assignParameters = (
  parametersList: string[],
  payload: KrbTicketModPayload
) => {
  const params = {
    all: true,
    rights: true,
    version: API_VERSION_BACKUP,
  };

  parametersList.forEach((parameter) => {
    if (payload[parameter]) {
      params[parameter] = payload[parameter];
    }
  });
  return params;
};

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get the list of Kerberos tickets
     * @param void
     * @returns KrbTicket
     */
    KrbtPolicyShow: build.query<KrbTicket, void>({
      query: () => {
        return getCommand({
          method: "krbtpolicy_show",
          params: [
            [],
            { all: true, rights: true, version: API_VERSION_BACKUP },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse) => {
        return response.result.result as unknown as KrbTicket;
      },
    }),
    /**
     * Update Kerberos ticket policy
     * @param payload krbTicketModPayload
     * @returns FindRPCResponse
     */
    krbTicketMod: build.mutation<FindRPCResponse, KrbTicketModPayload>({
      query: (payload) => {
        const params = assignParameters(
          [
            "krbmaxrenewableage",
            "krbmaxticketlife",
            "krbauthindmaxrenewableage_radius",
            "krbauthindmaxticketlife_radius",
            "krbauthindmaxrenewableage_otp",
            "krbauthindmaxticketlife_otp",
            "krbauthindmaxrenewableage_pkinit",
            "krbauthindmaxticketlife_pkinit",
            "krbauthindmaxrenewableage_hardened",
            "krbauthindmaxticketlife_hardened",
            "krbauthindmaxticketlife_idp",
            "krbauthindmaxticketlife_passkey",
            "krbauthindmaxrenewableage_passkey",
            "krbauthindmaxrenewableage_idp",
          ],
          payload
        );

        return getCommand({
          method: "krbtpolicy_mod",
          params: [[""], params],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const { useKrbtPolicyShowQuery, useKrbTicketModMutation } = extendedApi;
