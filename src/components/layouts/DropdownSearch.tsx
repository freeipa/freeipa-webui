import React from "react";
// PatternFly
import {
  Divider,
  MenuToggle,
  MenuToggleElement,
  MenuSearch,
  MenuSearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  SearchInput,
} from "@patternfly/react-core";
import { useGetIDListMutation, GenericPayload } from "src/services/rpc";

interface DropdownProps {
  id?: string;
  onSelect: (value: string) => void;
  options: string[];
  ariaLabelledBy?: string;
  searchType: string;
  value: string;
}

const DropdownSearch = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [options, setOptions] = React.useState(props.options);

  const [retrieveUsers] = useGetIDListMutation({});

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    props.onSelect(selection as string);
    setSearchValue("");
    setIsOpen(false);
    setOptions(props.options);
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  // Search for specifc users
  const submitSearchValue = (value: string) => {
    if (value === "") {
      // Reset options
      setOptions(props.options);
      return;
    } else {
      // Searching
      setOptions(["Searching ..."]);
    }
    retrieveUsers({
      searchValue: value,
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 199,
      entryType: props.searchType,
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
        setOptions(result.data.list);
      } else {
        setOptions([]);
      }
      setIsOpen(true);
    });
  };

  // Removed selected value from options
  const filteredOptions = options.filter((item) => item !== props.value);

  return (
    <Dropdown
      id={props.id || "dropdown-search"}
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          isFullWidth
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          {props.value}
        </MenuToggle>
      )}
      ouiaId="BasicDropdown"
      shouldFocusToggleOnSelect
      isScrollable
    >
      <MenuSearch>
        <MenuSearchInput>
          <SearchInput
            value={searchValue}
            placeholder="Search"
            onChange={(_event, value) => setSearchValue(value)}
            onSearch={() => submitSearchValue(searchValue)}
            onClear={() => {
              setSearchValue("");
            }}
          />
        </MenuSearchInput>
      </MenuSearch>
      <Divider />
      <DropdownList>
        {filteredOptions.map((option, index) => (
          <DropdownItem value={option} key={index}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export default DropdownSearch;
