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
        <Form className="pf-v6-u-mb-lg">
          <FormGroup label="Mail address" fieldId="mail" role="group">
            <IpaTextboxList
              dataCy="user-tab-settings-mail"
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"mail"}
              ariaLabel={"email address list"}
            />
          </FormGroup>
          <FormGroup
            label="Telephone number"
            fieldId="telephonenumber"
            role="group"
          >
            <IpaTextboxList
              dataCy="user-tab-settings-telephonenumber"
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"telephonenumber"}
              ariaLabel={"telephone number list"}
            />
          </FormGroup>
          <FormGroup label="Pager number" fieldId="pager" role="group">
            <IpaTextboxList
              dataCy="user-tab-settings-pager"
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"pager"}
              ariaLabel={"pager list"}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v6-u-mb-lg">
          <FormGroup label="Mobile phone number" fieldId="mobile" role="group">
            <IpaTextboxList
              dataCy="user-tab-settings-mobile"
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
