/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchResponse,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
} from "./rpc";
import { apiToUser, userToApi } from "../utils/userUtils";
import { apiToPwPolicy } from "../utils/pwPolicyUtils";
import { apiToKrbPolicy } from "../utils/krbPolicyUtils";
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  KrbPolicy,
  PwPolicy,
  User,
  RadiusServer,
  IDPServer,
} from "../utils/datatypes/globalDataTypes";

/**
 * Users-related endpoints: getGenericUsersFullData, getUserByUid, saveUser, saveStageUser,
 *   addPrincipalAlias, removePrincipalAlias, addStagePrincipalAlias, removeStagePrincipalAlias,
 *   getActiveUsers, autoMemberRebuildUsers, enableUser, disableUser, unlockUser, activateUser,
 *   restoreUser, addCertMapData, removeCertMapData, changePassword, generateSubIds, addOtpToken,
 *   getRadiusProxy, getIdpServer
 *
 * API commands:
 * - user_show: https://freeipa.readthedocs.io/en/latest/api/user_show.html
 * - stageuser_show: https://freeipa.readthedocs.io/en/latest/api/stageuser_show.html
 * - pwpolicy_show: https://freeipa.readthedocs.io/en/latest/api/pwpolicy_show.html
 * - krbtpolicy_show: https://freeipa.readthedocs.io/en/latest/api/krbtpolicy_show.html
 * - cert_find: https://freeipa.readthedocs.io/en/latest/api/cert_find.html
 * - user_mod: https://freeipa.readthedocs.io/en/latest/api/user_mod.html
 * - stageuser_mod: https://freeipa.readthedocs.io/en/latest/api/stageuser_mod.html
 * - user_add_principal: https://freeipa.readthedocs.io/en/latest/api/user_add_principal.html
 * - user_remove_principal: https://freeipa.readthedocs.io/en/latest/api/user_remove_principal.html
 * - addStagePrincipalAlias: https://freeipa.readthedocs.io/en/latest/api/addStagePrincipalAlias.html
 * - stageuser_remove_principal: https://freeipa.readthedocs.io/en/latest/api/stageuser_remove_principal.html
 * - user_find: https://freeipa.readthedocs.io/en/latest/api/user_find.html
 * - automember_rebuild: https://freeipa.readthedocs.io/en/latest/api/automember_rebuild.html
 * - user_enable: https://freeipa.readthedocs.io/en/latest/api/user_enable.html
 * - user_disable: https://freeipa.readthedocs.io/en/latest/api/user_disable.html
 * - user_unlock: https://freeipa.readthedocs.io/en/latest/api/user_unlock.html
 * - stageuser_activate: https://freeipa.readthedocs.io/en/latest/api/stageuser_activate.html
 * - user_undel: https://freeipa.readthedocs.io/en/latest/api/user_undel.html
 * - user_add_certmapdata: https://freeipa.readthedocs.io/en/latest/api/user_add_certmapdata.html
 * - user_remove_certmapdata: https://freeipa.readthedocs.io/en/latest/api/user_remove_certmapdata.html
 * - passwd: https://freeipa.readthedocs.io/en/latest/api/passwd.html
 * - generateSubIds: https://freeipa.readthedocs.io/en/latest/api/generateSubIds.html
 * - otptoken_add: https://freeipa.readthedocs.io/en/latest/api/otptoken_add.html
 * - radiusproxy_find: https://freeipa.readthedocs.io/en/latest/api/radiusproxy_find.html
 * - idp_find: https://freeipa.readthedocs.io/en/latest/api/idp_find.html
 */

type UserFullData = {
  user?: Partial<User>;
  pwPolicy?: Partial<PwPolicy>;
  krbtPolicy?: Partial<KrbPolicy>;
  cert?: Record<string, unknown>;
};

export interface PasswordChangePayload {
  uid: string;
  password: string;
  currentPassword?: string;
  otp?: string;
}

