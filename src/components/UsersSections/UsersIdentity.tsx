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
      name={"givenname"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - Last name
  const lastNameTextInput = (
    <IpaTextInput
      name={"sn"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - Full name
  const fullNameTextInput = (
    <IpaTextInput
      name={"cn"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - Job title
  const jobTitleTextInput = (
    <IpaTextInput
      name={"title"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - GECOS
  const gecosTextInput = (
    <IpaTextInput
      name={"gecos"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  // - User class
  const userClassTextInput = (
    <IpaTextInput
      name={"userclass"}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={props.metadata}
    />
  );

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="First name" fieldId="first-name" isRequired>
            {firstNameTextInput}
          </FormGroup>
          <FormGroup label="Last name" fieldId="last-name" isRequired>
            {lastNameTextInput}
          </FormGroup>
          <FormGroup label="Full name" fieldId="full-name" isRequired>
            {fullNameTextInput}
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Job title" fieldId="job-title">
            {jobTitleTextInput}
          </FormGroup>
          <FormGroup label="GECOS" fieldId="gecos">
            {gecosTextInput}
          </FormGroup>
          <FormGroup label="Class" fieldId="class-field">
            {userClassTextInput}
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersIdentity;
