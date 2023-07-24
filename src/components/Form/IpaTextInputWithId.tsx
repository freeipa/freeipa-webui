import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinitionWithIndex,
  convertToString,
  getParamPropertiesWithIndex,
} from "src/utils/ipaObjectUtils";

const IpaTextInputWithId = (props: IPAParamDefinitionWithIndex) => {
  const { required, readOnly, value, idx } = getParamPropertiesWithIndex(props);

  const [paramValue, setParamValue] = React.useState("");

  React.useEffect(() => {
    if (props.value !== undefined) {
      setParamValue(props.value);
    } else {
      setParamValue(convertToString(value));
    }
  }, [props.value, value]);

  return (
    <TextInput
      key={idx}
      id={props.id || props.name}
      name={props.name}
      value={paramValue}
      type="text"
      aria-label={props.name}
      isRequired={required}
      readOnlyVariant={readOnly ? "plain" : undefined}
    />
  );
};

export default IpaTextInputWithId;
