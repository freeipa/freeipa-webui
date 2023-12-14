import React from "react";
// PatternFly
import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
// Components
import SecondaryButton from "../layouts/SecondaryButton";
// Utils
import { updateIpaObject } from "src/utils/ipaObjectUtils";

interface PropsToIpaTextboxList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  setIpaObject: (value: Record<string, unknown>) => void;
  name: string;
  ariaLabel: string;
}

const IpaTextboxList = (props: PropsToIpaTextboxList) => {
  const [list, setList] = React.useState<string[]>(
    props.ipaObject[props.name] || []
  );

  // Keep the values updated, thus preventing empty values
  React.useEffect(() => {
    setList(props.ipaObject[props.name] || []);
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
    const listCopy = [...list];
    listCopy[idx] = value;
    setList(listCopy);
    // Update the IPA object
    updateIpaObject(props.ipaObject, props.setIpaObject, listCopy, props.name);
  };

  // - Remove element on list handler
  const onRemoveHandler = (idx: number) => {
    const listCopy = [...list];
    listCopy.splice(idx, 1);
    setList(listCopy);
    // Update the IPA object
    updateIpaObject(props.ipaObject, props.setIpaObject, listCopy, props.name);
  };

  return (
    <>
      <Flex direction={{ default: "column" }} name={props.name}>
        {list.map((item, idx) => (
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
                id={props.name + "-" + idx}
                value={item}
                type="text"
                name={props.name + "-" + idx}
                aria-label={props.ariaLabel + " number " + idx}
                onChange={(event, value) => onChangeHandler(value, event, idx)}
              />
            </FlexItem>
            <FlexItem key={props.name + "-" + idx + "-delete-button"}>
              <SecondaryButton
                name={"remove-" + props.name + "-" + idx}
                onClickHandler={() => onRemoveHandler(idx)}
              >
                Delete
              </SecondaryButton>
            </FlexItem>
          </Flex>
        ))}
      </Flex>
      <SecondaryButton
        classname="pf-v5-u-mt-sm"
        name={"add-" + props.name}
        onClickHandler={onAddHandler}
      >
        Add
      </SecondaryButton>
    </>
  );
};

export default IpaTextboxList;
