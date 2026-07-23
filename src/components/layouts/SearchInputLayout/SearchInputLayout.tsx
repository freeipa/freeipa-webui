import React from "react";
// PatternFly
import { SearchInput } from "@patternfly/react-core";
// Router
import { useSearchParams } from "react-router";

interface SearchValueData {
  searchValue: string;
  onSubmit: (value: string) => void;
}

interface PropsToSearchInput {
  name?: string;
  dataCy: string;
  ariaLabel?: string;
  placeholder?: string;
  /** Local override for non-list UIs (e.g. DualListLayout). When omitted, uses URL search params. */
  searchValueData?: SearchValueData;
  isDisabled?: boolean;
}

const SearchInputLayout = (props: PropsToSearchInput) => {
  const [params, setParams] = useSearchParams();
  const committedSearchValue =
    props.searchValueData !== undefined
      ? props.searchValueData.searchValue
      : params.get("search") || "";
  const [inputValue, setInputValue] = React.useState(committedSearchValue);
  const prevSearchValue = React.useRef(committedSearchValue);
  if (prevSearchValue.current !== committedSearchValue) {
    prevSearchValue.current = committedSearchValue;
    setInputValue(committedSearchValue);
  }

  const commitSearch = (value: string) => {
    if (props.searchValueData !== undefined) {
      props.searchValueData.onSubmit(value);
      return;
    }
    setParams(
      (currentParams) => {
        if (value !== "") {
          currentParams.set("search", value);
        } else {
          currentParams.delete("search");
        }
        // Reset to first page when search changes
        currentParams.delete("p");
        return currentParams;
      },
      { replace: true }
    );
  };

  return (
    <SearchInput
      data-cy={props.dataCy}
      name={props.name}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      value={inputValue}
      onSearch={(_, value: string) => commitSearch(value)}
      onChange={(_event, value: string) => setInputValue(value)}
      onClear={() => {
        setInputValue("");
        commitSearch("");
      }}
      isDisabled={props.isDisabled}
    />
  );
};

export default SearchInputLayout;
