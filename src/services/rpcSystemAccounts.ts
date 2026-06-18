import { api, getCommand, FindRPCResponse } from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { SysAccount } from "../utils/datatypes/globalDataTypes";

/**
 * System accounts-related endpoints
 *
 * API commands:
 * - sysaccount_find: https://freeipa.readthedocs.io/en/latest/api/sysaccount_find.html
 * - sysaccount_show: https://freeipa.readthedocs.io/en/latest/api/sysaccount_show.html
 * - sysaccount_add: https://freeipa.readthedocs.io/en/latest/api/sysaccount_add.html
 * - sysaccount_del: https://freeipa.readthedocs.io/en/latest/api/sysaccount_del.html
 * - sysaccount_mod: https://freeipa.readthedocs.io/en/latest/api/sysaccount_mod.html
 */

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Search for system accounts
     * @param {string} searchValue - Search criteria
     * @returns {SysAccount[]} - List of system accounts
     */
    getSysaccounts: build.query<SysAccount[], string>({
      query: (searchValue) => {
        return getCommand({
          method: "sysaccount_find",
          params: [
            [searchValue],
            {
              version: API_VERSION_BACKUP,
              sizelimit: 100,
              all: true,
            },
          ],
        });
      },
      transformResponse: (response: FindRPCResponse): SysAccount[] => {
        const sysaccounts: SysAccount[] = [];
        const results = response.result.result as unknown as Record<
          string,
          unknown
        >[];
        for (const result of results) {
          sysaccounts.push({
            uid: (result.uid as string[])?.[0] || "",
            dn: result.dn as string,
            description: (result.description as string[])?.[0] || "",
          });
        }
        return sysaccounts;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetSysaccountsQuery } = extendedApi;
