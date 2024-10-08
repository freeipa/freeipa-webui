import React from "react";
// PatternFly
import { ToggleGroup, ToggleGroupItem } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";

/**
 * This component provides functionality to handle a set of two toggle
 * groups with idempotent logic (i.e., when one option is selected, the other
 * is deselected).
 */

interface ToggleOptions {
  label: string;
  value: string;
}

interface ToggleOptionProps extends IPAParamDefinition {
  options: ToggleOptions[];
  optionSelected: string;
  setOptionSelected: (value: string) => void;
  className?: string;
  isCompact?: boolean | false;
}

const IpaToggleGroup = (props: ToggleOptionProps) => {
  const { value, required, readOnly } = getParamProperties(props);

  React.useEffect(() => {
    for (const option of props.options) {
      if (option.value === value) {
        props.setOptionSelected(option.label);
        return;
      }
    }
  }, [props.ipaObject]);

  const handleItemClick = (event) => {
    const id = event.currentTarget.id;
    let newValue = value;

    if (props.optionSelected === id) {
      // No change
      return;
    }

    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      for (const option of props.options) {
        if (option.label === id) {
          newValue = option.value;
          break;
        }
      }
      props.setOptionSelected(id);
      updateIpaObject(props.ipaObject, props.onChange, newValue, props.name);
    }
  };

  return (
    <ToggleGroup isCompact={props.isCompact} className={props.className}>
      {props.options.map((option) => (
        <ToggleGroupItem
          key={option.label}
          text={option.label}
          buttonId={option.label}
          isSelected={props.optionSelected === option.label}
          onChange={handleItemClick}
          isDisabled={readOnly || false}
          required={required || false}
        />
      ))}
    </ToggleGroup>
  );
};

export default IpaToggleGroup;
