import React from "react";
// Patternfly
import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../../layouts/SecondaryButton";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// ipaObject utils
import { getParamProperties } from "src/utils/ipaObjectUtils";

export interface PropsToTextInputFromList {
  dataCy: string;
  name: string;
  elementsList: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  metadata: Metadata;
  onOpenModal: () => void;
  onRemove: (idx: number) => void;
  isPrincipalAlias?: boolean | false;
  from: "user" | "host";
}

// This is currently only used for principal aliases
const IpaTextInputFromList = (props: PropsToTextInputFromList) => {
  // Get 'readOnly' to determine if the field has permissions to be edited
  const { readOnly, required } = getParamProperties({
    name: props.name,
    ipaObject: props.ipaObject,
    objectName: props.from,
    metadata: props.metadata,
  });

  const isDisabled = (idx: number) => {
    if (props.isPrincipalAlias) {
      return (
        props.ipaObject["krbcanonicalname"] ===
        props.ipaObject["krbprincipalname"][idx]
      );
    } else {
      return false;
    }
  };

  return (
    <>
      <Flex direction={{ default: "column" }} name={props.name}>
        {props.elementsList !== undefined &&
          props.elementsList.map((element, idx) => (
            <Flex direction={{ default: "row" }} key={idx} name="value">
              <FlexItem
                key={idx}
                flex={{ default: "flex_1" }}
                className="pf-v6-u-ml-lg"
              >
                <TextInput
                  data-cy={props.dataCy + "-textbox-" + element}
                  key={idx}
                  name={props.name}
                  value={element}
                  type="text"
                  aria-label={props.name}
                  isRequired={required}
                  readOnlyVariant={"plain"} // This is always read-only
                />
              </FlexItem>
              <FlexItem
                key={element + "-delete-button"}
                order={{ default: "-1" }}
                title={
                  isDisabled(idx)
                    ? "Can not delete a principal alias that is the same as the canonical alias"
                    : ""
                }
              >
                <SecondaryButton
                  dataCy={props.dataCy + "-button-remove-" + element}
                  name={"remove-principal-alias-" + idx}
                  onClickHandler={() => props.onRemove(idx)}
                  isDisabled={readOnly || isDisabled(idx)}
                >
                  Delete
                </SecondaryButton>
              </FlexItem>
            </Flex>
          ))}
      </Flex>
      <SecondaryButton
        dataCy={props.dataCy + "-button-add"}
        classname="pf-v6-u-mt-md"
        name="add-principal-alias"
        onClickHandler={props.onOpenModal}
        isDisabled={readOnly}
      >
        Add
      </SecondaryButton>
    </>
  );
};

export default IpaTextInputFromList;
