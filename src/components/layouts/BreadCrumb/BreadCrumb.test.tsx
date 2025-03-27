import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Component
import BreadCrumb, { BreadCrumbItem } from "./BreadCrumb";

describe("BreadCrumb Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the BreadCrumb component with items", async () => {
    const breadCrumbItems: BreadCrumbItem[] = [
      {
        name: "Active users",
        url: "/active-users",
      },
      {
        name: "user1",
        url: "/active-users/user1",
        isActive: true,
      },
    ];

    render(<BreadCrumb breadcrumbItems={breadCrumbItems} />);
    expect(screen.getByText("Active users")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
  });

  it("renders the BreadCrumb component with preText", async () => {
    const breadCrumbItems: BreadCrumbItem[] = [
      {
        name: "Active users",
        url: "/active-users",
      },
      {
        name: "user1",
        url: "/active-users/user1",
        isActive: true,
      },
    ];

    render(<BreadCrumb breadcrumbItems={breadCrumbItems} preText="User:" />);
    expect(screen.getByText("Active users")).toBeInTheDocument();
    expect(screen.getByText("User: user1")).toBeInTheDocument();
  });

  it("has a valid link", () => {
    const breadCrumbItems: BreadCrumbItem[] = [
      {
        name: "Active users",
        url: "/active-users",
      },
      {
        name: "user1",
        url: "/active-users/user1",
        isActive: true,
      },
    ];

    render(<BreadCrumb breadcrumbItems={breadCrumbItems} />);

    /**
     * Vitest is simulating a browser, but it has some limitations.
     * One of these limitations is the fact that you can't change
     * the location while executing a test. So in this case, the
     * test will check if the link has the correct href attribute.
     */
    const link = screen.getByText("Active users");
    expect(link).toHaveAttribute("href", "/active-users");
  });
});
