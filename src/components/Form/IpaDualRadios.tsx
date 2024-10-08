import React from "react";
// PatternFly
import { Flex, FlexItem, Radio } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";

/**
 * This component provides functionality to handle a set of two radio
 * buttons with idempotent logic (i.e., when one radio button is selected,
 * the other is deselected).
 */

interface RadioOption extends IPAParamDefinition {
  firstRadioName: string;
  secondRadioName: string;
  optionChecked: string;
  setOptionChecked: (value: string) => void;
  className?: string;
  flex?: boolean;
}

const IpaDualRadios = (props: RadioOption) => {
  const { required, readOnly, value } = getParamProperties(props);

  React.useEffect(() => {
    if (value === "all") {
      props.setOptionChecked("first");
    } else if (value === "" || value === undefined) {
      props.setOptionChecked("second");
    }
  }, [props.ipaObject]);

  const handleChange = (radioSelected: "first" | "second") => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      let newValue = value;
      if (radioSelected === "first") {
        newValue = "all";
      } else {
        newValue = "";
      }
      props.setOptionChecked(newValue);
      updateIpaObject(props.ipaObject, props.onChange, newValue, props.name);
    }
  };

  return (
    <Flex>
      <FlexItem>
        <Radio
          isChecked={props.optionChecked === "first"}
          readOnly={readOnly}
          required={required}
          name={props.name}
          onClick={() => handleChange("first")}
          label={props.firstRadioName}
          aria-label={props.ariaLabel}
          id={props.name + "-first-radio"}
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={props.optionChecked === "second"}
          readOnly={readOnly}
          required={required}
          name={props.name}
          onClick={() => handleChange("second")}
          label={props.secondRadioName}
          aria-label={props.ariaLabel}
          id={props.name + "-second-radio"}
        />
      </FlexItem>
    </Flex>
  );
};

export default IpaDualRadios;
