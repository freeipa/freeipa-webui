import React from "react";
// Patternfly
import { Flex, FlexItem } from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Fields
import IpaTextInputWithId from "./IpaTextInputWithId";
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
}

const IpaTextInputFromList = (props: PropsToTextInputFromList) => {
  const [elementsList, setElementsList] = React.useState(props.elementsList);

  // Get 'readOnly' to determine if the field has permissions to be edited
  const { readOnly } = getParamProperties({
    name: props.name,
    ipaObject: props.ipaObject,
    objectName: "user",
    metadata: props.metadata,
  });

  // Alerts to show in the UI
  const alerts = useAlerts();

  React.useEffect(() => {
    setElementsList(props.elementsList);
  }, [props.elementsList]);

  return (
    <>
      <alerts.ManagedAlerts />
      <Flex direction={{ default: "column" }} name={props.name}>
        {elementsList !== undefined &&
          elementsList.map((element, idx) => (
            <Flex direction={{ default: "row" }} key={idx} name="value">
              <FlexItem
                key={idx}
                flex={{ default: "flex_1" }}
                className="pf-u-ml-lg"
              >
                <IpaTextInputWithId
                  id={props.name + "-" + idx}
                  value={element}
                  name={props.name}
                  ipaObject={props.ipaObject}
                  objectName="user"
                  metadata={props.metadata}
                  idx={idx}
                  readOnly={true} // This field is always read-only
                />
              </FlexItem>
              <FlexItem
                key={element + "-delete-button"}
                order={{ default: "-1" }}
              >
                <SecondaryButton
                  name="remove"
                  onClickHandler={() => props.onRemove(idx)}
                  isDisabled={readOnly}
                >
                  Delete
                </SecondaryButton>
              </FlexItem>
            </Flex>
          ))}
      </Flex>
      <SecondaryButton
        classname="pf-u-mt-md"
        name="add"
        onClickHandler={props.onOpenModal}
        isDisabled={readOnly}
      >
        Add
      </SecondaryButton>
    </>
  );
};

export default IpaTextInputFromList;
