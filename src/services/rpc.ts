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
  fqdnType,
  Metadata,
  servicesType,
  UIDType,
  cnType,
  roleType,
  sudoCmdType,
  automemberType,
} from "../utils/datatypes/globalDataTypes";

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
  status: string;
  code: number;
  message: string;
  data: {
    name: string;
    attr: string;
    value: string;
  };
  name: string;
}

export interface KwError {
  type: "error";
  error: string;
  error_code: number;
  error_name: string;
  error_kw: {
    reason: string;
  };
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
    | "idview"
    | "idoverrideuser"
    | "idoverridegroup"
    | "automember";
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
    "CertProfile",
    "DNSZones",
    "FullHost",
    "FullService",
    "FullUserGroup",
    "FullHBACRule",
    "FullHBACService",
    "FullHBACServiceGrp",
    "FullHostGroup",
    "FullNetgroup",
    "FullIDView",
    "FullIDViewHosts",
    "FullIDViewHostgroups",
    "FullSudoRule",
    "FullSudoCmdGroup",
    "FullSudoCmd",
    "FullConfig",
    "FullOverrideUser",
    "FullOverrideGroup",
    "FullAutomember",
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
          sudocmd,
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

        if (timelimit) {
          params["timelimit"] = timelimit;
        }

        if (
          objName === "group" ||
          objName === "netgroup" ||
          objName === "hostgroup"
        ) {
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

        if (
          objName === "role" ||
          objName === "sudorule" ||
          objName === "sudocmdgroup" ||
          objName === "idview"
        ) {
          if (cn) {
            params["cn"] = cn;
          }
          if (description) {
            params["description"] = description;
          }
        }

        if (objName === "hbacrule" || objName === "hbacsvc") {
          if (description) {
            params["description"] = description;
          }
        }

        if (objName === "hbacsvcgroup") {
          if (description) {
            params["description"] = description;
          }
        }

        if (objName === "sudocmd") {
          if (sudocmd) {
            params["sudocmd"] = sudocmd;
          }
          if (description) {
            params["description"] = description;
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
          } else if (
            // CN types
            objName === "group" ||
            objName === "netgroup" ||
            objName === "hostgroup" ||
            objName === "idview" ||
            objName === "hbacrule" ||
            objName === "hbacsvc" ||
            objName === "hbacsvcgroup" ||
            objName === "sudorule" ||
            objName === "sudocmdgroup"
          ) {
            id = idResponseData.result.result[i] as cnType;
          } else if (objName === "role") {
            id = idResponseData.result.result[i] as roleType;
          } else if (objName === "sudocmd") {
            id = idResponseData.result.result[i] as sudoCmdType;
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
        let payloadDataBatch: Command[] = [];
        if (objName === "idview") {
          // There is no "no_members" param
          payloadDataBatch = ids.map((name) => ({
            method: objName + "_show",
            params: [[name], {}],
          }));
        } else {
          payloadDataBatch = ids.map((name) => ({
            method: objName + "_show",
            params: [[name], { no_members: true }],
          }));
        }

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
        } else if (entryType === "hostgroup") {
          method = "hostgroup_find";
          show_method = "hostgroup_show";
        } else if (entryType === "usergroup") {
          method = "group_find";
          show_method = "group_show";
        } else if (entryType === "netgroup") {
          method = "netgroup_find";
          show_method = "netgroup_show";
        } else if (entryType === "hbacrule") {
          method = "hbacrule_find";
          show_method = "hbacrule_show";
        } else if (entryType === "hbacsvc") {
          method = "hbacsvc_find";
          show_method = "hbacsvc_show";
        } else if (entryType === "hbacsvcgroup") {
          method = "hbacsvcgroup_find";
          show_method = "hbacsvcgroup_show";
        } else if (entryType === "idview") {
          method = "idview_find";
          show_method = "idview_show";
        } else if (entryType === "sudocmd") {
          method = "sudocmd_find";
          show_method = "sudocmd_show";
        } else if (entryType === "sudocmdgroup") {
          method = "sudocmdgroup_find";
          show_method = "sudocmdgroup_show";
        } else if (entryType === "sudorule") {
          method = "sudorule_find";
          show_method = "sudorule_show";
        } else if (entryType === "automember") {
          method = "automember_find";
          show_method = "automember_show";
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
          } else if (entryType === "sudocmd") {
            const sudoCmd = responseData.result.result[i] as sudoCmdType;
            const { sudocmd } = sudoCmd;
            ids.push(sudocmd[0] as string);
          } else if (
            entryType === "usergroup" ||
            entryType === "hostgroup" ||
            entryType === "netgroup" ||
            entryType === "hbacrule" ||
            entryType === "hbacsvc" ||
            entryType === "hbacsvcgroup" ||
            entryType === "sudocmdgroup" ||
            entryType === "idview" ||
            entryType === "sudorule"
          ) {
            const groupId = responseData.result.result[i] as cnType;
            const { cn } = groupId;
            ids.push(cn[0] as string);
          } else if (entryType === "automember") {
            const automemberId = responseData.result.result[
              i
            ] as automemberType;
            const { cn } = automemberId;
            ids.push(cn[0] as string);
          }
        }

        // 2ND CALL - GET PARTIAL INFO
        // Prepare payload
        let payloadDataBatch: Command[] = [];
        if (entryType === "idview") {
          // There is no "no_members" param
          payloadDataBatch = ids.map((id) => ({
            method: show_method,
            params: [[id], {}],
          }));
        } else {
          payloadDataBatch = ids.map((id) => ({
            method: show_method,
            params: [[id], { no_members: true }],
          }));
        }

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
        } else if (entryType === "hostgroup") {
          method = "hostgroup_find";
        } else if (entryType === "group") {
          method = "group_find";
        } else if (entryType === "netgroup") {
          method = "netgroup_find";
        } else if (entryType === "service") {
          method = "service_find";
        } else if (entryType === "hbacsvc") {
          method = "hbacsvc_find";
        } else if (entryType === "hbacsvcgroup") {
          method = "hbacsvcgroup_find";
        } else if (entryType === "sudorule") {
          method = "sudorule_find";
        } else if (entryType === "sudocmd") {
          method = "sudocmd_find";
        } else if (entryType === "sudocmdgroup") {
          method = "sudocmdgroup_find";
        } else if (entryType === "automember") {
          method = "automember_find";
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
          } else if (
            entryType === "group" ||
            entryType === "hostgroup" ||
            entryType === "netgroup" ||
            entryType === "hbacsvc" ||
            entryType === "hbacsvcgroup" ||
            entryType === "sudocmdgroup"
          ) {
            const groupId = responseData.result.result[i] as cnType;
            const { cn } = groupId;
            ids.push(cn[0] as string);
          } else if (entryType === "sudocmd") {
            const sudoCmd = responseData.result.result[i] as sudoCmdType;
            const { sudocmd } = sudoCmd;
            ids.push(sudocmd[0] as string);
          } else if (entryType === "automember") {
            const automemberId = responseData.result.result[
              i
            ] as automemberType;
            const { cn } = automemberId;
            ids.push(cn[0] as string);
          }
        }

        const result = { list: ids, count: itemsCount } as ListResponse;

        return { data: result };
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
  }),
});

export const {
  useSimpleCommandQuery,
  useSimpleMutCommandMutation,
  useBatchCommandQuery,
  useBatchMutCommandMutation,
  useGetObjectMetadataQuery,
  useGettingGenericQuery,
  useGetGenericListQuery,
  useSearchEntriesMutation,
  useGetIDListMutation,
  useGetEntriesMutation,
} = api;
