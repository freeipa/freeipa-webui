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
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  toArray,
  updateCheckboxList as updateListUtil,
} from "src/utils/ipaObjectUtils";

export interface CheckboxOption {
  value: string;
  text: string;
}

export interface IPAParamDefinitionCheckboxListWithFilter
  extends IPAParamDefinition {
  dataCy: string;
  options: CheckboxOption[];
  maxHeight?: string;
}

const IpaCheckboxListWithFilter = (
  props: IPAParamDefinitionCheckboxListWithFilter
) => {
  const { readOnly, value } = getParamProperties(props);

  // Filter state
  const [filterValue, setFilterValue] = React.useState("");

  // Convert value to array of selected values
  const valueAsArray = toArray(value).filter(
    (val): val is string => val !== undefined
  );

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

  // Updates the list of checked values when a specific checkbox is clicked
  const updateList = (checked: boolean, elementToChange: string) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      updateListUtil(
        checked,
        elementToChange,
        valueAsArray,
        props.ipaObject,
        props.onChange,
        props.name
      );
    }
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
          placeholder="Filter options..."
          value={filterValue}
          onChange={onFilterChange}
          onClear={onFilterClear}
          aria-label={`Filter ${props.name} options`}
          isDisabled={readOnly}
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
                    updateList(checked, option.value)
                  }
                  readOnly={readOnly}
                  isChecked={
                    valueAsArray.find((val) => val === option.value) !==
                    undefined
                  }
                  aria-label={option.text}
                  isDisabled={readOnly}
                />
              </GridItem>
            ))}
          </Grid>
        )}
      </FlexItem>
    </Flex>
  );
};

export default IpaCheckboxListWithFilter;
