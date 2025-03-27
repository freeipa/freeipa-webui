import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, afterEach, it, expect } from "vitest";
// Component
import IpaNumberInput, {
  IPAParamDefinitionNumberInput,
} from "./IpaNumberInput";

// Mock of util function: updateIpaObject
vi.mock("src/utils/ipaObjectUtils", async () => ({
  ...(await vi.importActual("src/utils/ipaObjectUtils.ts")),
  updateIpaObject: vi.fn(),
}));

describe("IpaNumberInput Component", () => {
  const mockOnChange = vi.fn();

  const mockMetadata = {
    objects: {
      sudorule: {
        name: "sudorule",
        takes_params: [
          {
            alwaysask: false,
            attribute: false,
            autofill: false,
            class: "Int",
            cli_metavar: "SUDOORDER2",
            cli_name: "sudoorder2",
            confirm: false,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Mock integer to order the Sudo rules",
            flags: [],
            label: "Mock Sudo order",
            maxvalue: 2147483647,
            minvalue: 0,
            maxlength: 255,
            multivalue: false,
            name: "sudoorder2",
            no_convert: false,
            primary_key: false,
            query: false,
            required: false,
            sortorder: 1,
            type: "Int",
            noextrawhitespace: false,
            pattern_errmsg: "",
            pattern: "",
          },
        ],
      },
    },
  };

  const defaultProps: IPAParamDefinitionNumberInput = {
    ariaLabel: "sudoorder2",
    ipaObject: { sudoorder2: "" }, // Default value
    maxValue: 2147483647,
    minValue: 0,
    name: "sudoorder2",
    numCharsShown: 15,
    objectName: "sudorule",
    onChange: mockOnChange,
    metadata: mockMetadata,
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the NumberInput component with correct props", () => {
    render(<IpaNumberInput {...defaultProps} />);

    // Verify the component exists
    const numberInputElem = screen.getByLabelText("sudoorder2");

    expect(numberInputElem).toBeInTheDocument();
    expect(numberInputElem).toHaveAttribute("name", "sudoorder2");
    expect(numberInputElem).toHaveAttribute("aria-label", "sudoorder2");
    expect(numberInputElem).toBeEnabled();
    expect(numberInputElem).toHaveTextContent("");

    // Buttons exist and are enabled
    const plusButton = screen.getByRole("button", { name: /plus/i });
    const minusButton = screen.getByRole("button", { name: /minus/i });

    expect(plusButton).toBeInTheDocument();
    expect(minusButton).toBeInTheDocument();
    expect(plusButton).toHaveAttribute("aria-disabled", "false");
    expect(minusButton).toHaveAttribute("aria-disabled", "true"); // Disabled
  });

  it("increment number when clicking plus button", () => {
    let value = ""; // Empty by default
    const mockOnChange = vi.fn((newValue) => {
      value = newValue.sudoorder2;
    });

    render(
      <IpaNumberInput
        {...defaultProps}
        onChange={mockOnChange}
        ipaObject={{ sudoorder2: value }}
      />
    );

    const plusButton = screen.getByRole("button", { name: /plus/i });

    // Increment value ("" -> "1")
    fireEvent.click(plusButton);
    expect(mockOnChange).toHaveBeenCalledWith({ sudoorder2: 1 });
    const numberInputElem = screen.getByLabelText("number input");
    numberInputElem.setAttribute("value", value);
    expect(numberInputElem).toHaveValue(1);
  });

  it("decrement number when clicking minus button", () => {
    // Define wrapper to handle states within the tests
    const NumberInputWrapper = () => {
      const [value, setValue] = React.useState(3); // Initial value

      const handleChange = (newValue) => {
        setValue(newValue.sudoorder2);
      };

      return (
        <IpaNumberInput
          {...defaultProps}
          onChange={handleChange}
          ipaObject={{ sudoorder2: value }}
        />
      );
    };

    render(<NumberInputWrapper />);

    // Minus button
    const minusButton = screen.getByRole("button", { name: /minus/i });

    // Number input with initial value
    const numberInputElem = screen.getByLabelText("number input");
    expect(numberInputElem).toHaveValue(3);

    // Decrement value ("3" -> "2")
    fireEvent.click(minusButton);
    expect(numberInputElem).toHaveValue(2);
  });

  it("disables the component if readOnly is true", () => {
    render(<IpaNumberInput {...defaultProps} readOnly={true} />);

    // Get the main pieces of the component
    const numberInputElem = screen.getByLabelText("number input");
    const plusButton = screen.getByRole("button", { name: /plus/i });
    const minusButton = screen.getByRole("button", { name: /minus/i });

    // All elements are disabled
    expect(numberInputElem).toBeDisabled();
    expect(plusButton).toBeDisabled();
    expect(minusButton).toBeDisabled();
  });

  it("disables minus button when value is at minimum", () => {
    render(<IpaNumberInput {...defaultProps} ipaObject={{ sudoorder2: 0 }} />);
    const minusButton = screen.getByRole("button", { name: /minus/i });

    expect(minusButton).toBeDisabled();
  });

  it("disables plus button when value is at maximum", () => {
    render(
      <IpaNumberInput
        {...defaultProps}
        ipaObject={{ sudoorder2: 2147483647 }}
      />
    );
    const plusButton = screen.getByRole("button", { name: /plus/i });

    expect(plusButton).toBeDisabled();
  });
});
