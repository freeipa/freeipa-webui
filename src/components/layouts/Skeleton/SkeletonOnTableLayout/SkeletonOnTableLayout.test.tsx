import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
// Component
import SkeletonOnTableLayout from "./SkeletonOnTableLayout";

describe("SkeletonOnTableLayout Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("render component with default props", () => {
    render(<SkeletonOnTableLayout rows={2} colSpan={1} />);

    const skeleton = screen.getAllByText("Loading content");
    expect(skeleton.length).toBe(2);
  });

  it("renders with correct number of skeleton rows", () => {
    render(<SkeletonOnTableLayout rows={5} colSpan={3} />);

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(5);
  });

  it("renders with accessible text", () => {
    render(<SkeletonOnTableLayout rows={2} colSpan={1} />);

    const strText = screen.getAllByText("Loading content");
    // Check if the skeleton text is present in the document
    strText.forEach((text) => {
      expect(text).toBeInTheDocument();
    });
  });

  it("renders with custom accessible text", () => {
    const customText = "Loading data...";

    render(
      <SkeletonOnTableLayout
        rows={2}
        colSpan={1}
        screenreaderText={customText}
      />
    );

    const strText = screen.getAllByText(customText);
    // Check if the skeleton text is present in the document
    strText.forEach((text) => {
      expect(text).toBeInTheDocument();
    });
  });

  it("renders with custom colspan", () => {
    render(<SkeletonOnTableLayout rows={1} colSpan={5} />);
    const td = screen.getByRole("cell");
    expect(td).toHaveAttribute("colspan", "5");
  });
});
