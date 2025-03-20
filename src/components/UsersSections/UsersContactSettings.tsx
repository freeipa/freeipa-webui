import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Utils
import { asRecord } from "src/utils/userUtils";
// Form
import IpaTextboxList from "../Form/IpaTextboxList";

interface PropsToUsersContactSettings {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
}

const UsersContactSettings = (props: PropsToUsersContactSettings) => {
  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Mail address" fieldId="mail">
            <IpaTextboxList
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"mail"}
              ariaLabel={"email address list"}
            />
          </FormGroup>
          <FormGroup label="Telephone number" fieldId="telephonenumber">
            <IpaTextboxList
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"telephonenumber"}
              ariaLabel={"telephone number list"}
            />
          </FormGroup>
          <FormGroup label="Pager number" fieldId="pager">
            <IpaTextboxList
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"pager"}
              ariaLabel={"pager list"}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Mobile phone number" fieldId="mobile">
            <IpaTextboxList
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"mobile"}
              ariaLabel={"mobile phone number list"}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersContactSettings;
