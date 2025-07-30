/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FormEvent, SyntheticEvent } from "react";
// PatternFly
import { SearchInput } from "@patternfly/react-core";

interface SearchValueData {
  searchValue: string;
  updateSearchValue: (value: string) => void;
  submitSearchValue?: () => void;
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
  const onSearchChange = (
    _event: FormEvent<HTMLInputElement>,
    value: string
  ) => {
    props.searchValueData.updateSearchValue(value);
  };

  const onSearchClear = (_event: SyntheticEvent<HTMLButtonElement, Event>) => {
    props.searchValueData.updateSearchValue("");
  };

  return (
    <SearchInput
      data-cy={props.dataCy}
      name={props.name}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      value={props.searchValueData.searchValue}
      onSearch={
        props.searchValueData.submitSearchValue
          ? props.searchValueData.submitSearchValue
          : () => void undefined
      }
      onChange={onSearchChange}
      onClear={onSearchClear}
      isDisabled={props.isDisabled}
    />
  );
};

export default SearchInputLayout;
