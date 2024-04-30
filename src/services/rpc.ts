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
  CertificateAuthority,
  fqdnType,
  Host,
  IDPServer,
  KrbPolicy,
  CertProfile,
  Metadata,
  PwPolicy,
  RadiusServer,
  servicesType,
  UIDType,
  User,
  Service,
  cnType,
  UserGroup,
  Netgroup,
  roleType,
  Role,
  HBACRule,
} from "../utils/datatypes/globalDataTypes";
import { apiToHost } from "../utils/hostUtils";
import { apiToUser } from "../utils/userUtils";
import { apiToService } from "../utils/serviceUtils";
import { apiToPwPolicy } from "../utils/pwPolicyUtils";
import { apiToKrbPolicy } from "../utils/krbPolicyUtils";
import { apiToGroup } from "src/utils/groupUtils";
import { apiToNetgroup } from "src/utils/netgroupsUtils";
import { apiToRole } from "src/utils/rolesUtils";
import { apiToHBACRule } from "src/utils/hbacRulesUtils";

export type UserFullData = {
  user?: Partial<User>;
  pwPolicy?: Partial<PwPolicy>;
  krbtPolicy?: Partial<KrbPolicy>;
  cert?: Record<string, unknown>;
};

export type HostFullData = {
  host?: Partial<Host>;
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
  entryType?:
    | "user"
    | "stage"
    | "preserved"
    | "host"
    | "service"
    | "group"
    | "netgroups"
    | "role"
    | "hbacRule";
}

export interface GroupShowPayload {
  groupNamesList: string[];
  no_members?: boolean;
  version: string;
}

export interface NetgroupShowPayload {
  netgroupNamesList: string[];
  no_members?: boolean;
  version: string;
}

export interface RoleShowPayload {
  roleNamesList: string[];
  no_members?: boolean;
  version: string;
}

export interface HbacRulesShowPayload {
  hbacRuleNamesList: string[];
  no_members: boolean | true;
  version: string;
}

export interface HostAddPayload {
  fqdn: string;
  userclass?: string;
  ip_address?: string;
  force: boolean; // skip DNS check
  random: boolean; // otp generation
  description?: string;
}

export interface HBACRulePayload {
  no_members: boolean | true;
  cn?: string;
  accessruletype?: "allow" | "deny";
  usercategory?: "all";
  hostcategory?: "all";
  sourcehostcategory?: "all";
  servicecategory?: "all";
  description: string;
  ipaenabledflag?: boolean;
  externalhost?: string;
  timelimit?: number;
  sizelimit?: number;
}

export interface ServiceAddPayload {
  service: string;
  skip_host_check: boolean;
  force: boolean; // skip DNS check
}

export interface KeyTabPayload {
  id: string;
  entryType: "user" | "host" | "usergroup" | "hostgroup";
  entries: string[];
  method: string;
}

export interface GetEntriesPayload {
  idList: string[];
  apiVersion: string;
  entryType?: "user" | "group" | "host" | "hostgroup";
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

// Payload needed to change password
export interface PasswordChangePayload {
  uid: string;
  password: string;
}

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
    "CertProfile",
    "DNSZones",
    "FullHost",
    "FullService",
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
    // Basic find/show query: Hosts, Services, ...
    gettingGeneric: build.query<BatchRPCResponse, GenericPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const {
          searchValue,
          sizeLimit,
          apiVersion,
          user,
          no_user,
          startIdx,
          stopIdx,
          cn,
          description,
          timelimit,
          objAttr,
        } = payloadData;
        let objName = payloadData.objName;

