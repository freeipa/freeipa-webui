import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// Component
import PasswordInput, { PropsToPasswordInput } from "./PasswordInput";

const mockOnChange = vi.fn();
const mockOnRevealHandler = vi.fn();

const initialProps: PropsToPasswordInput = {
  dataCy: "password-input",
  name: "Password",
  onChange: mockOnChange,
  onRevealHandler: mockOnRevealHandler,
  value: "Secret123",
};

describe("PasswordInput Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the PasswordInput component", async () => {
    render(<PasswordInput {...initialProps} />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveValue("Secret123");
    expect(password).toHaveAttribute("type", "text");
  });

  it("renders the PasswordInput component unobscured", async () => {
    const props: PropsToPasswordInput = {
      ...initialProps,
      passwordHidden: true,
    };

    render(<PasswordInput {...props} />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveValue("Secret123");
    expect(password).toHaveAttribute("type", "password");
  });

  it("allows changing PasswordInput component", async () => {
    const props: PropsToPasswordInput = {
      ...initialProps,
      value: "",
    };

    const PASSWORD = "Secret123";

    render(<PasswordInput {...props} />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveValue("");
    expect(password).toHaveAttribute("type", "text");

    fireEvent.change(password, { target: { value: PASSWORD } });
    expect(mockOnChange).toHaveBeenCalledExactlyOnceWith(PASSWORD);
  });

  it("allows to preview the PasswordInput component", async () => {
    render(<PasswordInput {...initialProps} />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveValue("Secret123");
    expect(password).toHaveAttribute("type", "text");

    // Show
    const hideButton = screen.getByLabelText("Hide password");
    fireEvent.click(hideButton);

    expect(mockOnRevealHandler).toHaveBeenCalledExactlyOnceWith(true);
  });
});
