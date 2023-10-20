/* eslint-disable @typescript-eslint/no-explicit-any */
// RTK Query
import { SerializedError } from "@reduxjs/toolkit";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";
import {
  Metadata,
  User,
  IDPServer,
  RadiusServer,
} from "src/utils/datatypes/globalDataTypes";
import { apiToUser } from "src/utils/userUtils";

export type UserFullData = {
  user?: Partial<User>;
  pwPolicy?: Record<string, unknown>;
  krbtPolicy?: Record<string, unknown>;
  cert?: Record<string, unknown>;
};

export interface UIDType {
  dn: string;
  uid: string[];
}

export interface Query {
  data: FindRPCResponse | BatchRPCResponse | undefined;
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

export interface ShowRPCResponse {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: Record<string, unknown>;
}

export interface BatchResult {
  result: Record<string, unknown>;
  count: number;
  truncated: boolean;
  summary: string;
}

export interface BatchResponse {
  result: {
    results: BatchResult[];
  };
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
    results: {
      result: Record<string, unknown>; // General object type
      truncated: boolean;
      summary: string;
    };
  };
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

export interface UsersPayload {
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
  tagTypes: ["ObjectMetadata", "FullUser", "RadiusServer", "IdpServer"],
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
        const { searchValue, sizeLimit, apiVersion } = payloadData;

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
        // Prepare payload
        const payloadDataUids: Command = {
          method: "user_find",
          params: [
            [searchValue],
            {
              pkey_only: true,
              sizelimit: sizeLimit,
              version: apiVersion,
            },
          ],
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
          method: "user_show",
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
    getUsersFullData: build.query<UserFullData, string>({
      query: (userId: string, apiVersion?: string) => {
        const userShowCommand: Command = {
          method: "user_show",
          params: [userId, { all: true, rights: true }],
        };

        const pwpolicyShowCommand: Command = {
          method: "pwpolicy_show",
          params: [[], { user: userId[0], all: true, rights: true }],
        };

        const krbtpolicyShowCommand: Command = {
          method: "krbtpolicy_show",
          params: [userId, { all: true, rights: true }],
        };

        const certFindCommand: Command = {
          method: "cert_find",
          params: [[], { user: userId[0], sizelimit: 0, all: true }],
        };

        const batchPayload: Command[] = [
          userShowCommand,
          pwpolicyShowCommand,
          krbtpolicyShowCommand,
          certFindCommand,
        ];

        return getBatchCommand(batchPayload, apiVersion || API_VERSION_BACKUP);
      },
      transformResponse: (response: BatchResponse): UserFullData => {
        const results = response.result.results;
        return {
          user: apiToUser(results[0].result),
          pwPolicy: results[1].result,
          krbtPolicy: results[2].result,
          cert: results[3].result,
        };
      },
      providesTags: ["FullUser"],
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
  }),
});

export const {
  useSimpleCommandQuery,
  useSimpleMutCommandMutation,
  useBatchCommandQuery,
  useBatchMutCommandMutation,
  useGettingUserQuery,
  useGetObjectMetadataQuery,
  useGetUsersFullDataQuery,
  useSaveUserMutation,
  useGetRadiusProxyQuery,
  useGetIdpServerQuery,
  useRemovePrincipalAliasMutation,
  useAddPrincipalAliasMutation,
} = api;
