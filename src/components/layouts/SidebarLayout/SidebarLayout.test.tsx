import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
// Component
import SidebarLayout from "./SidebarLayout";

const sidebarChildren = [
  <div key="1">Test Content</div>,
  <div key="2">Test Content</div>,
  <div key="3">Test Content</div>,
];

describe("SidebarLayout Component", () => {
  test("should render SidebarLayout component", () => {
    render(
      <SidebarLayout itemNames={["Test Item 1", "Test Item 2"]}>
        {sidebarChildren}
      </SidebarLayout>
    );

    expect(screen.getByText("Test Item 1")).toBeInTheDocument();
    expect(screen.getByText("Test Item 2")).toBeInTheDocument();
    expect(screen.getAllByText("Test Content")).toHaveLength(3);
  });

  test("should render JumpLinks with correct href and text content", () => {
    render(
      <SidebarLayout itemNames={["User Settings", "Password Policy"]}>
        <div>Content</div>
      </SidebarLayout>
    );

    const userSettingsLink = screen.getByRole("link", {
      name: /User Settings/i,
    });
    expect(userSettingsLink).toHaveAttribute("href", "#user-settings");

    const passwordPolicyLink = screen.getByRole("link", {
      name: /Password Policy/i,
    });
    expect(passwordPolicyLink).toHaveAttribute("href", "#password-policy");
  });
});
