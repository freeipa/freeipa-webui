/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UIDType {
  dn: string;
  uid: string[];
}

export interface UserAuthTypes {
  password: boolean;
  radius: boolean;
  otp: boolean;
  pkinit: boolean;
  hardened: boolean;
  idp: boolean;
}

// 'RPCResponse' type
//   - Has 'result' > 'result' structure
export interface RPCResponse<ResultType> {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: {
    result: ResultType; // TODO: Remove the necessity of casting types somehow
    count: number;
    truncated: boolean;
    summary: string;
  };
}

// 'RPCResponse2' type
//   - Has 'result' > 'results' > 'result' structure
//   - More data under 'result'
export interface RPCResponse2<ResultType> {
  error: string;
  id: string;
  principal: string;
  version: string;
  result: {
    count: number;
    results: {
      result: ResultType;
      truncated: boolean;
      summary: string;
    },
  };
}

export interface CommandWithSingleParam {
  command: string;
  param: string;
}

// export interface CommandWithParams {
//   method: string;
//   params: any[];
// }

export interface Command {
  method: string;
  params: any[];
}

export interface BatchCommand {
  batch: CommandWithSingleParam[];
}

const getCommand = (commandData: Command) => {
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

const getBatchCommand = (commandData: Command[]) => {
  const payloadBatchParams = {
    url: "ipa/session/json",
    method: "POST",
    body: {
      method: "batch",
      params: [
        commandData.map((cmd) => cmd),
      {
        version: "2.251",
      },
    ],
    },
  };
  return payloadBatchParams;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // TODO: Global settings!
  endpoints: (build) => ({
    simpleCommand: build.query<RPCResponse<object>, Command | void>({
      query: (payloadData: Command) => getCommand(payloadData),
    }),
    commandWithParams: build.mutation<RPCResponse2<object>, Command>({
      query: (payloadData: Command) => getCommand(payloadData),
    }),
    batchCommand: build.query<RPCResponse2<object>, Command[] | void>({
      query: (payloadData: Command[]) => getBatchCommand(payloadData),
    }),
  }),
});

export const {
  useSimpleCommandQuery,
  useCommandWithParamsMutation,
  useBatchCommandQuery } = api;
