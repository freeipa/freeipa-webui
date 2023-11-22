/* eslint-disable @typescript-eslint/no-explicit-any */
// RTK Query
import { SerializedError } from "@reduxjs/toolkit";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
// Utils
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  Host,
  Metadata,
  User,
  UIDType,
  fqdnType,
  IDPServer,
  RadiusServer,
  CertificateAuthority,
  PwPolicy,
  KrbPolicy,
} from "src/utils/datatypes/globalDataTypes";
import { apiToUser } from "src/utils/userUtils";
import { apiToPwPolicy } from "src/utils/pwPolicyUtils";
import { apiToKrbPolicy } from "src/utils/krbPolicyUtils";

export type UserFullData = {
  user?: Partial<User>;
  pwPolicy?: Partial<PwPolicy>;
  krbtPolicy?: Partial<KrbPolicy>;
  cert?: Record<string, unknown>;
};

export interface Query {
  data: FindRPCResponse | BatchRPCResponse | undefined;
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

export interface ShowRPCResponse {
  error: string;
  id: string;
  principal?: string;
  version?: string;
  result: Record<string, unknown>;
}

export interface BatchResult {
  result: Record<string, unknown>;
  count: number;
  truncated: boolean;
  summary: string;
  error: string | ErrorResult;
}

export interface BatchResponse {
  result: {
    results: BatchResult[];
  };
  error: string | ErrorResult;
  id: string;
  principal: string;
  version: string;
}

export interface ErrorResult {
  code: number;
  message: string;
  data: {
    attr: string;
    value: string;
  };
  name: string;
}

// 'FindRPCResponse' type
//   - Has 'result' > 'result' structure
export interface FindRPCResponse {
  error: string | ErrorResult;
  id: string;
  principal: string;
  version: string;
  result: {
    result: Record<string, unknown>; // General object type
    count: number;
    truncated: boolean;
    summary: string;
  };
}

// 'BatchRPCResponse' type
//   - Has 'result' > 'results' > 'result' structure
//   - More data under 'result'
export interface BatchRPCResponse {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: {
    count: number;
    totalCount: number;
    results: {
      result: Record<string, unknown>; // General object type
      truncated: boolean;
      summary: string;
    };
  };
}

export interface ListResponse {
  list: string[];
  count: number;
}

export interface CommandWithSingleParam {
  command: string;
  param: string;
}

export interface Command {
  method: string;
  params: any[];
}

export interface BatchCommand {
  batch: CommandWithSingleParam[];
}

// Basic Payload for getting lists of entries
export interface GenericPayload {
  method: string;
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
  user?: string;
  no_user?: string;
  startIdx: number;
  stopIdx: number;
  cn?: string;
  description?: string;
  timelimit?: number;
  objName?: string;
  objAttr?: string;
  sudocmd?: string;
  entryType?:
    | "user"
    | "stage"
    | "preserved"
    | "host"
    | "service"
    | "group"
    | "hostgroup"
    | "netgroup"
    | "usergroup"
    | "role"
    | "hbacrule"
    | "hbacsvc"
    | "hbacsvcgroup"
    | "sudorule"
    | "sudocmd"
    | "sudocmdgroup"
    | "idview";
}

export interface GetEntriesPayload {
  idList: string[];
  apiVersion: string;
  entryType?: "user" | "group" | "host" | "hostgroup" | "netgroup";
}

export interface MemberPayload {
  entryName: string;
  idsToAdd: string[];
  entityType: string;
}

export interface HostsPayload {
  searchValue: string;
  sizeLimit: number;
  apiVersion: string;
}

// Body data to perform the calls
export const getCommand = (commandData: Command) => {
  const payloadWithParams = {
    url: "ipa/session/json",
    method: "POST",
    body: {
      method: commandData.method,
      params: commandData.params,
    },
  };
  payloadWithParams.body.params[1].version = API_VERSION_BACKUP;
  return payloadWithParams;
};

export const getCommandNoVersion = (commandData: Command) => {
  const payloadWithParams = {
    url: "ipa/session/json",
    method: "POST",
    body: {
      method: commandData.method,
      params: commandData.params,
    },
  };
  return payloadWithParams;
};

export const getBatchCommand = (commandData: Command[], apiVersion: string) => {
  const payloadBatchParams = {
    url: "ipa/session/json",
    method: "POST",
    body: {
      method: "batch",
      params: [
        commandData,
        {
          version: apiVersion,
        },
      ],
    },
  };
  return payloadBatchParams;
};

// Endpoints that will be called from anywhere in the application.
// Two types:
//   - Queries: https://redux-toolkit.js.org/rtk-query/usage/queries
//   - Mutations: https://redux-toolkit.js.org/rtk-query/usage/mutations
// Endpoints can perform individual calls (e.g: `simpleCommand`), multiple commands
//   (e.g: `batchCommand`), and multiple commands executed sequentially in a single
//   endpoint (e.g: `gettingUser`)
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // TODO: Global settings!
  tagTypes: [
    "ObjectMetadata",
    "FullUser",
    "RadiusServer",
    "IdpServer",
    "CertificateAuthority",
    "ActiveUsers",
    "Hosts",
  ],
  endpoints: (build) => ({
    simpleCommand: build.query<FindRPCResponse, Command | void>({
      query: (payloadData: Command) => getCommand(payloadData),
    }),
    simpleMutCommand: build.mutation<
      FindRPCResponse | BatchRPCResponse,
      Command
    >({
      query: (payloadData: Command) => getCommand(payloadData),
    }),
    batchCommand: build.query<BatchRPCResponse, Command[] | void>({
      query: (payloadData: Command[], apiVersion?: string) =>
        getBatchCommand(payloadData, apiVersion || API_VERSION_BACKUP),
    }),
    batchMutCommand: build.mutation<BatchRPCResponse, Command[] | void>({
      query: (payloadData: Command[], apiVersion?: string) =>
        getBatchCommand(payloadData, apiVersion || API_VERSION_BACKUP),
    }),
    gettingUser: build.query<BatchRPCResponse, UsersPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion, userType } = payloadData;

        // 1ST CALL - GETTING ALL UIDS
        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // Prepare search parameters
        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };
        let method = "user_find";
        let show_method = "user_show";
        if (userType === "stage") {
          method = "stageuser_find";
          show_method = "stageuser_show";
        } else if (userType === "preserved") {
          params["preserved"] = true;
        }

