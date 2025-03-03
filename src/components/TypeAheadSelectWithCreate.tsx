import React from "react";
// PatternFly
import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  SelectOptionProps,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";

interface PropsToTypeAheadSelectWithCreate {
  id: string;
  options: SelectOptionProps[];
  selected: string;
  onSelectedChange: (selected: string) => void;
}

const TypeAheadSelectWithCreate = (props: PropsToTypeAheadSelectWithCreate) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [selectOptions, setSelectOptions] = React.useState<SelectOptionProps[]>(
    props.options
  );
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(
    null
  );
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const [onCreation, setOnCreation] = React.useState<boolean>(false); // Boolean to refresh filter state after new option is created
  const textInputRef = React.useRef<HTMLInputElement>();

  React.useEffect(() => {
    setSelectOptions(props.options);
  }, [props.options]);

  React.useEffect(() => {
    let newSelectOptions: SelectOptionProps[] = props.options;

    // Filter menu items based on the text input value when one exists
    if (filterValue) {
      newSelectOptions = props.options.filter((menuItem) =>
        String(menuItem.children)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );

      // When no options are found after filtering, display creation option
      if (!newSelectOptions.length) {
        newSelectOptions = [
          {
            isDisabled: false,
            children: `Create new option "${filterValue}"`,
            value: "create",
          },
        ];
      }

      // Open the menu when the input value changes and the new value is not empty
      if (!isOpen) {
        setIsOpen(true);
      }
    }

    setSelectOptions(newSelectOptions);
    setActiveItem(null);
    setFocusedItemIndex(null);
  }, [filterValue, onCreation]);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    if (value) {
      if (value === "create") {
        props.onSelectedChange(filterValue);
        setOnCreation(!onCreation);
        setFilterValue("");
      } else {
        setInputValue(value as string);
        setFilterValue("");
        props.onSelectedChange(value as string);
      }
    }

    setIsOpen(false);
    setFocusedItemIndex(null);
    setActiveItem(null);
  };

  const onTextInputChange = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setInputValue(value);
    setFilterValue(value);
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === "ArrowUp") {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === "ArrowDown") {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (
          focusedItemIndex === null ||
          focusedItemIndex === selectOptions.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus);
      const focusedItem = selectOptions.filter((option) => !option.isDisabled)[
        indexToFocus
      ];
      setActiveItem(
        `select-create-typeahead-${focusedItem.value.replace(" ", "-")}`
      );
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = selectOptions.filter(
      (option) => !option.isDisabled
    );
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex
      ? enabledMenuItems[focusedItemIndex]
      : firstMenuItem;

    switch (event.key) {
      // Select the first available option
      case "Enter":
        if (isOpen) {
          onSelect(undefined, focusedItem.value as string);
          setIsOpen((prevIsOpen) => !prevIsOpen);
          setFocusedItemIndex(null);
          setActiveItem(null);
        }

        setIsOpen((prevIsOpen) => !prevIsOpen);
        setFocusedItemIndex(null);
        setActiveItem(null);

        break;
      case "Tab":
      case "Escape":
        setIsOpen(false);
        setActiveItem(null);
        break;
      case "ArrowUp":
      case "ArrowDown":
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={onToggleClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id={props.id + "-select-create-typeahead"}
          autoComplete="off"
          innerRef={textInputRef}
          {...(activeItem && { "aria-activedescendant": activeItem })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-create-typeahead-listbox"
        />

        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              variant="plain"
              onClick={() => {
                props.onSelectedChange("");
                setInputValue("");
                setFilterValue("");
                textInputRef?.current?.focus();
              }}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id={props.id + "-select"}
      isOpen={isOpen}
      selected={props.selected}
      onSelect={onSelect}
      onOpenChange={() => {
        setIsOpen(false);
      }}
      toggle={toggle}
    >
      <SelectList id={props.id + "-select-list"}>
        {selectOptions.map((option, index) => (
          <SelectOption
            key={option.value || option.children}
            isFocused={focusedItemIndex === index}
            className={option.className}
            id={props.id + "-select-option-" + index}
            {...option}
            ref={null}
          />
        ))}
      </SelectList>
    </Select>
  );
};

export default TypeAheadSelectWithCreate;
