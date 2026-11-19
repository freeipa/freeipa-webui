import { renderHook } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
// Hook
import { useDnsServersSettingsData } from "./useDnsServersSettingsData";

// Mock of rpc functions
const dnsServersShowQuery = vi.fn();

vi.mock("src/services/rpc", () => ({
  useGetObjectMetadataQuery: () => ({ data: {}, isLoading: false }),
}));

vi.mock("src/services/rpcDnsServers", () => ({
  useDnsServersShowQuery: () => dnsServersShowQuery(),
}));

const mockQueryResult = (data: unknown) => ({
  data,
  isLoading: false,
  isFetching: false,
  refetch: vi.fn(),
});

describe("useDnsServersSettingsData", () => {
  beforeEach(() => {
    dnsServersShowQuery.mockReset();
  });

  it("returns the DNS server when it exists", () => {
    dnsServersShowQuery.mockReturnValue(
      mockQueryResult({
        result: {
          result: {
            dn: "idnsserverid=ipa.test,cn=servers,cn=dns,dc=ipa,dc=test",
            idnsserverid: ["ipa.test"],
          },
        },
        error: null,
      })
    );

    const { result } = renderHook(() => useDnsServersSettingsData("ipa.test"));

    expect(result.current.dnsServer.idnsserverid).toBe("ipa.test");
  });

  it("returns an empty DNS server when the server is not found", () => {
    // dnsserver_show returns a null result together with an error
    dnsServersShowQuery.mockReturnValue(
      mockQueryResult({
        result: null,
        error: {
          code: 4001,
          message: "missing.test: DNS server not found",
          name: "NotFound",
        },
      })
    );

    const { result } = renderHook(() =>
      useDnsServersSettingsData("missing.test")
    );

    expect(result.current.dnsServer).toEqual({});
  });
});
