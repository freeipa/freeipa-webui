import React from "react";
// PatternFly
import { TextArea } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";

const IpaTextArea = (props: IPAParamDefinition) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  return (
    <TextArea
      id={props.name}
      name={props.name}
      value={convertToString(value)}
      onChange={(_event, value) => onChange(value)}
      aria-label={props.name}
      isRequired={required}
      readOnlyVariant={readOnly ? "plain" : undefined}
      autoResize
    />
  );
};

export default IpaTextArea;
