import {
  api,
  BatchRPCResponse,
  Command,
  FindRPCResponse,
  getBatchCommand,
  getCommandNoVersion,
} from "./rpc";
import { URL_PREFIX } from "src/navigation/NavRoutes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { API_VERSION_BACKUP } from "src/utils/utils";
import { Metadata } from "./types/metadata";

/**
 * Endpoints: userPasswordLogin, logout
 *
 * API commands:
 * - session_logout: https://freeipa.readthedocs.io/en/latest/api/session_logout.html
 */

const BATCH_COMMANDS_AUTH = [
  "config_show",
  "whoami",
  "env",
  "dns_is_enabled",
  "trustconfig_show",
  "domainlevel_get",
  "ca_is_enabled",
  "vaultconfig_show",
];

const BATCH_COMMANDS_AUTH_PAYLOAD: Command[] = [
  ...BATCH_COMMANDS_AUTH.map((method) => ({
    method,
    params: [[], {}],
  })),
  {
    method: "json_metadata",
    params: [[], { object: "all", method: "all", command: "all" }],
  },
];

export interface UserMetadata {
  ipaServerConfiguration: Record<string, unknown>;
  loggedInUser: string;
  environment: Record<string, unknown>;
  dnsIsEnabled: boolean;
  trustConfiguration: Record<string, unknown>;
  domainLevel: number;
  caIsEnabled: boolean;
  vaultConfiguration: Record<string, unknown>;
  metadata: Metadata;
}

interface UserPasswordPayload {
  username: string;
  password: string;
}

export interface ResetPasswordPayload {
  username: string;
  oldPassword: string;
  newPassword: string;
  otp?: string;
}

export interface MetaResponse {
  request: Request;
  response: Response;
}

export interface ResponseOnPwdReset {
  response: FetchBaseQueryError;
  metaResponse: MetaResponse;
}

export interface SyncOtpPayload {
  user: string;
  password: string;
  first_code: string;
  second_code: string;
  token?: string;
}

// List of URLs
const LOGIN_URL = "/ipa/session/login_password";
const KERBEROS_URL = "/ipa/session/login_kerberos";
const X509_URL = "/ipa/session/login_x509";
const RESET_PASSWORD_URL = "/ipa/session/change_password";
const SYNC_OTP_URL = "/ipa/session/sync_token";

// Utils
const encodeURIObject = (obj: Record<string, string>) => {
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
    resetPassword: build.mutation<ResponseOnPwdReset, ResetPasswordPayload>({
      query: (payload) => {
        const encodedCredentials = encodeURIObject({
          user: payload.username,
          old_password: payload.oldPassword,
          new_password: payload.newPassword,
          ...(payload.otp && { otp: payload.otp }),
        });

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
        const responseData: ResponseOnPwdReset = {
          response: response as FetchBaseQueryError,
          metaResponse: meta as unknown as MetaResponse,
        };
        return responseData;
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
    userMetadata: build.query<UserMetadata, void>({
      query: () =>
        getBatchCommand(BATCH_COMMANDS_AUTH_PAYLOAD, API_VERSION_BACKUP),
      transformResponse: (response: BatchRPCResponse): UserMetadata => {
        const results = response.result.results;
        const whoamiResponse = results[1] as Record<string, unknown>;
        return {
          ipaServerConfiguration: results[0].result,
          loggedInUser: whoamiResponse.arguments?.toString() ?? "",
          environment: results[2].result,
          dnsIsEnabled: results[3].result as boolean,
          trustConfiguration: results[4].result,
          domainLevel: results[5].result,
          caIsEnabled: results[6].result,
          vaultConfiguration: results[7].result,
          metadata: results[8] as Metadata,
        };
      },
    }),
  }),
});

export const authApi = extendedApi;

export const {
  useUserPasswordLoginMutation,
  useLogoutMutation,
  useKrbLoginMutation,
  useX509LoginMutation,
  useResetPasswordMutation,
  useSyncOtpMutation,
  useUserMetadataQuery,
} = authApi;
