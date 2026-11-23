import { describe, expect, it } from "vitest";
import { encodeRouteId } from "./routeUtils";

describe("encodeRouteId", () => {
  it("leaves ids without slashes single-encoded", () => {
    expect(encodeRouteId("test group")).toBe("test%20group");
    expect(encodeRouteId("user@example.com")).toBe("user%40example.com");
  });

  it("double-encodes slashes so a hard refresh reaches the SPA", () => {
    expect(encodeRouteId("/usr/bin/ls")).toBe("%252Fusr%252Fbin%252Fls");
    expect(encodeRouteId("0/25.2.0.192.in-addr.arpa.")).toBe(
      "0%252F25.2.0.192.in-addr.arpa."
    );
  });
});
