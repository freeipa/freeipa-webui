/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, getCommand, FindRPCResponse } from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { URL_PREFIX } from "src/navigation/NavRoutes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

/**
 * Endpoints: userPasswordLogin, logout
 *
 * API commands:
 * - session_logout: https://freeipa.readthedocs.io/en/latest/api/session_logout.html
 */

export interface UserPasswordPayload {
  username: string;
  password: string;
}

export interface ResponseOnLogin {
  error: {
    data: string;
    error: string;
    originalStatus: number;
    status: string;
  };
}

export interface MetaResponse {
  request: {
    body: ReadableStream<Uint8Array> | null;
    bodyUsed: boolean;
    cache: RequestCache;
    credentials: RequestCredentials;
    destination: RequestDestination;
    headers: Headers;
    integrity: string;
    isHistoryNavigation: boolean;
    keepalive: boolean;
    method: string;
    mode: RequestMode;
    redirect: RequestRedirect;
    referrer: string;
    referrerPolicy: ReferrerPolicy;
    signal: AbortSignal;
    url: string;
  };
  response: {
    body: ReadableStream<Uint8Array> | null;
    bodyUsed: boolean;
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    type: ResponseType;
    url: string;
  };
}

// List of URLs
export const LOGIN_URL = "/ipa/session/login_password";

// Utils
export const encodeURIObject = (obj: Record<string, string>) => {
  return Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
    .join("&");
};

// API
const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    userPasswordLogin: build.mutation<
      FindRPCResponse | MetaResponse,
      UserPasswordPayload
    >({
      query: (payload) => {
        const encodedCredentials = encodeURIObject({
          user: payload.username,
          password: payload.password,
        });

        const loginRequest = {
          url: LOGIN_URL,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Data-Type": "html",
            Referer: URL_PREFIX + "/login",
          },
          body: encodedCredentials,
        };

        return loginRequest;
      },
      transformErrorResponse: (
        response: FetchBaseQueryError,
        meta: FetchBaseQueryMeta
      ) => {
        return meta as unknown as MetaResponse;
      },
    }),
    logout: build.mutation<FindRPCResponse, void>({
      query: () =>
        getCommand({
          method: "session_logout",
          params: [[], { version: API_VERSION_BACKUP }],
        }),
    }),
  }),
});

export const { useUserPasswordLoginMutation, useLogoutMutation } = extendedApi;
