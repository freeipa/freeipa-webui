import React from "react";
// Button
import { TextInput, Button, Flex, FlexItem } from "@patternfly/react-core";

interface TextInputListProps {
  dataCy: string;
  name: string;
  ariaLabel: string;
  list: string[];
  setList: (value: string[]) => void;
}

const TextInputList = (props: TextInputListProps) => {
  // Add element on list handler
  const onAddHandler = () => {
    props.setList([...props.list, ""]);
  };

  // Remove element on list handler
  const onRemoveHandler = (idx: number) => {
    const listCopy = [...props.list];
    listCopy.splice(idx, 1);
    if (listCopy.length === 0) {
      props.setList([]);
    } else {
      props.setList(listCopy);
    }
  };

  // Change element on list handle
  const onChangeHandler = (
    value: string,
    _event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    // Update ipaObject
    const listCopy = [...props.list];
    listCopy[idx] = value;
    props.setList(listCopy);
  };

  return (
    <>
      <Flex direction={{ default: "column" }} name={props.name}>
        {props.list.map((item, idx) => (
          <Flex
            direction={{ default: "row" }}
            key={props.name + "-" + idx + "-div"}
            name="value"
          >
            <FlexItem
              key={props.name + "-" + idx + "-textbox"}
              flex={{ default: "flex_1" }}
            >
              <TextInput
                data-cy={props.dataCy + "-" + item}
                id={props.name + "-" + idx}
                value={item}
                type="text"
                name={props.name + "-" + idx}
                aria-label={props.ariaLabel + " number " + idx}
                onChange={(event, value) => onChangeHandler(value, event, idx)}
              />
            </FlexItem>
            <FlexItem key={props.name + "-" + idx + "-delete-button"}>
              <Button
                data-cy={props.dataCy + "-" + item + "-delete-button"}
                variant="secondary"
                name={"remove-" + props.name + "-" + idx}
                onClick={() => onRemoveHandler(idx)}
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        ))}
      </Flex>
      <Button
        data-cy={props.dataCy + "-add-button"}
        variant="secondary"
        className="pf-v6-u-mt-sm"
        name={"add-" + props.name}
        onClick={onAddHandler}
      >
        Add
      </Button>
    </>
  );
};

export default TextInputList;
