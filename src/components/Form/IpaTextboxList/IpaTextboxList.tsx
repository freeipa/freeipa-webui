import React, { useEffect } from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
// Components
// Utils
import { updateIpaObject } from "src/utils/ipaObjectUtils";

export interface PropsToIpaTextboxList {
  dataCy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  setIpaObject: (value: Record<string, unknown>) => void;
  name: string;
  ariaLabel: string;
  validator?: (value: string) => boolean;
}

const IpaTextboxList = (props: PropsToIpaTextboxList) => {
  // Helper to normalize the value from the IPA object (returns a string array)
  const getNormalizedValue = (value: string | string[]): string[] => {
    if (typeof value === "string") {
      // Remove semicolon at the end of the string
      const newValue = value.replace(";", "");
      return [newValue];
    } else {
      return value || [];
    }
  };

  // Side-effecting version for useEffect
  const normalizeValue = (value: string | string[]) => {
    setList(getNormalizedValue(value));
  };

  const [list, setList] = React.useState<string[]>(
    getNormalizedValue(props.ipaObject[props.name])
  );

  const [invalidList, setInvalidList] = React.useState<number[]>([]);

  // Keep the values updated, thus preventing empty values
  React.useEffect(() => {
    normalizeValue(props.ipaObject[props.name]);
  }, [props.ipaObject]);

  // - Add element on list handler
  const onAddHandler = () => {
    const listCopy = [...list];
    listCopy.push("");
    setList(listCopy);
    // Update the IPA object
    updateIpaObject(props.ipaObject, props.setIpaObject, listCopy, props.name);
  };

  // - Change element on list handle
  const onChangeHandler = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    // Update ipaObject
    const listCopy = [...list];
    listCopy[idx] = value;
    setList(listCopy);
    updateIpaObject(props.ipaObject, props.setIpaObject, listCopy, props.name);
  };

  const validateList = () => {
    if (!props.validator) return;

    const newInvalidList: number[] = [];
    list.forEach((value, idx) => {
      if (props.validator !== undefined && !props.validator(value)) {
        newInvalidList.push(idx);
      }
    });
    setInvalidList(newInvalidList);
  };

  useEffect(() => {
    validateList();
  }, [list]);

  // - Remove element on list handler
  const onRemoveHandler = (idx: number) => {
    const listCopy = [...list];
    listCopy.splice(idx, 1);
    if (listCopy.length === 0) {
      setInvalidList([]);
    } else {
      setList(listCopy);
    }
    // Update the IPA object
    updateIpaObject(props.ipaObject, props.setIpaObject, listCopy, props.name);
  };

  return (
    <div data-cy={props.dataCy}>
      <Flex direction={{ default: "column" }} name={props.name}>
        {list.map((item, idx) => (
          <Flex
            direction={{ default: "row" }}
            key={props.name + "-" + idx + "-div"}
            name="value"
            data-cy={props.dataCy + "-div-" + idx}
          >
            <FlexItem
              key={props.name + "-" + idx + "-textbox"}
              flex={{ default: "flex_1" }}
            >
              <TextInput
                data-cy={props.dataCy + "-textbox-" + idx}
                id={props.name + "-" + idx}
                value={item}
                type="text"
                name={props.name + "-" + idx}
                aria-label={props.ariaLabel + " number " + idx}
                onChange={(event, value) => onChangeHandler(value, event, idx)}
                validated={
                  invalidList.includes(idx)
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            </FlexItem>
            <FlexItem key={props.name + "-" + idx + "-delete-button"}>
              <Button
                data-cy={props.dataCy + "-button-delete-" + idx}
                variant="secondary"
                name={"remove-" + props.name + "-" + idx}
                onClick={() => onRemoveHandler(idx)}
                size="sm"
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        ))}
      </Flex>
      <Button
        data-cy={props.dataCy + "-button-add"}
        className="pf-v6-u-mt-sm"
        name={"add-" + props.name}
        onClick={onAddHandler}
        variant="secondary"
      >
        Add
      </Button>
    </div>
  );
};

export default IpaTextboxList;
