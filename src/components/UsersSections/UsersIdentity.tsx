import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

interface PropsToUsersIdentity {
  user: User;
}

const UsersIdentity = (props: PropsToUsersIdentity) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [firstName] = useState(props.user.givenname);
  const [lastName, setLastName] = useState(props.user.sn);
  const [fullName, setFullName] = useState(firstName + " " + lastName);
  const [jobTitle] = useState(props.user.title);
  const [gecos, setGecos] = useState(fullName);
  const [classField, setClassField] = useState("");

  const lastNameInputHandler = (value: string) => {
    setLastName(value);
  };

  const fullNameInputHandler = (value: string) => {
    setFullName(value);
  };

  const gecosInputHandler = (value: string) => {
    setGecos(value);
  };

  const classFieldInputHandler = (value: string) => {
    setClassField(value);
  };

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="First name" fieldId="first-name" isRequired>
            <TextInput
              id="first-name"
              name="givenname"
              value={firstName}
              type="text"
              aria-label="first name"
              isRequired
            />
          </FormGroup>
          <FormGroup label="Last name" fieldId="last-name" isRequired>
            <TextInput
              id="last-name"
              name="sn"
              value={lastName}
              type="text"
              onChange={lastNameInputHandler}
              aria-label="last name"
              isRequired
            />
          </FormGroup>
          <FormGroup label="Full name" fieldId="full-name" isRequired>
            <TextInput
              id="full-name"
              name="cn"
              value={fullName}
              type="text"
              onChange={fullNameInputHandler}
              aria-label="full name"
              isRequired
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Job title" fieldId="job-title">
            <TextInput
              id="job-title"
              name="title"
              value={jobTitle}
              type="text"
              aria-label="job title"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="GECOS" fieldId="gecos">
            <TextInput
              id="gecos"
              name="gecos"
              value={gecos}
              type="text"
              onChange={gecosInputHandler}
              aria-label="gecos"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="Class" fieldId="class-field">
            <TextInput
              id="class-field"
              name="userclass"
              value={classField}
              type="text"
              onChange={classFieldInputHandler}
              aria-label="class field"
              isRequired
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersIdentity;
