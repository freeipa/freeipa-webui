/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FormEvent, SyntheticEvent } from "react";
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
  const onSearchChange = (
    _event: FormEvent<HTMLInputElement>,
    value: string
  ) => {
    props.searchValueData.updateSearchValue(value);
  };

  const onSearchClean = (_event: SyntheticEvent<HTMLButtonElement, Event>) => {
    props.searchValueData.updateSearchValue("");
  };

  return (
    <SearchInput
      name={props.name}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      value={props.searchValueData.searchValue}
      onChange={onSearchChange}
      onClear={onSearchClean}
    />
  );
};

export default SearchInputLayout;
