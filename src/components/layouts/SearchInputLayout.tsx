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

  const onSearchClean = (_event: SyntheticEvent<HTMLButtonElement, Event>) => {
    props.searchValueData.updateSearchValue("");
  };

  const onSubmit = () => {
    if (props.searchValueData.submitSearchValue) {
      props.searchValueData.submitSearchValue();
    }
  };

  return (
    <SearchInput
      name={props.name}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      value={props.searchValueData.searchValue}
      onSearch={
        props.searchValueData.submitSearchValue
          ? onSubmit
          : () => void undefined
      }
      onChange={onSearchChange}
      onClear={onSearchClean}
      isDisabled={props.isDisabled}
    />
  );
};

export default SearchInputLayout;
