import React from "react";
// PatternFly
import { Content, ContentVariants } from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  convertToString,
} from "src/utils/ipaObjectUtils";
// React Router DOM
import { Link } from "react-router-dom";

export interface IpaTextContentProps extends IPAParamDefinition {
  dataCy: string;
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
        <Content
          data-cy={props.dataCy}
          readOnly={readOnly}
          required={required}
          aria-label={props.ariaLabel}
          name={props.name}
        >
          <Link to={props.linkTo}>{textValue}</Link>
        </Content>
      ) : (
        <Content
          data-cy={props.dataCy}
          readOnly={readOnly}
          required={required}
          aria-label={props.ariaLabel}
          name={props.name}
        >
          <Content component={ContentVariants.p}>{textValue}</Content>
        </Content>
      )}
    </>
  );
};

export default IpaTextContent;