        // Prepare payload
        const payloadDataUids: Command = {
          method: method,
          params: [[searchValue], params],
        };

        // Make call using 'fetchWithBQ'
        const getUidsResult = await fetchWithBQ(getCommand(payloadDataUids));
        // Return possible errors
        if (getUidsResult.error) {
          return { error: getUidsResult.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'uids'
        const uidResponseData = getUidsResult.data as FindRPCResponse;

        const uids: string[] = [];
        const itemsCount = uidResponseData.result.result.length as number;
        for (let i = 0; i < itemsCount; i++) {
          const userId = uidResponseData.result.result[i] as UIDType;
          const { uid } = userId;
          uids.push(uid[0] as string);
        }

        // 2ND CALL - GET PARTIAL USERS INFO
        // Prepare payload
        const options = { no_members: true };
        const payloadUserDataBatch: Command[] = uids.map((uid) => ({
          method: show_method,
          params: [[uid], options],
        }));

        // Make call using 'fetchWithBQ'
        const partialUsersInfoResult = await fetchWithBQ(
          getBatchCommand(payloadUserDataBatch as Command[], apiVersion)
        );

        // Return results
        return partialUsersInfoResult.data
          ? { data: partialUsersInfoResult.data as BatchRPCResponse }
          : {
              error:
                partialUsersInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
    getObjectMetadata: build.query<Metadata, void>({
      query: () => {
        return getCommand({
          method: "json_metadata",
          params: [
            [],
            {
              object: "all",
            },
          ],
        });
      },
      transformResponse: (response: ShowRPCResponse): Metadata =>
        response.result,
      providesTags: ["ObjectMetadata"],
    }),
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
    getHostsFullData: build.query<HostFullData, string>({
      query: (hostId) => {
        // Prepare search parameters
        const host_params = {
          all: true,
          rights: true,
        };

        const hostShowCommand: Command = {
          method: "host_show",
          params: [[hostId], host_params],
        };

        const certFindCommand: Command = {
          method: "cert_find",
          params: [[], { host: hostId, sizelimit: 0, all: true }],
        };

        const batchPayload: Command[] = [hostShowCommand, certFindCommand];

        return getBatchCommand(batchPayload, API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): HostFullData => {
        const [hostResponse, certResponse] = response.result.results;

        // Initialize user data (to prevent 'undefined' values)
        const hostData = hostResponse.result;
        const certData = certResponse.result;

        let hostObject = {};
        if (!hostResponse.error) {
          hostObject = apiToHost(hostData);
        }

        return {
          host: hostObject,
          cert: certData,
        };
      },
      providesTags: ["FullHost"],
    }),
    getServicesFullData: build.query<Service, string>({
      query: (serviceName: string) => {
        // Prepare search parameters
        const params = {
          all: true,
          rights: true,
          version: API_VERSION_BACKUP,
        };
        return getCommand({
          method: "service_show",
          params: [serviceName, params],
        });
      },
      transformResponse: (response: FindRPCResponse): Service => {
        return apiToService(response.result.result);
      },
      providesTags: ["FullService"],
    }),
    saveUser: build.mutation<FindRPCResponse, Partial<User>>({
      query: (user) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...user,
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
          ...user,
        };
        delete params["uid"];

        return getCommand({
          method: "stageuser_mod",
          params: [[user.uid], params],
        });
      },
      invalidatesTags: ["FullUser"],
    }),
    saveHost: build.mutation<FindRPCResponse, Partial<Host>>({
      query: (host) => {
        const params = {
          version: API_VERSION_BACKUP,
          ...host,
        };
        delete params["fqdn"];
        delete params["krbcanonicalname"];
        const fqdn = host.fqdn !== undefined ? host.fqdn : "";
        return getCommand({
          method: "host_mod",
          params: [[fqdn], params],
        });
      },
      invalidatesTags: ["FullHost"],
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
    removePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "user_remove_principal",
          params: params,
        });
      },
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
    addHostPrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "host_add_principal",
          params: params,
        });
      },
    }),
    removeHostPrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "host_remove_principal",
          params: params,
        });
      },
    }),
    addCertificate: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          { usercertificate: payload[1], version: API_VERSION_BACKUP },
        ];

        // Determine the method to use via the object type
        let method = "user_add_cert";
        if (payload[2] === "host") {
          method = "host_add_cert";
        } else if (payload[2] === "service") {
          method = "service_add_cert";
        }

        return getCommand({
          method: method,
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
    removeCertificate: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          { usercertificate: payload[1], version: API_VERSION_BACKUP },
        ];

        // Determine the method to use via the object type
        let method = "user_remove_cert";
        if (payload[2] === "host") {
          method = "host_remove_cert";
        } else if (payload[2] === "service") {
          method = "service_remove_cert";
        }

        return getCommand({
          method: method,
          params: params,
        });
      },
    }),
    getCertificateAuthority: build.query<CertificateAuthority[], void>({
      query: () => {
        return getCommand({
          method: "ca_find",
          params: [[null], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): CertificateAuthority[] =>
        response.result.result as unknown as CertificateAuthority[],
      providesTags: ["CertificateAuthority"],
    }),
    revokeCertificate: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            revocation_reason: payload[1],
            cacn: payload[2],
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "cert_revoke",
          params: params,
        });
      },
    }),
    removeHoldCertificate: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [
          [payload[0]],
          {
            cacn: payload[1],
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "cert_remove_hold",
          params: params,
        });
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
    addStagePrincipalAlias: build.mutation<FindRPCResponse, any[]>({
      query: (payload) => {
        const params = [payload, { version: API_VERSION_BACKUP }];

        return getCommand({
          method: "stageuser_add_principal",
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
    // Hosts
    gettingHost: build.query<BatchRPCResponse, HostsPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, apiVersion } = payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        // Prepare search parameters
        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: apiVersion,
        };

        // Prepare payload
        const payloadDataIds: Command = {
          method: "host_find",
          params: [[searchValue], params],
        };

        // Make call using 'fetchWithBQ'
        const getGroupIDsResult = await fetchWithBQ(getCommand(payloadDataIds));
        // Return possible errors
        if (getGroupIDsResult.error) {
          return { error: getGroupIDsResult.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'uids'
        const hostIdResponseData = getGroupIDsResult.data as FindRPCResponse;

        const fqdns: string[] = [];
        const itemsCount = hostIdResponseData.result.result.length as number;
        for (let i = 0; i < itemsCount; i++) {
          const hostId = hostIdResponseData.result.result[i] as fqdnType;
          const { fqdn } = hostId;
          fqdns.push(fqdn[0] as string);
        }

        // 2ND CALL - GET PARTIAL HOSTS INFO
        // Prepare payload
        const payloadHostDataBatch: Command[] = fqdns.map((fqdn) => ({
          method: "host_show",
          params: [[fqdn], {}],
        }));

        // Make call using 'fetchWithBQ'
        const partialHostsInfoResult = await fetchWithBQ(
          getBatchCommand(payloadHostDataBatch as Command[], apiVersion)
        );

        // Return results
        return partialHostsInfoResult.data
          ? { data: partialHostsInfoResult.data as BatchRPCResponse }
          : {
              error:
                partialHostsInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
    // Autommeber Users
    autoMemberRebuildUsers: build.mutation<FindRPCResponse, any[]>({
      query: (users) => {
        const paramArgs =
          users.length === 0
            ? { type: "group", version: API_VERSION_BACKUP }
            : {
                users: users.map((uid) => uid),
                version: API_VERSION_BACKUP,
              };

        return getCommand({
          method: "automember_rebuild",
          params: [[], paramArgs],
        });
      },
    }),
    // Automember Hosts
    autoMemberRebuildHosts: build.mutation<FindRPCResponse, any[]>({
      query: (hosts) => {
        const paramArgs =
          hosts.length === 0
            ? { type: "group", version: API_VERSION_BACKUP }
            : {
                hosts: hosts.map((fqdn) => fqdn),
                version: API_VERSION_BACKUP,
              };

        return getCommand({
          method: "automember_rebuild",
          params: [[], paramArgs],
        });
      },
    }),
    enableUser: build.mutation<FindRPCResponse, string>({
      query: (uid) => {
        const params = [
          [uid],
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
    disableUser: build.mutation<FindRPCResponse, string>({
      query: (uid) => {
        const params = [
          [uid],
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
  }),
});

export const {
  useSimpleCommandQuery,
  useSimpleMutCommandMutation,
  useBatchCommandQuery,
  useBatchMutCommandMutation,
  useGetObjectMetadataQuery,
  useGetGenericUsersFullDataQuery,
  useSaveUserMutation,
  useSaveStageUserMutation,
  useGetRadiusProxyQuery,
  useGetIdpServerQuery,
  useRemovePrincipalAliasMutation,
  useAddPrincipalAliasMutation,
  useAddCertificateMutation,
  useRemoveCertificateMutation,
  useGetCertificateAuthorityQuery,
  useRevokeCertificateMutation,
  useRemoveHoldCertificateMutation,
  useAddCertMapDataMutation,
  useRemoveCertMapDataMutation,
  useRemoveStagePrincipalAliasMutation,
  useAddStagePrincipalAliasMutation,
  useRemoveHostPrincipalAliasMutation,
  useAddHostPrincipalAliasMutation,
  useGetActiveUsersQuery,
  useGettingHostQuery,
  useAutoMemberRebuildHostsMutation,
  useAutoMemberRebuildUsersMutation,
  useEnableUserMutation,
  useDisableUserMutation,
  useUnlockUserMutation,
} = api;
