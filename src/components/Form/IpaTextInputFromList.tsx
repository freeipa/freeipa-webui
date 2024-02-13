import React from "react";
// Patternfly
import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// ipaObject utils
import { getParamProperties } from "src/utils/ipaObjectUtils";

interface PropsToTextInputFromList {
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

  // Alerts to show in the UI
  const alerts = useAlerts();

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
      <alerts.ManagedAlerts />
      <Flex direction={{ default: "column" }} name={props.name}>
        {props.elementsList !== undefined &&
          props.elementsList.map((element, idx) => (
            <Flex direction={{ default: "row" }} key={idx} name="value">
              <FlexItem
                key={idx}
                flex={{ default: "flex_1" }}
                className="pf-v5-u-ml-lg"
              >
                <TextInput
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
        classname="pf-v5-u-mt-md"
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
