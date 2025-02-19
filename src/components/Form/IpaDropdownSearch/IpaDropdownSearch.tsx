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
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
} from "src/utils/ipaObjectUtils";
import { updateIpaObject } from "src/utils/ipaObjectUtils";

export interface IPAParamDefinitionDropdown extends IPAParamDefinition {
  id?: string;
  setIpaObject?: (ipaObject: Record<string, unknown>) => void;
  onSelect?: (username: string) => void; // For non-ipaObjects
  options: string[];
  ariaLabelledBy?: string;
  onSearch: (value: string) => void;
  ipaObject?: Record<string, unknown>;
}

const IpaDropdownSearch = (props: IPAParamDefinitionDropdown) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const { value } = getParamProperties(props);
  const ipaObject = props.ipaObject || {};

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    if (ipaObject && props.setIpaObject !== undefined) {
      updateIpaObject(ipaObject, props.setIpaObject, selection, props.name);
    }
    if (props.onSelect !== undefined) {
      props.onSelect(selection as string);
    }
    props.onSearch("");
    setSearchValue("");
    setIsOpen(false);
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  // Removed selected value from options
  const options = props.options.filter((item) => item !== value);

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
          {value}
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
            onSearch={() => props.onSearch(searchValue)}
            onClear={() => {
              setSearchValue("");
              props.onSearch("");
            }}
            aria-labelledby="pf-v5-context-selector-search-button-id-1"
          />
        </MenuSearchInput>
      </MenuSearch>
      <Divider />
      <DropdownList>
        {options.map((option, index) => (
          <DropdownItem value={option} key={index}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

export default IpaDropdownSearch;
