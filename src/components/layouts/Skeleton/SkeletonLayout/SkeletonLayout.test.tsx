import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
// Component
import SkeletonLayout from "./SkeletonLayout";

describe("SkeletonLayout Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with default props", () => {
    render(<SkeletonLayout />);
    // Find the skeleton element by class name or structure
    const skeleton = screen.getByTestId("skeleton-wrapper");
    expect(skeleton).toBeInTheDocument();
  });

  it("applies custom class and styles", () => {
    render(
      <SkeletonLayout
        className="custom-class"
        height="42px"
        width="88px"
        fontSize="md"
        screenreaderText="Loading something"
      />
    );

    const skeleton = document.querySelector(".pf-v5-c-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("custom-class");
    expect(skeleton).toHaveClass("pf-m-text-md");
    expect(skeleton).toHaveStyle({
      "--pf-v5-c-skeleton--Height": "42px",
      "--pf-v5-c-skeleton--Width": "88px",
    });

    const srText = screen.getByText("Loading something");
    expect(srText).toBeInTheDocument();
  });
});
