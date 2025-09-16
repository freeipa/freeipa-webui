import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, it, describe, vi, afterEach } from "vitest";
// Component
import SecondaryButton, { PropsToSecondaryButton } from "./SecondaryButton";

const mockClickHandler = vi.fn();

const defaultProps: PropsToSecondaryButton = {
  dataCy: "test-button",
  children: "Test Button",
};

const completeProps: PropsToSecondaryButton = {
  dataCy: "complete-button",
  id: "custom-id",
  classname: "custom-class",
  name: "button-name",
  isDisabled: false,
  onClickHandler: mockClickHandler,
  isActive: true,
  isBlock: true,
  isInLine: true,
  isSmall: true,
  ouijaId: "ouija-123",
  ouijaSafe: true,
  form: "test-form",
  isLoading: false,
  spinnerAriaValueText: "Loading...",
  spinnerAriaLabelledBy: "loading-label",
  spinnerAriaLabel: "Loading button",
  children: "Complete Button",
};

describe("SecondaryButton Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders with required props only", () => {
    render(<SecondaryButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: "Test Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-cy", "test-button");
  });

  it("renders with all optional props", () => {
    const mockRef = React.createRef<HTMLButtonElement>();
    const propsWithRef = { ...completeProps, innerRef: mockRef };

    render(<SecondaryButton {...propsWithRef} />);

    const button = screen.getByRole("button", { name: "Complete Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("id", "custom-id");
    expect(button).toHaveAttribute("name", "button-name");
    expect(button).toHaveAttribute("form", "test-form");
    expect(button).toHaveClass("custom-class");
  });

  it("handles click events correctly", () => {
    const localMockClickHandler = vi.fn();
    const props = { ...defaultProps, onClickHandler: localMockClickHandler };

    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Test Button" });
    fireEvent.click(button);

    expect(localMockClickHandler).toHaveBeenCalledExactlyOnceWith(
      expect.any(Object)
    );
  });

  it("is disabled when isDisabled prop is true", () => {
    const localMockClickHandler = vi.fn();
    const props = {
      ...defaultProps,
      isDisabled: true,
      onClickHandler: localMockClickHandler,
      children: "Disabled Button",
    };

    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(localMockClickHandler).not.toHaveBeenCalled();
  });

  it("shows loading state when isLoading is true", () => {
    const props = {
      ...defaultProps,
      isLoading: true,
      spinnerAriaLabel: "Loading content",
      children: "Loading Button",
    };

    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: /Loading Button/ });
    expect(button).toBeInTheDocument();

    expect(button).toHaveClass("pf-m-progress", "pf-m-in-progress");
  });

  it("renders with proper accessibility attributes for loading state", () => {
    const props = {
      ...defaultProps,
      dataCy: "accessible-loading-button",
      isLoading: true,
      spinnerAriaValueText: "Saving data",
      spinnerAriaLabelledBy: "save-label",
      spinnerAriaLabel: "Save button loading",
      children: "Save",
    };

    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: /Save/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("pf-m-progress", "pf-m-in-progress");
  });

  it("applies PatternFly secondary variant and small size", () => {
    const props = { ...defaultProps, children: "Styled Button" };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Styled Button" });
    expect(button).toHaveClass(
      "pf-v6-c-button",
      "pf-m-secondary",
      "pf-m-small"
    );
  });

  it("applies block styling when isBlock is true", () => {
    const props = { ...defaultProps, isBlock: true, children: "Block Button" };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Block Button" });
    expect(button).toHaveClass("pf-m-block");
  });

  it("applies inline styling when isInLine is true", () => {
    const props = {
      ...defaultProps,
      isInLine: true,
      children: "Inline Button",
    };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Inline Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("pf-v6-c-button");
  });

  it("applies clicked styling when isActive is true", () => {
    const props = {
      ...defaultProps,
      isActive: true,
      children: "Clicked Button",
    };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Clicked Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("pf-v6-c-button", "pf-m-clicked");
  });

  it("does not apply clicked styling when isActive is false", () => {
    const props = {
      ...defaultProps,
      isActive: false,
      children: "Not Clicked Button",
    };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Not Clicked Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("pf-v6-c-button");
    expect(button).not.toHaveClass("pf-m-clicked");
  });

  it("renders children content correctly", () => {
    const complexChildren = (
      <>
        <span>Complex Content</span>
        <strong>Bold Text</strong>
      </>
    );
    const props = { ...defaultProps, children: complexChildren };

    render(<SecondaryButton {...props} />);

    expect(screen.getByText("Complex Content")).toBeInTheDocument();
    expect(screen.getByText("Bold Text")).toBeInTheDocument();
  });

  it("works without click handler", () => {
    const props = { ...defaultProps, children: "No Handler" };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "No Handler" });
    expect(button).toBeInTheDocument();

    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("forwards ref correctly", () => {
    const mockRef = React.createRef<HTMLButtonElement>();
    const props = {
      ...defaultProps,
      innerRef: mockRef,
      children: "Ref Button",
    };

    render(<SecondaryButton {...props} />);

    expect(mockRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(mockRef.current?.textContent).toBe("Ref Button");
  });

  it("handles OUIA attributes correctly", () => {
    const props = {
      ...defaultProps,
      ouijaId: "test-ouia-123",
      ouijaSafe: true,
      children: "OUIA Button",
    };

    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "OUIA Button" });
    expect(button).toHaveAttribute("data-ouia-component-id", "test-ouia-123");
    expect(button).toHaveAttribute("data-ouia-safe", "true");
  });

  it("handles form association correctly", () => {
    const props = { ...defaultProps, form: "test-form", children: "Submit" };

    render(
      <form id="test-form">
        <SecondaryButton {...props} />
      </form>
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("form", "test-form");
  });

  // Additional comprehensive tests
  it("renders with default props and no optional props", () => {
    render(<SecondaryButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: "Test Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-cy", "test-button");
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveClass("pf-m-clicked");
    expect(button).not.toHaveClass("pf-m-block");
    expect(button).not.toHaveClass("pf-m-inline");
  });

  it("shows loading state correctly", () => {
    const localMockClickHandler = vi.fn();
    const props = {
      ...defaultProps,
      isLoading: true,
      onClickHandler: localMockClickHandler,
      children: "Loading Button",
    };

    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: /Loading Button/ });

    expect(button).toHaveClass("pf-m-progress", "pf-m-in-progress");
    expect(button).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const props = { ...defaultProps, classname: "custom-button-class" };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Test Button" });
    expect(button).toHaveClass("custom-button-class");
  });

  it("sets aria-label when provided", () => {
    const props = { ...defaultProps, id: "test-id", name: "test-name" };
    render(<SecondaryButton {...props} />);

    const button = screen.getByRole("button", { name: "Test Button" });
    expect(button).toHaveAttribute("id", "test-id");
    expect(button).toHaveAttribute("name", "test-name");
  });
});
