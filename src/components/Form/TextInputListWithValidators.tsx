import React from "react";
// Button
import { Button, Flex, FlexItem } from "@patternfly/react-core";
import InputWithValidation, { RuleProps } from "../layouts/InputWithValidation";

interface TextInputListWithValidatorsProps {
  dataCy: string;
  name: string;
  ariaLabel: string;
  list: string[];
  setList: (value: string[]) => void;
  rules: RuleProps[];
  isRequired?: boolean;
}

const TextInputListWithValidators = (
  props: TextInputListWithValidatorsProps
) => {
  // Change element on list handle
  const onChangeHandler = (value: string, idx: number) => {
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
            // eslint-disable-next-line @eslint-react/no-array-index-key
            key={props.name + "-" + idx + "-div"}
            name="value"
          >
            <FlexItem
              // eslint-disable-next-line @eslint-react/no-array-index-key
              key={props.name + "-" + idx + "-textbox"}
              flex={{ default: "flex_1" }}
            >
              <InputWithValidation
                dataCy={props.dataCy + "-" + item}
                id={props.name + "-" + idx}
                value={item}
                name={props.name + "-" + idx}
                aria-label={props.ariaLabel + " number " + idx}
                onChange={(value) => onChangeHandler(value, idx)}
                rules={props.rules}
                isRequired={props.isRequired}
              />
            </FlexItem>
            {/* eslint-disable-next-line @eslint-react/no-array-index-key */}
            <FlexItem key={props.name + "-" + idx + "-delete-button"}>
              <Button
                data-cy={props.dataCy + "-" + item + "-delete-button"}
                variant="secondary"
                name={"remove-" + props.name + "-" + idx}
                onClick={() =>
                  props.setList(props.list.filter((_, i) => i !== idx))
                }
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
        onClick={() => props.setList([...props.list, ""])}
      >
        Add
      </Button>
    </>
  );
};

export default TextInputListWithValidators;
