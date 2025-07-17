/* eslint-disable @typescript-eslint/no-unused-vars */

// Disabled, as the plugin can't comprehend that it's actually being used due to object spreading.

import {
  TextInputProps,
  TextAreaProps,
  ButtonProps,
  DropdownProps,
  DropdownItemProps,
  SelectProps,
  SelectOptionProps,
  RadioProps,
  SearchInputProps,
  MenuToggleProps,
} from "@patternfly/react-core";

declare module "@patternfly/react-core" {
  interface TextInputProps {
    "data-cy": string;
  }

  interface TextAreaProps {
    "data-cy": string;
  }

  interface ButtonProps {
    "data-cy": string;
  }

  interface DropdownProps {
    "data-cy": string;
  }

  interface DropdownItemProps {
    "data-cy": string;
  }

  interface SelectProps {
    "data-cy": string;
  }

  interface SelectOptionProps {
    "data-cy": string;
  }

  interface RadioProps {
    "data-cy": string;
  }

  interface SearchInputProps {
    "data-cy": string;
  }

  interface MenuToggleProps {
    "data-cy": string;
  }
}
