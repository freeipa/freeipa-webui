import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Utils
import { asRecord } from "src/utils/userUtils";
// Fields
import IpaTextInput from "../Form/IpaTextInput";

interface PropsToUsersIdentity {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
}

const UsersIdentity = (props: PropsToUsersIdentity) => {
  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  const firstNameTextInput = (
    <IpaTextInput
      dataCy="user-tab-settings-textbox-givenname"
      name={"givenname"}
      ariaLabel={"Given name"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - Last name
  const lastNameTextInput = (
    <IpaTextInput
      dataCy="user-tab-settings-textbox-lastname"
      name={"sn"}
      ariaLabel={"Last name"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - Full name
  const fullNameTextInput = (
    <IpaTextInput
      dataCy="user-tab-settings-textbox-fullname"
      name={"cn"}
      ariaLabel={"Full name"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - Job title
  const jobTitleTextInput = (
    <IpaTextInput
      dataCy="user-tab-settings-textbox-jobtitle"
      name={"title"}
      ariaLabel={"Job title"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - GECOS
  const gecosTextInput = (
    <IpaTextInput
      dataCy="user-tab-settings-textbox-gecos"
      name={"gecos"}
      ariaLabel={"GECOS"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - User class
  const userClassTextInput = (
    <IpaTextInput
      dataCy="user-tab-settings-textbox-userclass"
      name={"userclass"}
      ariaLabel={"User Class"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="First name" fieldId="givenname" isRequired>
            {firstNameTextInput}
          </FormGroup>
          <FormGroup label="Last name" fieldId="sn" isRequired>
            {lastNameTextInput}
          </FormGroup>
          <FormGroup label="Full name" fieldId="cn" isRequired>
            {fullNameTextInput}
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Job title" fieldId="title">
            {jobTitleTextInput}
          </FormGroup>
          <FormGroup label="GECOS" fieldId="gecos">
            {gecosTextInput}
          </FormGroup>
          <FormGroup label="Class" fieldId="userclass">
            {userClassTextInput}
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersIdentity;
