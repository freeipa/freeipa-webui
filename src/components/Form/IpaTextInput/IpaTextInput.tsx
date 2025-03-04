import React from "react";
// PatternFly
import { TextContent, TextInput } from "@patternfly/react-core";
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";
// React Router DOM
import { Link } from "react-router-dom";

const IpaTextInput = (props: IPAParamDefinition) => {
  const { required, readOnly, value, onChange } = getParamProperties(props);

  const [textInputValue, setTextInputValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextInputValue(convertToString(value));
  }, [value]);

  return (
    <>
      {props.linkTo !== undefined && !!readOnly ? (
        <>
          {/* Assuming readOnly=true when link is provided. Showing a Text instead of TextInput */}
          <TextContent
            aria-label={
              props.ariaLabel !== undefined ? props.ariaLabel : props.name
            }
            id={props.name}
            name={props.name}
          >
            <Link to={props.linkTo}>{textInputValue}</Link>
          </TextContent>
        </>
      ) : (
        <TextInput
          id={props.name}
          name={props.name}
          value={textInputValue}
          onChange={(_event, value) => {
            setTextInputValue(value);
            onChange(value);
          }}
          type="text"
          aria-label={
            props.ariaLabel !== undefined ? props.ariaLabel : props.name
          }
          isRequired={required}
          readOnlyVariant={readOnly ? "plain" : undefined}
        />
      )}
    </>
  );
};

export default IpaTextInput;
