import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
// Component
import TitleLayout from "./TitleLayout";

test("should display the TitleLayout with required props", () => {
  render(<TitleLayout headingLevel="h1" id="test-title" text="Test Title" />);
  expect(screen.getByText("Test Title")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
