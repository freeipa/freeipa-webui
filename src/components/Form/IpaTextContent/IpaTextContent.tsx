import React from "react";
// PatternFly
import { TextContent, Text, TextVariants } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";
// React Router DOM
import { Link } from "react-router-dom";

export interface IpaTextContentProps extends IPAParamDefinition {
  linkTo?: string;
}

const IpaTextContent = (props: IpaTextContentProps) => {
  const { required, readOnly, value } = getParamProperties(props);

  const [textValue, setTextValue] = React.useState<string>(
    convertToString(value)
  );

  React.useEffect(() => {
    setTextValue(convertToString(value));
  }, [value]);

  return (
    <>
      {props.linkTo ? (
        <TextContent
          readOnly={readOnly}
          required={required}
          aria-label={props.ariaLabel}
          name={props.name}
        >
          <Link to={props.linkTo}>{textValue}</Link>
        </TextContent>
      ) : (
        <TextContent
          readOnly={readOnly}
          required={required}
          aria-label={props.ariaLabel}
          name={props.name}
        >
          <Text component={TextVariants.p}>{textValue}</Text>
        </TextContent>
      )}
    </>
  );
};

export default IpaTextContent;
