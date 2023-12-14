import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";

const IpaTextInput = (props: IPAParamDefinition) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  return (
    <TextInput
      id={props.name}
      name={props.name}
      value={convertToString(value)}
      onChange={(_event, value) => onChange(value)}
      type="text"
      aria-label={props.name}
      isRequired={required}
      readOnlyVariant={readOnly ? "plain" : undefined}
    />
  );
};

export default IpaTextInput;
