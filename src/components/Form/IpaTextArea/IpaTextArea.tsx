import React from "react";
// PatternFly
import { TextArea } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";

export interface IpaTextAreaProps extends IPAParamDefinition {
  dataCy: string;
}

const IpaTextArea = (props: IpaTextAreaProps) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  const [textareaValue, setTextareaValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextareaValue(convertToString(value));
  }, [value]);

  return (
    <TextArea
      data-cy={props.dataCy}
      id={props.name}
      name={props.name}
      value={textareaValue}
      onChange={(_event, newValue) => {
        setTextareaValue(newValue);
        onChange(newValue);
      }}
      aria-label={props.name}
      isRequired={required}
      readOnlyVariant={readOnly ? "plain" : undefined}
      autoResize
    />
  );
};

export default IpaTextArea;
