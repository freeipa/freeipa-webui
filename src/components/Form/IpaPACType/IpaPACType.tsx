import React from "react";
// PatternFly
import { Checkbox, Radio } from "@patternfly/react-core";
// Utils
import {
  BasicType,
  IPAParamDefinition,
  getParamProperties,
  toArray,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";

export interface IpaPACTypeProps extends IPAParamDefinition {
  dataCy: string;
}

const IpaPACType = (props: IpaPACTypeProps) => {
  const { readOnly, value } = getParamProperties(props);

  // States
  const [isInheritedChecked, setIsInheritedChecked] = React.useState(false);
  const [isOverrideChecked, setIsOverrideChecked] = React.useState(false);
  const [isMsPacChecked, setIsMsPacChecked] = React.useState(false);
  const [isPadChecked, setIsPadChecked] = React.useState(false);

  const valueAsArray = toArray(value);

  const onChangeInheritedRadio = (isChecked: boolean) => {
    setIsInheritedChecked(isChecked);
    setIsOverrideChecked(!isChecked);
    setIsMsPacChecked(false);
    setIsPadChecked(false);
  };

  const onChangeOverrideRadio = (isChecked: boolean) => {
    setIsOverrideChecked(isChecked);
    setIsInheritedChecked(!isChecked);
  };

  // Set values from the API data
  React.useEffect(() => {
    // Default values
    setIsInheritedChecked(false);
    setIsOverrideChecked(false);
    setIsMsPacChecked(false);
    setIsPadChecked(false);

    if (valueAsArray === undefined || valueAsArray.length === 0) {
      onChangeInheritedRadio(true);
    } else {
      if (valueAsArray.includes("NONE")) {
        onChangeOverrideRadio(true);
      }
      if (valueAsArray.includes("MS-PAC")) {
        setIsOverrideChecked(true);
        setIsMsPacChecked(true);
      }
      if (valueAsArray.includes("PAD")) {
        setIsOverrideChecked(true);
        setIsPadChecked(true);
      }
    }
  }, [valueAsArray]);

  // Updates the list of checked values when a specific option is clicked
  const updateList = (checked: boolean, elementToChange: string) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      let updatedList: BasicType[] = [];

      if (elementToChange === "inherited") {
        updatedList = [];
        onChangeInheritedRadio(checked);
      } else if (elementToChange === "override") {
        updatedList = ["NONE"];
        onChangeOverrideRadio(checked);
      } else {
        setIsOverrideChecked(true);
        if (elementToChange === "MS-PAC") {
          setIsMsPacChecked(checked);
        }
        if (elementToChange === "PAD") {
          setIsPadChecked(checked);
        }

        // If checking the value, remove the 'NONE' value if it exists
        if (checked) {
          const index = valueAsArray.indexOf("NONE");
          if (index > -1) {
            valueAsArray.splice(index, 1);
          }
          updatedList = [...valueAsArray, elementToChange];
        } else {
          // If unchecking the value
          const index = valueAsArray.indexOf(elementToChange);
          if (index > -1) {
            valueAsArray.splice(index, 1);
          }
          updatedList = valueAsArray;

          // Set 'NONE' again if no other values are selected within the 'override' option
          if (updatedList.length === 0) {
            updatedList = ["NONE"];
          }
        }
      }
      updateIpaObject(props.ipaObject, props.onChange, updatedList, props.name);
    }
  };

  return (
    <>
      <Radio
        data-cy={props.dataCy + "-inherited"}
        isChecked={isInheritedChecked}
        name="inherited"
        onChange={(_event, value) => updateList(value, "inherited")}
        label="Inherited from server configuration"
        id="inherited-from-server-conf"
        isDisabled={readOnly}
      />
      <Radio
        data-cy={props.dataCy + "-override"}
        isChecked={isOverrideChecked}
        name="override"
        onChange={(_event, value) => updateList(value, "override")}
        label="Override inherited settings"
        id="override-inherited-settings"
        isDisabled={readOnly}
      />
      <Checkbox
        data-cy={props.dataCy + "-ms-pac"}
        label="MS-PAC"
        isChecked={isMsPacChecked}
        onChange={(_event, value) => updateList(value, "MS-PAC")}
        isDisabled={!isOverrideChecked && readOnly}
        id="ms-pac-checkbox"
        name="ms-pac"
        className="pf-v5-u-ml-lg"
      />
      <Checkbox
        data-cy={props.dataCy + "-pad"}
        label="PAD"
        isChecked={isPadChecked}
        onChange={(_event, value) => updateList(value, "PAD")}
        isDisabled={!isOverrideChecked && readOnly}
        id="pad-checkbox"
        name="pad"
        className="pf-v5-u-ml-lg"
      />
    </>
  );
};

export default IpaPACType;