interface UserGetInfoPayload {
  uidsList: string[];
  noMembers?: boolean;
}

interface PasswordChangePayloadParams {
  password: string;
  current_password?: string;
  otp?: string;
  version: string;
}

interface UserFindPayload {
  uid: string | null;
  noMembers?: boolean;
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGenericUsersFullData: build.query<UserFullData, object>({
      query: (query_args) => {
        // Prepare search parameters
        const user_params = {
          all: true,
          rights: true,
        };
        let method = "user_show";
        if (query_args["user_type"] === "stage") {
          // Preserved users work with user_show, but not stage users
          method = "stageuser_show";
        }
        const userShowCommand: Command = {
          method: method,
          params: [query_args["userId"], user_params],
        };

        const pwpolicyShowCommand: Command = {
          method: "pwpolicy_show",
          params: [
            [],
            { user: query_args["userId"][0], all: true, rights: true },
          ],
        };

        const krbtpolicyShowCommand: Command = {
          method: "krbtpolicy_show",
          params: [query_args["userId"], { all: true, rights: true }],
        };

        const certFindCommand: Command = {
          method: "cert_find",
          params: [
            [],
            { user: query_args["userId"][0], sizelimit: 0, all: true },
          ],
        };

        const batchPayload: Command[] = [
          userShowCommand,
          pwpolicyShowCommand,
          krbtpolicyShowCommand,
          certFindCommand,
        ];

        return getBatchCommand(
          batchPayload,
          query_args["version"] || API_VERSION_BACKUP
        );
      },
      transformResponse: (response: BatchResponse): UserFullData => {
        const [
          userResponse,
          pwPolicyResponse,
          krbtPolicyResponse,
          certResponse,
        ] = response.result.results;

        // Initialize user data (to prevent 'undefined' values)
        const userData = userResponse.result;
        const pwPolicyData = pwPolicyResponse.result;
        const krbtPolicyData = krbtPolicyResponse.result;
        const certData = certResponse.result;

        let userObject = {};
        if (!userResponse.error) {
          userObject = apiToUser(userData);
        }

        let pwPolicyObject = {};
        if (!pwPolicyResponse.error) {
          pwPolicyObject = apiToPwPolicy(pwPolicyData);
        }

        let krbtPolicyObject = {};
        if (!krbtPolicyResponse.error) {
          krbtPolicyObject = apiToKrbPolicy(krbtPolicyData);
        }

        return {
          user: userObject,
          pwPolicy: pwPolicyObject,
          krbtPolicy: krbtPolicyObject,
          cert: certData,
        };
      },
      providesTags: ["FullUser"],
    }),
    getUserByUid: build.query<User, string>({
      query: (uid) => {
        return getCommand({
          method: "user_show",
          params: [[uid], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): User =>
        apiToUser(response.result.result),
    }),
    saveUser: build.mutation<FindRPCResponse, Partial<User>>({
      query: (user) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...userToApi(user),
        };

        delete params["uid"];

        return getCommand({
          method: "user_mod",
          params: [[user.uid], params],
        });
      },
      invalidatesTags: ["FullUser"],
    }),
    saveStageUser: build.mutation<FindRPCResponse, Partial<User>>({
      query: (user) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...userToApi(user),
        };
        delete params["uid"];

        return getCommand({
          method: "stageuser_mod",
          params: [[user.uid], params],
        });
      },
      invalidatesTags: ["FullUser"],
    }),
    addPrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "user_add_principal",
          params: params,
        });
      },
    }),
    removePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "user_remove_principal",
          params: params,
        });
      },
    }),
    addStagePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "stageuser_add_principal",
          params: params,
        });
      },
    }),
    removeStagePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "stageuser_remove_principal",
          params: params,
        });
      },
    }),
    getActiveUsers: build.query<User[], void>({
      query: () => {
        return getCommand({
          method: "user_find",
          params: [[null], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): User[] =>
        response.result.result as unknown as User[],
      providesTags: ["ActiveUsers"],
    }),
    // Automember Users
    autoMemberRebuildUsers: build.mutation<FindRPCResponse, string[]>({
      query: (users) => {
        const paramArgs =
          users.length === 0
            ? // from user's main page
              { type: "group", version: API_VERSION_BACKUP }
            : // from user's settings page
              {
                users: users,
                version: API_VERSION_BACKUP,
              };

        return getCommand({
          method: "automember_rebuild",
          params: [[], paramArgs],
        });
      },
    }),
    enableUser: build.mutation<FindRPCResponse, User>({
      query: (user) => {
        const params = [
          [user.uid],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "user_enable",
          params: params,
        });
      },
    }),
    disableUser: build.mutation<FindRPCResponse, User>({
      query: (user) => {
        const params = [
          [user.uid],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "user_disable",
          params: params,
        });
      },
    }),
    unlockUser: build.mutation<FindRPCResponse, string>({
      query: (uid) => {
        const params = [
          [uid],
          {
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "user_unlock",
          params: params,
        });
      },
    }),
    activateUser: build.mutation<FindRPCResponse, User[]>({
      query: (query_args) => {
        const batchPayload: Command[] = [];
        query_args.map((user) => {
          let id = user.uid;
          if (Array.isArray(user.uid)) {
            id = user.uid[0];
          }
          batchPayload.push({
            method: "stageuser_activate",
            params: [[id], {}],
          });
        });

        return getBatchCommand(
          batchPayload,
          query_args["version"] || API_VERSION_BACKUP
        );
      },
    }),
    restoreUser: build.mutation<BatchRPCResponse, User[]>({
      query: (query_args) => {
        const batchPayload: Command[] = [];
        query_args.map((user) => {
          let id = user.uid;
          if (Array.isArray(user.uid)) {
            id = user.uid[0];
          }
          batchPayload.push({
            method: "user_undel",
            params: [[id], {}],
          });
        });

        return getBatchCommand(
          batchPayload,
          query_args["version"] || API_VERSION_BACKUP
        );
      },
    }),
    addCertMapData: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        return getCommand({
          method: "user_add_certmapdata",
          params: payload,
        });
      },
    }),
    removeCertMapData: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        return getCommand({
          method: "user_remove_certmapdata",
          params: payload,
        });
      },
    }),
    changePassword: build.mutation<FindRPCResponse, PasswordChangePayload>({
      query: (payload) => {
        let payloadArgs: PasswordChangePayloadParams = {
          password: payload.password,
          version: API_VERSION_BACKUP,
        };

        // Add optional parameters if they exist
        if (payload.currentPassword !== undefined) {
          payloadArgs = {
            ...payloadArgs,
            current_password: payload.currentPassword,
          };
        }

        if (payload.otp !== undefined) {
          payloadArgs = {
            ...payloadArgs,
            otp: payload.otp,
          };
        }

        const params = [[payload.uid], payloadArgs];

        return getCommand({
          method: "passwd",
          params: params,
        });
      },
    }),
    generateSubIds: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [[], payload[0]];

        return getCommand({
          method: "subid_generate",
          params: params,
        });
      },
      invalidatesTags: ["FullUser"],
    }),
    addOtpToken: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload[0], payload[1]];

        return getCommand({
          method: "otptoken_add",
          params: params,
        });
      },
    }),
    getRadiusProxy: build.query<RadiusServer[], void>({
      query: () => {
        return getCommand({
          method: "radiusproxy_find",
          params: [[null], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): RadiusServer[] =>
        response.result.result as unknown as RadiusServer[],
      providesTags: ["RadiusServer"],
    }),
    getIdpServer: build.query<IDPServer[], void>({
      query: () => {
        return getCommand({
          method: "idp_find",
          params: [[null], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): IDPServer[] =>
        response.result.result as unknown as IDPServer[],
      providesTags: ["IdpServer"],
    }),
    /**
     * Given a list of user IDs, show the full data of those users
     * @param {UserGetInfoPayload} - Payload with user IDs and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getUsersInfoByUid: build.query<User[], UserGetInfoPayload>({
      query: (payload) => {
        const uidsList = payload.uidsList;
        const noMembers = payload.noMembers;

        const userShowCommands: Command[] = uidsList.map((uid) => ({
          method: "user_show",
          params: [[uid], { no_members: noMembers }],
        }));
        return getBatchCommand(userShowCommands, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchRPCResponse): User[] => {
        const userList: User[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const userData = apiToUser(results[i].result);
          userList.push(userData);
        }
        return userList;
      },
    }),
    getUserDetailsByUid: build.mutation<FindRPCResponse, string>({
      query: (uid) => {
        return getCommand({
          method: "user_show",
          params: [[uid], { version: API_VERSION_BACKUP }],
        });
      },
    }),
    userFind: build.query<User[], UserFindPayload>({
      query: (payload) => {
        // Add noMembers option if it exists
        let params = {};
        if (payload.noMembers) {
          params = {
            no_members: payload.noMembers,
            version: API_VERSION_BACKUP,
          };
        } else {
          params = {
            version: API_VERSION_BACKUP,
          };
        }

        const command = {
          method: "user_find",
          params: [[payload.uid], params],
        };

        return getCommand(command);
      },
      transformResponse: (response: FindRPCResponse): User[] => {
        if (
          response.result.result.length === 0 ||
          response.result.result === undefined
        ) {
          return [] as User[];
        } else {
          const result = response.result.result as unknown as User[];
          const usersList = result.map((user) => apiToUser(user));
          return usersList;
        }
      },
    }),
  }),
  overrideExisting: false,
});

// Active Users
export const useGettingActiveUserQuery = (payloadData) => {
  payloadData["objName"] = "user";
  payloadData["objAttr"] = "uid";
  return useGettingGenericQuery(payloadData);
};
// Stage Users
export const useGettingStageUserQuery = (payloadData) => {
  payloadData["objName"] = "stageuser";
  payloadData["objAttr"] = "uid";
  return useGettingGenericQuery(payloadData);
};
// Preserved users
export const useGettingPreservedUserQuery = (payloadData) => {
  payloadData["objName"] = "preserved";
  payloadData["objAttr"] = "uid";
  return useGettingGenericQuery(payloadData);
};
// Full search wrappers
export const useGetUsersFullQuery = (userId: string) => {
  // Active and preserved users
  const query_args = {
    userId: [userId],
    user_type: "active",
    version: API_VERSION_BACKUP,
  };
  return useGetGenericUsersFullDataQuery(query_args);
};

export const useGetStageUsersFullQuery = (userId: string) => {
  const query_args = {
    userId: [userId],
    user_type: "stage",
    version: API_VERSION_BACKUP,
  };
  return useGetGenericUsersFullDataQuery(query_args);
};

export const {
  useSaveUserMutation,
  useSaveStageUserMutation,
  useRemovePrincipalAliasMutation,
  useAddPrincipalAliasMutation,
  useAddStagePrincipalAliasMutation,
  useRemoveStagePrincipalAliasMutation,
  useGetActiveUsersQuery,
  useAutoMemberRebuildUsersMutation,
  useEnableUserMutation,
  useDisableUserMutation,
  useUnlockUserMutation,
  useActivateUserMutation,
  useRestoreUserMutation,
  useGetUserByUidQuery,
  useGetGenericUsersFullDataQuery,
  useAddCertMapDataMutation,
  useRemoveCertMapDataMutation,
  useChangePasswordMutation,
  useGenerateSubIdsMutation,
  useAddOtpTokenMutation,
  useGetRadiusProxyQuery,
  useGetIdpServerQuery,
  useGetUsersInfoByUidQuery,
  useGetUserDetailsByUidMutation,
  useUserFindQuery,
} = extendedApi;
