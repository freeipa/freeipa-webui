import React from "react";
// PatternFly
import { SearchInput } from "@patternfly/react-core";

interface SearchValueData {
  searchValue: string;
  updateSearchValue: (value: string) => void;
  submitSearchValue?: (value?: string) => void;
}

interface PropsToSearchInput {
  name?: string;
  dataCy: string;
  ariaLabel?: string;
  placeholder?: string;
  searchValueData: SearchValueData;
  isDisabled?: boolean;
}

const SearchInputLayout = (props: PropsToSearchInput) => {
  const [inputValue, setInputValue] = React.useState(
    props.searchValueData.searchValue
  );

  const prevSearchValue = React.useRef(props.searchValueData.searchValue);
  if (prevSearchValue.current !== props.searchValueData.searchValue) {
    prevSearchValue.current = props.searchValueData.searchValue;
    setInputValue(props.searchValueData.searchValue);
  }

  const onSearchSubmit = () => {
    props.searchValueData.updateSearchValue(inputValue);
    props.searchValueData.submitSearchValue?.(inputValue);
  };

  return (
    <SearchInput
      data-cy={props.dataCy}
      name={props.name}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      value={inputValue}
      onSearch={onSearchSubmit}
      onChange={(_event, value: string) => setInputValue(value)}
      onClear={() => {
        setInputValue("");
        props.searchValueData.updateSearchValue("");
      }}
      isDisabled={props.isDisabled}
    />
  );
};

export default SearchInputLayout;
