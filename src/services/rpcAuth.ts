import { api, FindRPCResponse, getCommandNoVersion } from "./rpc";
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

export interface ResetPasswordPayload {
  username: string;
  oldPassword: string;
  newPassword: string;
  otp?: string;
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

export interface SyncOtpPayload {
  user: string;
  password: string;
  first_code: string;
  second_code: string;
  token?: string;
}

// List of URLs
export const LOGIN_URL = "/ipa/session/login_password";
export const KERBEROS_URL = "/ipa/session/login_kerberos";
export const X509_URL = "/ipa/session/login_x509";
export const RESET_PASSWORD_URL = "/ipa/session/change_password";
export const SYNC_OTP_URL = "/ipa/session/sync_token";

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
        getCommandNoVersion({
          method: "session_logout",
          params: [[], {}],
        }),
    }),
    krbLogin: build.mutation<FindRPCResponse | MetaResponse, void>({
      query: () => {
        const loginRequest = {
          url: KERBEROS_URL,
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Data-Type": "html",
            Referer: URL_PREFIX + "/login",
          },
          responseHandler: (response) => response.json(),
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
    x509Login: build.mutation<FindRPCResponse | MetaResponse, string>({
      query: (username) => {
        const encodedCredentials = encodeURIObject({
          username: username,
        });
        const loginRequest = {
          url: X509_URL + "?" + encodedCredentials,
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Data-Type": "html",
            Referer: URL_PREFIX + "/login",
          },
          responseHandler: (response) => response.json(),
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
    resetPassword: build.mutation<
      FindRPCResponse | MetaResponse,
      ResetPasswordPayload
    >({
      query: (payload) => {
        const encodedCredentials = encodeURIObject({
          user: payload.username,
          old_password: payload.oldPassword,
          new_password: payload.newPassword,
        });

        if (payload.otp) {
          encodedCredentials.concat("&otp=" + payload.otp);
        }

        const resetPasswordRequest = {
          url: RESET_PASSWORD_URL,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Data-Type": "html",
          },
          body: encodedCredentials,
        };

        return resetPasswordRequest;
      },
      transformErrorResponse: (
        response: FetchBaseQueryError,
        meta: FetchBaseQueryMeta
      ) => {
        return meta as unknown as MetaResponse;
      },
    }),
    syncOtp: build.mutation<FindRPCResponse | MetaResponse, SyncOtpPayload>({
      query: (payload) => {
        const encodedCredentials = encodeURIObject({
          user: payload.user,
          password: payload.password,
          first_code: payload.first_code,
          second_code: payload.second_code,
        });

        if (payload.token) {
          encodedCredentials.concat("&token=" + payload.token);
        }

        const syncOtpRequest = {
          url: SYNC_OTP_URL,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Data-Type": "html",
          },
          body: encodedCredentials,
        };

        return syncOtpRequest;
      },
      transformErrorResponse: (
        response: FetchBaseQueryError,
        meta: FetchBaseQueryMeta
      ) => {
        return meta as unknown as MetaResponse;
      },
    }),
  }),
});

export const {
  useUserPasswordLoginMutation,
  useLogoutMutation,
  useKrbLoginMutation,
  useX509LoginMutation,
  useResetPasswordMutation,
  useSyncOtpMutation,
} = extendedApi;
