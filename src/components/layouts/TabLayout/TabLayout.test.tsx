import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
// Component
import TabLayout from "./TabLayout";

const testTabs = [
  <div key="1">Test Tab</div>,
  <div key="2">Test Tab</div>,
  <div key="3">Test Tab</div>,
];

test("should display the TabLayout with required props", () => {
  render(<TabLayout id="test-tab">{testTabs}</TabLayout>);
  expect(screen.getAllByText("Test Tab")).toHaveLength(3);
});
