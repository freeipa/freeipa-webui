import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// Component
import BreadCrumb, { BreadCrumbItem } from "./BreadCrumb";

describe("BreadCrumb Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the BreadCrumb component with items", () => {
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

  it("renders the BreadCrumb component with preText", () => {
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
     * Jest uses jsdom to run its test. jsdom is simulating a
     * browser, but it has some limitations. One of these
     * limitations is the fact that you can't change the location
     * while executing a test. So in this case, the test will
     * check if the link has the correct href attribute.
     */
    const link = screen.getByText("Active users");
    expect(link).toHaveAttribute("href", "/active-users");
  });
});
