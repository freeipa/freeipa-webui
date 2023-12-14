import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaTextInput from "../Form/IpaTextInput";
// Utils
import { asRecord } from "src/utils/userUtils";

interface PropsToUsersMailingAddress {
  user: Partial<User>;
  onUserChange: (user: Partial<User>) => void;
  metadata: Metadata;
}

const UsersMailingAddress = (props: PropsToUsersMailingAddress) => {
  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Street address" fieldId="street">
            <IpaTextInput
              name={"street"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="City" fieldId="l">
            <IpaTextInput
              name={"l"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="State/province" fieldId="st">
            <IpaTextInput
              name={"st"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="ZIP" fieldId="postalcode">
            <IpaTextInput
              name={"postalcode"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersMailingAddress;
