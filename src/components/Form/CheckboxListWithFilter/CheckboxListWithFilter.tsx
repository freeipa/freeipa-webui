import React from "react";
// PatternFly
import {
  Checkbox,
  SearchInput,
  Flex,
  FlexItem,
  Grid,
  GridItem,
} from "@patternfly/react-core";

export interface CheckboxOption {
  value: string;
  text: string;
}

export interface CheckboxListWithFilterProps {
  dataCy: string;
  name: string;
  ariaLabel?: string;
  options: CheckboxOption[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  maxHeight?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  placeholder?: string;
}

const CheckboxListWithFilter = (props: CheckboxListWithFilterProps) => {
  // Filter state
  const [filterValue, setFilterValue] = React.useState("");

  // Filter options based on search value
  const filteredOptions = React.useMemo(() => {
    if (!filterValue.trim()) {
      return props.options;
    }
    const lowerFilter = filterValue.toLowerCase();
    return props.options.filter(
      (option) =>
        option.text.toLowerCase().includes(lowerFilter) ||
        option.value.toLowerCase().includes(lowerFilter)
    );
  }, [props.options, filterValue]);

  // Updates the list of selected values when a checkbox is clicked
  const updateSelection = (checked: boolean, value: string) => {
    const updatedList = [...props.selectedValues];
    if (checked) {
      updatedList.push(value);
    } else {
      const index = updatedList.indexOf(value);
      if (index > -1) {
        updatedList.splice(index, 1);
      }
    }
    props.setSelectedValues(updatedList);
  };

  // Handle filter change
  const onFilterChange = (
    _event: React.FormEvent<HTMLInputElement>,
    newValue: string
  ) => {
    setFilterValue(newValue);
  };

  // Handle filter clear
  const onFilterClear = () => {
    setFilterValue("");
  };

  return (
    <Flex direction={{ default: "column" }} data-cy={props.dataCy}>
      {/* Search/Filter input */}
      <FlexItem className="pf-v6-u-mb-md">
        <SearchInput
          data-cy={props.dataCy + "-filter"}
          placeholder={props.placeholder || "Filter options..."}
          value={filterValue}
          onChange={onFilterChange}
          onClear={onFilterClear}
          aria-label={props.ariaLabel || `Filter ${props.name} options`}
          isDisabled={props.isDisabled}
        />
      </FlexItem>

      {/* Checkbox list in two columns */}
      <FlexItem
        className="pf-v6-u-overflow-y-auto"
        style={{ maxHeight: props.maxHeight || "300px" }}
      >
        {filteredOptions.length === 0 ? (
          <p className="pf-v6-u-color-200 pf-v6-u-font-size-sm">
            No options match the filter.
          </p>
        ) : (
          <Grid hasGutter>
            {filteredOptions.map((option) => (
              <GridItem
                key={props.name + "-" + option.value}
                span={4}
                className="pf-v6-u-mb-xs"
              >
                <Checkbox
                  data-cy={props.dataCy + "-" + option.value}
                  id={props.name + "-" + option.value}
                  name={props.name}
                  label={option.text}
                  onChange={(_event, checked) =>
                    updateSelection(checked, option.value)
                  }
                  isChecked={props.selectedValues.includes(option.value)}
                  aria-label={option.text}
                  isDisabled={props.isDisabled}
                />
              </GridItem>
            ))}
          </Grid>
        )}
      </FlexItem>
    </Flex>
  );
};

export default CheckboxListWithFilter;
