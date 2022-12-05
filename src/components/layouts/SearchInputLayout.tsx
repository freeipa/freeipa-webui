import React from "react";
// PatternFly
import { SearchInput } from "@patternfly/react-core";

interface SearchValueData {
  searchValue: string;
  updateSearchValue: (value: string) => void;
}

interface PropsToSearchInput {
  name?: string;
  ariaLabel?: string;
  placeholder?: string;
  searchValueData: SearchValueData;
}

const SearchInputLayout = (props: PropsToSearchInput) => {
  const onSearchChange = (value: string) => {
    props.searchValueData.updateSearchValue(value);
  };

  return (
    <SearchInput
      name={props.name}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      value={props.searchValueData.searchValue}
      onChange={onSearchChange}
      onClear={() => onSearchChange("")}
    />
  );
};

export default SearchInputLayout;
