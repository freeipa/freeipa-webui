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
import SecondaryButton from "../../layouts/SecondaryButton";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";

export interface PropsToIpaTextboxList extends IPAParamDefinition {
  dataCy: string;
  validator?: (value: string) => boolean;
}

const IpaTextboxList = (props: PropsToIpaTextboxList) => {
  const { readOnly } = getParamProperties(props);

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

  const ipaObject = props.ipaObject || {};

  const [list, setList] = React.useState<string[]>(
    getNormalizedValue(ipaObject[props.name] as string | string[])
  );

  const [invalidList, setInvalidList] = React.useState<number[]>([]);

  // Keep the values updated, thus preventing empty values
  React.useEffect(() => {
    normalizeValue(ipaObject[props.name] as string | string[]);
  }, [props.ipaObject]);

  // - Add element on list handler
  const onAddHandler = () => {
    const listCopy = [...list];
    listCopy.push("");
    setList(listCopy);
    // Update the IPA object
    if (props.onChange) {
      updateIpaObject(ipaObject, props.onChange, listCopy, props.name);
    }
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
    if (props.onChange) {
      updateIpaObject(ipaObject, props.onChange, listCopy, props.name);
    }
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
    if (props.onChange) {
      updateIpaObject(ipaObject, props.onChange, listCopy, props.name);
    }
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
                aria-label={
                  props.ariaLabel !== undefined
                    ? props.ariaLabel + " number " + idx
                    : props.name + " number " + idx
                }
                onChange={(event, value) => onChangeHandler(value, event, idx)}
                validated={
                  invalidList.includes(idx)
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
                readOnlyVariant={readOnly ? "plain" : undefined}
              />
            </FlexItem>
            {!readOnly && (
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
            )}
          </Flex>
        ))}
      </Flex>
      {!readOnly && (
        <SecondaryButton
          dataCy={props.dataCy + "-button-add"}
          classname="pf-v6-u-mt-sm"
          name={"add-" + props.name}
          onClickHandler={onAddHandler}
        >
          Add
        </SecondaryButton>
      )}
    </div>
  );
};

export default IpaTextboxList;
