import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
// component
import DataSpinner from "./DataSpinner";

describe("DataSpinner Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the spinner with default props", () => {
    render(<DataSpinner />);
    const spinner = screen.getByLabelText("Loading Data...");
    expect(spinner).toBeInTheDocument();
  });
});
