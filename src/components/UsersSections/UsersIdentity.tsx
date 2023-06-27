import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
import IpaTextInput from "../Form/IpaTextInput";

interface PropsToUsersIdentity {
  user: User;
  onUserChange: (user: User) => void;
  metadata: Metadata;
}

function usersTextInput(
  property: string,
  onChange: (user: User) => void,
  user: User,
  metadata: Metadata
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = user as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onChange(ipaObject as User);
  }
  return (
    <IpaTextInput
      name={property}
      ipaObject={ipaObject}
      onChange={recordOnChange}
      objectName="user"
      metadata={metadata}
    />
  );
}

const UsersIdentity = (props: PropsToUsersIdentity) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="First name" fieldId="first-name" isRequired>
            {usersTextInput(
              "givenname",
              props.onUserChange,
              props.user,
              props.metadata
            )}
          </FormGroup>
          <FormGroup label="Last name" fieldId="last-name" isRequired>
            {usersTextInput(
              "sn",
              props.onUserChange,
              props.user,
              props.metadata
            )}
          </FormGroup>
          <FormGroup label="Full name" fieldId="full-name" isRequired>
            {usersTextInput(
              "cn",
              props.onUserChange,
              props.user,
              props.metadata
            )}
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Job title" fieldId="job-title">
            {usersTextInput(
              "title",
              props.onUserChange,
              props.user,
              props.metadata
            )}
          </FormGroup>
          <FormGroup label="GECOS" fieldId="gecos">
            {usersTextInput(
              "gecos",
              props.onUserChange,
              props.user,
              props.metadata
            )}
          </FormGroup>
          <FormGroup label="Class" fieldId="class-field">
            {usersTextInput(
              "userclass",
              props.onUserChange,
              props.user,
              props.metadata
            )}
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersIdentity;
