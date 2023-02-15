import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RPCResponse<ResultType> {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: {
    result: ResultType[]; // TODO: Remove the necessity of casting types somehow
    count: number;
    truncated: boolean;
    summary: string;
  };
}

const getCommandPayload = (command: string) => {
  return {
    url: "ipa/session/json",
    method: "POST",
    body: {
      method: command,
      params: [
        [],
        {
          pkey_only: true,
          sizelimit: 0,
          version: "2.248",
        },
      ],
    },
  };
};

const transformRPCResponse = (response, meta, arg) => {
  if (response.result.result) return response.result.result;
  // TODO: Error handling
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // TODO: Global settings!
  endpoints: (build) => ({
    command: build.query<RPCResponse<object>, string | void>({
      query: getCommandPayload,
      // transformResponse: transformRPCResponse,
    }),
  }),
});

export const { useCommandQuery } = api;
