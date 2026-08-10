import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectOption,
  SelectList,
  SelectOptionProps,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
} from "@patternfly/react-core";
import { CloseIcon } from "@patternfly/react-icons";

type CreationProps<T> = {
  // Whenever this property changes, the options will be reset
  onChangeTarget: T;
};

type TypeAheadWithCheckboxProps<T> = {
  id: string;
  dataCy: string;
  options: SelectOptionProps[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  creationProps?: CreationProps<T>;
};

const NO_RESULTS = "no results";
const CREATE_NEW = "create";

export const TypeAheadWithCheckbox = <T,>({
  id,
  dataCy,
  options,
  selected,
  setSelected,
  creationProps,
}: TypeAheadWithCheckboxProps<T>) => {
  // This is to allow mutations to options property
  const [localOptions, setLocalOptions] =
    useState<SelectOptionProps[]>(options);
  // This one is actually shown, it can contain Create New options and no results
  const [availableOptions, setAvailableOptions] =
    useState<SelectOptionProps[]>(localOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const textInputRef = useRef<HTMLInputElement>(undefined);

  const [previousTarget, setPreviousTarget] = useState<T | null>(null);
  const allowCreation = creationProps !== undefined;

  if (allowCreation && previousTarget !== creationProps?.onChangeTarget) {
    setPreviousTarget(creationProps.onChangeTarget);
    setLocalOptions(options);
    setInputValue("");
  }

  useEffect(() => {
    let newSelectOptions: SelectOptionProps[] = localOptions;

    // Filter menu items based on the text input value when one exists
    if (inputValue) {
      newSelectOptions = localOptions.filter((menuItem) =>
        String(menuItem.children)
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      );

      // If no option matches the filter exactly, display creation option
      if (allowCreation) {
        if (!localOptions.some((option) => option.value === inputValue)) {
          newSelectOptions = [
            ...newSelectOptions,
            {
              children: `Create new option "${inputValue}"`,
              value: CREATE_NEW,
              "data-cy": `${dataCy}-create-new-option`,
            },
          ];
        }
      }

      // When no options are found after filtering, display 'No results found'
      if (newSelectOptions.length === 0) {
        newSelectOptions = [
          {
            "data-cy": `${dataCy}-no-results`,
            isAriaDisabled: true,
            children: `No results found for "${inputValue}"`,
            value: NO_RESULTS,
            hasCheckbox: false,
          },
        ];
      }
    }

    // This sucks, but we're forced to, due to how isOpenCallback
    // works, with memo the we onOpenChange is fired
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setAvailableOptions(newSelectOptions);
    // We mutate options, if we don't, we end up with the same issue as above...
  }, [inputValue, localOptions]);

  const placeholder = `${selected.length} item${selected.length !== 1 ? "s" : ""} selected`;

  const createItemId = (value: string) =>
    `select-multi-typeahead-${value.replace(" ", "-")}`;

  const setActiveAndFocusedItem = (itemIndex: number) => {
    setFocusedItemIndex(itemIndex);
    const focusedItem = availableOptions[itemIndex];
    setActiveItemId(createItemId(focusedItem.value));
  };

  const resetActiveAndFocusedItem = () => {
    setFocusedItemIndex(null);
    setActiveItemId(null);
  };

  const closeMenu = () => {
    setIsOpen(false);
    resetActiveAndFocusedItem();
  };

  const onInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (!inputValue) {
      closeMenu();
    }
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus = 0;

    if (!isOpen) {
      setIsOpen(true);
    }

    if (availableOptions.every((option) => option.isDisabled)) {
      return;
    }

    if (key === "ArrowUp") {
      // When no index is set or at the first index, focus to the last, otherwise decrement focus index
      if (focusedItemIndex === null || focusedItemIndex === 0) {
        indexToFocus = availableOptions.length - 1;
      } else {
        indexToFocus = focusedItemIndex - 1;
      }

      // Skip disabled options
      while (availableOptions[indexToFocus].isDisabled) {
        indexToFocus--;
        if (indexToFocus === -1) {
          indexToFocus = availableOptions.length - 1;
        }
      }
    }

    if (key === "ArrowDown") {
      // When no index is set or at the last index, focus to the first, otherwise increment focus index
      if (
        focusedItemIndex === null ||
        focusedItemIndex === availableOptions.length - 1
      ) {
        indexToFocus = 0;
      } else {
        indexToFocus = focusedItemIndex + 1;
      }

      // Skip disabled options
      while (availableOptions[indexToFocus].isDisabled) {
        indexToFocus++;
        if (indexToFocus === availableOptions.length) {
          indexToFocus = 0;
        }
      }
    }

    setActiveAndFocusedItem(indexToFocus);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const focusedItem =
      focusedItemIndex !== null ? availableOptions[focusedItemIndex] : null;

    switch (event.key) {
      case "Enter":
        if (
          isOpen &&
          focusedItem &&
          focusedItem.value !== NO_RESULTS &&
          !focusedItem.isAriaDisabled
        ) {
          onSelect(focusedItem.value);
        }

        if (!isOpen) {
          setIsOpen(true);
        }

        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
    textInputRef?.current?.focus();
  };

  const onTextInputChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setInputValue(value);
    if (value !== "" && !isOpen) setIsOpen(true);
    resetActiveAndFocusedItem();
  };

  const onSelect = (value: string) => {
    if (value && value !== NO_RESULTS) {
      if (value === CREATE_NEW) {
        if (!availableOptions.some((item) => item.value === inputValue)) {
          setLocalOptions([
            ...localOptions,
            {
              value: inputValue,
              children: inputValue,
              "data-cy": `${dataCy}-${inputValue}-create-new-option`,
            },
          ]);
        }
        setSelected(
          selected.includes(inputValue)
            ? selected.filter((selection) => selection !== inputValue)
            : [...selected, inputValue]
        );
        resetActiveAndFocusedItem();
      } else {
        setSelected(
          selected.includes(value)
            ? selected.filter((selection) => selection !== value)
            : [...selected, value]
        );
      }
    }

    textInputRef.current?.focus();
  };

  const onClearButtonClick = () => {
    setSelected([]);
    setInputValue("");
    resetActiveAndFocusedItem();
    textInputRef?.current?.focus();
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy={`${dataCy}-multi-typeahead-checkbox-menu-toggle`}
      variant="typeahead"
      aria-label="Multi typeahead checkbox menu toggle"
      onClick={onToggleClick}
      innerRef={toggleRef}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={onInputClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id={`${id}-multi-typeahead-select-checkbox-input`}
          autoComplete="off"
          innerRef={textInputRef}
          placeholder={placeholder}
          {...(activeItemId && { "aria-activedescendant": activeItemId })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls={`${id}-select-multi-typeahead-checkbox-listbox`}
        />
        <TextInputGroupUtilities
          {...(selected.length === 0 ? { style: { display: "none" } } : {})}
        >
          <Button
            data-cy={`${dataCy}-multi-typeahead-checkbox-clear-button`}
            variant="plain"
            onClick={onClearButtonClick}
            aria-label="Clear input value"
            icon={<CloseIcon />}
          />
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      data-cy={`${dataCy}-multi-typeahead-checkbox-select`}
      role="menu"
      id={`${id}-multi-typeahead-checkbox-select`}
      isOpen={isOpen}
      selected={selected}
      onSelect={(_event, selection) => onSelect(selection as string)}
      onOpenChange={(isOpen) => {
        if (!isOpen) closeMenu();
      }}
      toggle={toggle}
      variant="typeahead"
      isScrollable
      maxMenuHeight="300px"
    >
      <SelectList
        isAriaMultiselectable
        id={`${id}-select-multi-typeahead-checkbox-listbox`}
      >
        {availableOptions.map((option, index) => (
          <SelectOption
            key={option.value || option.children}
            {...(!option.isDisabled &&
              !option.isAriaDisabled && { hasCheckbox: true })}
            isSelected={selected.includes(option.value)}
            isFocused={focusedItemIndex === index}
            className={option.className}
            id={`${id}-${createItemId(option.value)}`}
            {...option}
            ref={null}
          >
            {option.children}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
