/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, getCommand, FindRPCResponse } from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import {
  CertificateAuthority,
  CertProfile,
} from "../utils/datatypes/globalDataTypes";

/**
 * Certificate-related endpoints: addCertificate, removeCertificate,
 *   revokeCertificate, getCertificateAuthority, removeHoldCertificate,
 *   getCertProfile
 *
 * API commands:
 * - user_add_cert: https://freeipa.readthedocs.io/en/latest/api/user_show.html
 * - host_add_cert: https://freeipa.readthedocs.io/en/latest/api/host_add_cert.html
 * - service_add_cert: https://freeipa.readthedocs.io/en/latest/api/service_add_cert.html
 * - user_remove_cert: https://freeipa.readthedocs.io/en/latest/api/host_remove_cert.html
 * - host_remove_cert: https://freeipa.readthedocs.io/en/latest/api/host_remove_cert.html
 * - service_remove_cert: https://freeipa.readthedocs.io/en/latest/api/service_remove_cert.html
 * - ca_find: https://freeipa.readthedocs.io/en/latest/api/ca_find.html
 * - cert_revoke: https://freeipa.readthedocs.io/en/latest/api/cert_revoke.html
 * - cert_remove_hold: https://freeipa.readthedocs.io/en/latest/api/cert_remove_hold.html
 * - certprofile_find: https://freeipa.readthedocs.io/en/latest/api/certprofile_find.html
 */

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
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
  }),
  overrideExisting: false,
});

export const {
  useAddCertificateMutation,
  useRemoveCertificateMutation,
  useGetCertificateAuthorityQuery,
  useRevokeCertificateMutation,
  useRemoveHoldCertificateMutation,
  useGetCertProfileQuery,
} = extendedApi;
