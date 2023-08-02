import React from "react";
// PatternFly
import { Checkbox } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinitionCheckbox,
  getParamPropertiesCheckBox,
} from "src/utils/ipaObjectUtils";

const IpaCheckbox = (props: IPAParamDefinitionCheckbox) => {
  const { required, readOnly, onChange, className } =
    getParamPropertiesCheckBox(props);
  const [isChecked, setIsChecked] = React.useState(false);

  React.useEffect(() => {
    if (props.ipaObject !== undefined && props.value !== undefined) {
      const checkboxesStateList = props.ipaObject[props.name] as string[];
      if (checkboxesStateList !== undefined) {
        const index = checkboxesStateList.indexOf(props.value);

        if (index > -1) {
          setIsChecked(true);
        } else {
          setIsChecked(false);
        }
      }
    }
  }, [props.ipaObject]);

  return (
    <Checkbox
      id={props.id || ""}
      name={props.name}
      label={props.value}
      onChange={onChange}
      isRequired={required}
      readOnly={readOnly}
      isChecked={isChecked}
      aria-label={props.name}
      className={className}
      isDisabled={readOnly}
    />
  );
};

export default IpaCheckbox;
