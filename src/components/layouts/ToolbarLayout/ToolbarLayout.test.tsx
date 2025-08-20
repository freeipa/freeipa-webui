import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
// Component
import ToolbarLayout from "./ToolbarLayout";

test("should display the ToolbarLayout with required props", () => {
  const { container } = render(
    <ToolbarLayout
      toolbarItems={[
        {
          key: 1,
          element: <div>Test Toolbar Element</div>,
        },
      ]}
    />
  );
  expect(screen.getByText("Test Toolbar Element")).toBeInTheDocument();
  expect(container.querySelector('[id="1"]')).toBeInTheDocument();
});

test("should display the ToolbarLayout with the proper amount of children", () => {
  render(
    <ToolbarLayout
      toolbarItems={[
        {
          key: 1,
          element: <div>Test Toolbar Item</div>,
        },
        {
          key: 2,
          element: <div>Test Toolbar Item</div>,
        },
        {
          key: 3,
          element: <div>Test Toolbar Item</div>,
        },
      ]}
    />
  );
  expect(screen.getAllByText(/Test Toolbar Item/)).toHaveLength(3);
});