        if (objAttr === undefined || objName === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "Missing required param",
            } as FetchBaseQueryError,
          };
        }

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

        if (objName === "group" || objName === "netgroup") {
          if (user !== undefined) {
            params["user"] = user;
          } else if (no_user !== undefined) {
            params["no_user"] = no_user;
          }
        }

        if (objName === "preserved") {
          params["preserved"] = true;
          objName = "user";
        }

        if (objName === "role") {
          if (cn) {
            params["cn"] = cn;
          }
          if (description) {
            params["description"] = description;
          }
          if (timelimit) {
            params["timelimit"] = timelimit;
          }
        }

        if (objName === "hbacRule") {
          if (description) {
            params["description"] = description;
          }
          if (timelimit) {
            params["timelimit"] = timelimit;
          }
        }

        // Prevent searchValue to be null
        let parsedSearchValue = searchValue;
        if (searchValue === null || searchValue === undefined) {
          parsedSearchValue = "";
        }

        // Prepare payload
        const payloadDataIds: Command = {
          method: objName + "_find",
          params: [[parsedSearchValue], params],
        };

        // Make call using 'fetchWithBQ'
        const getGroupIDsResult = await fetchWithBQ(getCommand(payloadDataIds));
        // Return possible errors
        if (getGroupIDsResult.error) {
          return { error: getGroupIDsResult.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'uids'
        const idResponseData = getGroupIDsResult.data as FindRPCResponse;
        const ids: string[] = [];
        const itemsCount = idResponseData.result.result.length as number;
        for (let i = startIdx; i < itemsCount && i < stopIdx; i++) {
          let id;
          if (objName === "host") {
            id = idResponseData.result.result[i] as fqdnType;
          } else if (objName === "service") {
            id = idResponseData.result.result[i] as servicesType;
          } else if (objName === "user" || objName === "stageuser") {
            id = idResponseData.result.result[i] as UIDType;
          } else if (objName === "group" || objName === "netgroup") {
            id = idResponseData.result.result[i] as cnType;
          } else if (objName === "role") {
            id = idResponseData.result.result[i] as roleType;
          } else if (objName === "hbacRule") {
            id = idResponseData.result.result[i] as cnType;
          } else {
            // Unknown, should never happen
            return {
              error: {
                status: "CUSTOM_ERROR",
                data: "",
                error: "Unknown object name " + objName,
              } as FetchBaseQueryError,
            };
          }
          ids.push(id[objAttr][0] as string);
        }

        // 2ND CALL - GET PARTIAL INFO
        // Prepare payload
        const payloadDataBatch: Command[] = ids.map((name) => ({
          method: objName + "_show",
          params: [[name], { no_members: true }],
        }));

        // Make call using 'fetchWithBQ'
        const partialInfoResult = await fetchWithBQ(
          getBatchCommand(payloadDataBatch as Command[], apiVersion)
        );

        const response = partialInfoResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = itemsCount;
        }

        // Return results
        return response
          ? { data: response }
          : {
              error: partialInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
    // Refresh entries by search value (mutation instead of query)
    searchEntries: build.mutation<BatchRPCResponse, GenericPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const {
          searchValue,
          sizeLimit,
          apiVersion,
          startIdx,
          stopIdx,
          entryType,
        } = payloadData;

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
          all: true,
        };

        let method = "";
        let show_method = "";
        if (entryType === "user") {
          method = "user_find";
          show_method = "user_show";
        } else if (entryType === "stage") {
          method = "stageuser_find";
          show_method = "stageuser_show";
        } else if (entryType === "preserved") {
          method = "user_find";
          show_method = "user_show";
          params["preserved"] = true;
        } else if (entryType === "host") {
          method = "host_find";
          show_method = "host_show";
        } else if (entryType === "service") {
          method = "service_find";
          show_method = "service_show";
        }

        // Prepare payload
        const payloadDataIds: Command = {
          method: method,
          params: [[searchValue], params],
        };

        // Make call using 'fetchWithBQ'
        const getGroupIDsResult = await fetchWithBQ(getCommand(payloadDataIds));
        // Return possible errors
        if (getGroupIDsResult.error) {
          return { error: getGroupIDsResult.error as FetchBaseQueryError };
        }
        // If no error: cast and assign 'ids'
        const responseData = getGroupIDsResult.data as FindRPCResponse;

        const ids: string[] = [];
        const itemsCount = responseData.result.result.length as number;
        for (let i = startIdx; i < itemsCount && i < stopIdx; i++) {
          if (
            entryType === "user" ||
            entryType === "stage" ||
            entryType === "preserved"
          ) {
            const userId = responseData.result.result[i] as UIDType;
            const { uid } = userId;
            ids.push(uid[0] as string);
          } else if (entryType === "host") {
            const hostId = responseData.result.result[i] as fqdnType;
            const { fqdn } = hostId;
            ids.push(fqdn[0] as string);
          } else if (entryType === "service") {
            const serviceId = responseData.result.result[i] as servicesType;
            const { krbprincipalname } = serviceId;
            ids.push(krbprincipalname[0] as string);
          }
        }

        // 2ND CALL - GET PARTIAL INFO
        // Prepare payload
        const payloadDataBatch: Command[] = ids.map((id) => ({
          method: show_method,
          params: [[id], { no_members: true }],
        }));

        // Make call using 'fetchWithBQ'
        const partialInfoResult = await fetchWithBQ(
          getBatchCommand(payloadDataBatch as Command[], apiVersion)
        );

        const response = partialInfoResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = itemsCount;
        }

        // Return results
        return response
          ? { data: response }
          : {
              error: partialInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
    // Take a list of ID's and get the full entries
    getEntries: build.mutation<BatchRPCResponse, GetEntriesPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { idList, apiVersion, entryType } = payloadData;

        if (apiVersion === undefined) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "API version not available",
            } as FetchBaseQueryError,
          };
        }

        let show_method = "";
        if (entryType === "user") {
          show_method = "user_show";
        } else if (entryType === "host") {
          show_method = "host_show";
        } else if (entryType === "hostgroup") {
          show_method = "hostgroup_show";
        } else {
          // user group
          show_method = "group_show";
        }

        const payloadDataBatch: Command[] = idList.map((id) => ({
          method: show_method,
          params: [[id], { no_members: true }],
        }));

        // Make call using 'fetchWithBQ'
        const partialInfoResult = await fetchWithBQ(
          getBatchCommand(payloadDataBatch as Command[], apiVersion)
        );

        const response = partialInfoResult.data as BatchRPCResponse;
        if (response) {
          response.result.totalCount = idList.length;
        }

        // Return results
        return response
          ? { data: response }
          : {
              error: partialInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
    getIDList: build.mutation<ListResponse, GenericPayload>({
      async queryFn(payloadData, _queryApi, _extraOptions, fetchWithBQ) {
        const { searchValue, sizeLimit, startIdx, stopIdx, entryType } =
          payloadData;

        // Prepare search parameters
        const params = {
          pkey_only: true,
          sizelimit: sizeLimit,
          version: API_VERSION_BACKUP,
          all: true,
        };

        let method = "";
        if (entryType === "user") {
          method = "user_find";
        } else if (entryType === "stage") {
          method = "stageuser_find";
        } else if (entryType === "preserved") {
          method = "user_find";
          params["preserved"] = true;
        } else if (entryType === "host") {
          method = "host_find";
        } else if (entryType === "service") {
          method = "service_find";
        } else {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "Unknown entry type",
            } as FetchBaseQueryError,
          };
        }

        // Prepare payload
        const payloadDataIds: Command = {
          method: method,
          params: [[searchValue], params],
        };

        // Make call using 'fetchWithBQ'
        const getGroupIDsResult = await fetchWithBQ(getCommand(payloadDataIds));
        // Return possible errors
        if (getGroupIDsResult.error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: "",
              error: "Failed to search for entries",
            } as FetchBaseQueryError,
          };
        }
        // If no error: cast and assign 'ids'
        const responseData = getGroupIDsResult.data as FindRPCResponse;

        const ids: string[] = [];
        const itemsCount = responseData.result.result.length as number;
        for (let i = startIdx; i < itemsCount && i < stopIdx; i++) {
          if (entryType === "user") {
            const userId = responseData.result.result[i] as UIDType;
            const { uid } = userId;
            ids.push(uid[0] as string);
          } else if (entryType === "host") {
            const hostId = responseData.result.result[i] as fqdnType;
            const { fqdn } = hostId;
            ids.push(fqdn[0] as string);
          } else if (entryType === "service") {
            const serviceId = responseData.result.result[i] as servicesType;
            const { krbprincipalname } = serviceId;
            ids.push(krbprincipalname[0] as string);
          }
        }

        const result = { list: ids, count: itemsCount } as ListResponse;

        return { data: result };
      },
    }),
    // Autommeber Users
    autoMemberRebuildUsers: build.mutation<FindRPCResponse, any[]>({
      query: (users) => {
        let user_list = users.map((user) => user.uid);
        // user.uid might be an array
        if (users.length > 0 && Array.isArray(users[0].uid)) {
          user_list = users.map((user) => user.uid[0]);
        }

        const paramArgs =
          users.length === 0
            ? { type: "group", version: API_VERSION_BACKUP }
            : {
                users: user_list,
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
    changePassword: build.mutation<FindRPCResponse, PasswordChangePayload>({
      query: (payload) => {
        const params = [
          [payload.uid],
          {
            password: payload.password,
            version: API_VERSION_BACKUP,
          },
        ];

        return getCommand({
          method: "passwd",
          params: params,
        });
      },
    }),
    addHost: build.mutation<FindRPCResponse, HostAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["fqdn"]],
          {
            version: API_VERSION_BACKUP,
            userclass: payloadData["userclass"],
            ip_address: payloadData["ip_address"],
            force: payloadData["force"],
            description: payloadData["description"],
            random: payloadData["random"],
          },
        ];
        return getCommand({
          method: "host_add",
          params: params,
        });
      },
    }),
    addService: build.mutation<FindRPCResponse, ServiceAddPayload>({
      query: (payloadData) => {
        const params = [
          [payloadData["service"]],
          {
            version: API_VERSION_BACKUP,
            force: payloadData["force"],
            skip_host_check: payloadData["skip_host_check"],
          },
        ];
        return getCommand({
          method: "service_add",
          params: params,
        });
      },
    }),
    getCertProfile: build.query<CertProfile[], void>({
      query: () => {
        return getCommand({
          method: "certprofile_find",
          params: [[null], { version: API_VERSION_BACKUP }],
        });
      },
      transformResponse: (response: FindRPCResponse): CertProfile[] =>
        response.result.result as unknown as CertProfile[],
      providesTags: ["CertProfile"],
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
    removeHosts: build.mutation<BatchRPCResponse, Host[]>({
      query: (hosts) => {
        const hostsToDeletePayload: Command[] = [];
        hosts.map((host) => {
          const payloadItem = {
            method: "host_del",
            params: [[host.fqdn[0]], {}],
          } as Command;
          hostsToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(hostsToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    removeServices: build.mutation<BatchRPCResponse, Service[]>({
      query: (services) => {
        const servicesToDeletePayload: Command[] = [];
        services.map((service) => {
          const payloadItem = {
            method: "service_del",
            params: [[service.krbcanonicalname], {}],
          } as Command;
          servicesToDeletePayload.push(payloadItem);
        });
        return getBatchCommand(servicesToDeletePayload, API_VERSION_BACKUP);
      },
    }),
    getGenericList: build.query<FindRPCResponse, string>({
      query: (objName) => {
        return getCommand({
          method: objName + "_find",
          params: [[], { version: API_VERSION_BACKUP }],
        });
      },
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
    updateKeyTab: build.mutation<FindRPCResponse, KeyTabPayload>({
      query: (payload: KeyTabPayload) => {
        const params = { version: API_VERSION_BACKUP };
        if (payload.entryType === "user") {
          params["user"] = payload.entries;
        } else if (payload.entryType === "host") {
          params["host"] = payload.entries;
        } else if (payload.entryType === "usergroup") {
          params["group"] = payload.entries;
        } else {
          // hostgroup
          params["hostgroup"] = payload.entries;
        }

        return getCommand({
          method: payload.method,
          params: [[payload.id], params],
        });
      },
    }),
    /**
     * Add entity to groups
     * @param {string} toId - ID of the entity to add to groups
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the groups
     */
    addToGroups: build.mutation<BatchRPCResponse, [string, string, string[]]>({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToAdd: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "group_add_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    removeFromGroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const groupNames = payload[2];
        const membersToRemove: Command[] = [];
        groupNames.map((groupName) => {
          const payloadItem = {
            method: "group_remove_member",
            params: [[groupName], { [memberType]: memberId }],
          } as Command;
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of group names, show the full data of those groups
     * @param {string[]} groupNames - List of group names
     * @param {boolean} noMembers - Whether to show members or not
     * @returns {BatchRPCResponse} - Batch response
     */
    getGroupInfoByName: build.query<UserGroup[], GroupShowPayload>({
      query: (payload) => {
        const groupNames = payload.groupNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const groupShowCommands: Command[] = groupNames.map((groupName) => ({
          method: "group_show",
          params: [[groupName], { no_members: noMembers }],
        }));
        return getBatchCommand(groupShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): UserGroup[] => {
        const groupList: UserGroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const groupData = apiToGroup(results[i].result);
          groupList.push(groupData);
        }
        return groupList;
      },
    }),
    /**
     * Add entity to netgroups
     * @param {string} toId - ID of the entity to add to netgroups
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the netgroups
     */
    addToNetgroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const netgroupNames = payload[2];
        const membersToAdd: Command[] = [];
        netgroupNames.map((netgroupName) => {
          const payloadItem = {
            method: "netgroup_add_member",
            params: [[netgroupName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    /**
     * Delete entity from netgroups
     * @param {string} memberId - ID of the entity to remove from netgroups
     * @param {string} memberType - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} netgroupNames - List of members to remove from netgroups
     */
    removeFromNetgroups: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const netgroupNames = payload[2];
        const membersToRemove: Command[] = [];
        netgroupNames.map((netgroupName) => {
          const payloadItem = {
            method: "netgroup_remove_member",
            params: [[netgroupName], { [memberType]: memberId }],
          } as Command;
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of netgroup names, show the full data of those netgroups
     * @param {NetgroupShowPayload} - Payload with netgroup names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getNetgroupInfoByName: build.query<Netgroup[], NetgroupShowPayload>({
      query: (payload) => {
        const netgroupNames = payload.netgroupNamesList;
        const noMembers = payload.no_members || true;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const netgroupShowCommands: Command[] = netgroupNames.map(
          (netgroupName) => ({
            method: "netgroup_show",
            params: [[netgroupName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(netgroupShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): Netgroup[] => {
        const netgroupList: Netgroup[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const netgroupData = apiToNetgroup(results[i].result);
          netgroupList.push(netgroupData);
        }
        return netgroupList;
      },
    }),
    /**
     * Add entity to roles
     * @param {string} toId - ID of the entity to add to roles
     * @param {string} type - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfMembers - List of members to add to the roles
     */
    addToRoles: build.mutation<BatchRPCResponse, [string, string, string[]]>({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const roleNames = payload[2];
        const membersToAdd: Command[] = [];
        roleNames.map((roleName) => {
          const payloadItem = {
            method: "role_add_member",
            params: [[roleName], { [memberType]: memberId }],
          } as Command;
          membersToAdd.push(payloadItem);
        });
        return getBatchCommand(membersToAdd, API_VERSION_BACKUP);
      },
    }),
    /**
     * Delete entity from roles
     * @param {string} memberId - ID of the entity to remove from roles
     * @param {string} memberType - Type of the entity
     *    Available types: user | host | service
     * @param {string[]} listOfRoles - List of members to remove from roles
     */
    removeFromRoles: build.mutation<
      BatchRPCResponse,
      [string, string, string[]]
    >({
      query: (payload) => {
        const memberId = payload[0];
        const memberType = payload[1];
        const listOfRoles = payload[2];
        const membersToRemove: Command[] = [];
        listOfRoles.map((role) => {
          const payloadItem: Command = {
            method: "role_remove_member",
            params: [[role], { [memberType]: memberId }],
          };
          membersToRemove.push(payloadItem);
        });
        return getBatchCommand(membersToRemove, API_VERSION_BACKUP);
      },
    }),
    /**
     * Given a list of roles names, show the full data of those roles
     * @param {RoleShowPayload} - Payload with role names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getRolesInfoByName: build.query<Role[], RoleShowPayload>({
      query: (payload) => {
        const roleNames = payload.roleNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const roleShowCommands: Command[] = roleNames.map((roleName) => ({
          method: "role_show",
          params: [[roleName], { no_members: noMembers }],
        }));
        return getBatchCommand(roleShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): Role[] => {
        const roleList: Role[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const roleData = apiToRole(results[i].result);
          roleList.push(roleData);
        }
        return roleList;
      },
    }),
    /**
     * Given a list of HBAC rules names, show the full data of those HBAC rules
     * @param {HbacRulesShowPayload} - Payload with HBAC rule names and options
     * @returns {BatchRPCResponse} - Batch response
     */
    getHbacRulesInfoByName: build.query<HBACRule[], HbacRulesShowPayload>({
      query: (payload) => {
        const hbacRuleNames = payload.hbacRuleNamesList;
        const noMembers = payload.no_members || false;
        const apiVersion = payload.version || API_VERSION_BACKUP;
        const hbacRuleNamesShowCommands: Command[] = hbacRuleNames.map(
          (hbacRuleName) => ({
            method: "hbacrule_show",
            params: [[hbacRuleName], { no_members: noMembers }],
          })
        );
        return getBatchCommand(hbacRuleNamesShowCommands, apiVersion);
      },
      transformResponse: (response: BatchRPCResponse): HBACRule[] => {
        const hbacRulesList: HBACRule[] = [];
        const results = response.result.results;
        const count = response.result.count;
        for (let i = 0; i < count; i++) {
          const hbacRuleData = apiToHBACRule(results[i].result);
          hbacRulesList.push(hbacRuleData);
        }
        return hbacRulesList;
      },
    }),
  }),
});

//
// Wrappers
//
export const useGetDNSZonesQuery = () => {
  return useGetGenericListQuery("dnszone");
};

export const useGetHostsListQuery = () => {
  return useGetGenericListQuery("host");
};

// Wrappers for getting entry lists
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
// Hosts
export const useGettingHostQuery = (payloadData) => {
  payloadData["objName"] = "host";
  payloadData["objAttr"] = "fqdn";
  return useGettingGenericQuery(payloadData);
};
// Services
export const useGettingServicesQuery = (payloadData) => {
  payloadData["objName"] = "service";
  payloadData["objAttr"] = "krbprincipalname";
  return useGettingGenericQuery(payloadData);
};
// Groups
export const useGettingGroupsQuery = (payloadData) => {
  payloadData["objName"] = "group";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};
// Netgroups
export const useGettingNetgroupsQuery = (payloadData) => {
  payloadData["objName"] = "netgroup";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};
// Roles
export const useGettingRolesQuery = (payloadData) => {
  payloadData["objName"] = "role";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};
export const useGettingHbacRulesQuery = (payloadData) => {
  payloadData["objName"] = "hbacRule";
  payloadData["objAttr"] = "cn";
  return useGettingGenericQuery(payloadData);
};

// Full search wrappers
export const useGetUsersFullQuery = (userId: string) => {
  // Active and preserved users
  const query_args = {
    userId: userId,
    user_type: "active",
    version: API_VERSION_BACKUP,
  };
  return useGetGenericUsersFullDataQuery(query_args);
};

export const useGetStageUsersFullQuery = (userId: string) => {
  const query_args = {
    userId: userId,
    user_type: "stage",
    version: API_VERSION_BACKUP,
  };
  return useGetGenericUsersFullDataQuery(query_args);
};
//
// End of wrappers
//

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
  useAutoMemberRebuildHostsMutation,
  useAutoMemberRebuildUsersMutation,
  useEnableUserMutation,
  useDisableUserMutation,
  useUnlockUserMutation,
  useChangePasswordMutation,
  useGetCertProfileQuery,
  useAddOtpTokenMutation,
  useGenerateSubIdsMutation,
  useActivateUserMutation,
  useRestoreUserMutation,
  useAddHostMutation,
  useAddServiceMutation,
  useRemoveHostsMutation,
  useSaveHostMutation,
  useGetHostsFullDataQuery,
  useGettingGenericQuery,
  useGetGenericListQuery,
  useRemoveServicesMutation,
  useSearchEntriesMutation,
  useGetUserByUidQuery,
  useGetIDListMutation,
  useUpdateKeyTabMutation,
  useGetEntriesMutation,
  useAddToGroupsMutation,
  useRemoveFromGroupsMutation,
  useGetGroupInfoByNameQuery,
  useAddToNetgroupsMutation,
  useRemoveFromNetgroupsMutation,
  useGetNetgroupInfoByNameQuery,
  useAddToRolesMutation,
  useRemoveFromRolesMutation,
  useGetRolesInfoByNameQuery,
  useGetHbacRulesInfoByNameQuery,
} = api;
