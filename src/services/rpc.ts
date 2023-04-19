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

export interface UIDType {
  dn: string;
  uid: string[];
}

export interface Query {
  data: RPCResponse | RPCResponse2 | undefined;
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

// 'RPCResponse' type
//   - Has 'result' > 'result' structure
export interface RPCResponse {
  error: string;
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

// 'RPCResponse2' type
//   - Has 'result' > 'results' > 'result' structure
//   - More data under 'result'
export interface RPCResponse2 {
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
  return payloadWithParams;
};

export const getBatchCommand = (commandData: Command[], apiVersion: string) => {
  const payloadBatchParams = {
    url: "ipa/session/json",
    method: "POST",
    body: {
      method: "batch",
      params: [
        commandData.map((cmd) => cmd),
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
//   endpoint (e.g: `gettingUserData`)
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // TODO: Global settings!
  endpoints: (build) => ({
    simpleCommand: build.query<RPCResponse, Command | void>({
      query: (payloadData: Command) => getCommand(payloadData),
    }),
    simpleMutCommand: build.mutation<RPCResponse2, Command>({
      query: (payloadData: Command) => getCommand(payloadData),
    }),
    batchCommand: build.query<RPCResponse2, Command[] | void>({
      query: (payloadData: Command[], apiVersion?: string) =>
        getBatchCommand(payloadData, apiVersion || API_VERSION_BACKUP),
    }),
    batchMutCommand: build.mutation<RPCResponse2, Command[] | void>({
      query: (payloadData: Command[], apiVersion?: string) =>
        getBatchCommand(payloadData, apiVersion || API_VERSION_BACKUP),
    }),
    gettingUserData: build.query<RPCResponse2, string | void>({
      async queryFn(apiVersion, _queryApi, _extraOptions, fetchWithBQ) {
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
            [],
            {
              pkey_only: true,
              sizelimit: 0,
              version: apiVersion,
            },
          ],
        };

        // Make call using 'fetchWithBQ'
        const getUidsResult = await fetchWithBQ(getCommand(payloadDataUids));
        // Return possible errors
        if (getUidsResult.error)
          return { error: getUidsResult.error as FetchBaseQueryError };
        // If no error: cast and assign 'uids'
        const uids = getUidsResult.data as RPCResponse;

        const userIds: string[] = [];
        const returnedItems = uids.result.count;
        for (let i = 0; i < returnedItems; i++) {
          const userId = uids.result.result[i] as UIDType;
          const { uid } = userId;
          userIds.push(uid[0] as string);
        }

        // 2ND CALL - GET PARTIAL USERS INFO
        // Prepare payload
        const payloadUserDataBatch: Command[] = [];
        const infoType = { no_members: true };
        if (userIds.length > 0) {
          userIds.map((uid) => {
            const payloadItem = {
              method: "user_show",
              params: [[uid], infoType],
            };
            payloadUserDataBatch.push(payloadItem);
          });
        }

        // Make call using 'fetchWithBQ'
        const partialUsersInfoResult = await fetchWithBQ(
          getBatchCommand(payloadUserDataBatch as Command[], apiVersion)
        );

        // Return results
        return partialUsersInfoResult.data
          ? { data: partialUsersInfoResult.data as RPCResponse2 }
          : {
              error:
                partialUsersInfoResult.error as unknown as FetchBaseQueryError,
            };
      },
    }),
  }),
});

export const {
  useSimpleCommandQuery,
  useSimpleMutCommandMutation,
  useBatchCommandQuery,
  useBatchMutCommandMutation,
  useGettingUserDataQuery,
} = api;
