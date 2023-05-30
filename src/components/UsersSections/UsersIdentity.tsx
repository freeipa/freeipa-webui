/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
  userData: any;
}

const UsersIdentity = (props: PropsToUsersIdentity) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [gecos, setGecos] = useState("");
  const [classField, setClassField] = useState<string[]>([]);

  // Updates data on 'userData' changes
  useEffect(() => {
    if (props.userData !== undefined) {
      const userData = props.userData as User;
      setFirstName(userData.givenname);
      setLastName(userData.sn);
      setFullName(userData.displayname);
      setJobTitle(userData.title);
      setGecos(userData.gecos);
      if (userData.userclass !== undefined) {
        setClassField(userData.userclass);
      }
    }
  }, [props.userData]);

  // Field input handlers
  const firstNameInputHandler = (value: string) => {
    setFirstName(value);
  };

  const lastNameInputHandler = (value: string) => {
    setLastName(value);
  };

  const fullNameInputHandler = (value: string) => {
    setFullName(value);
  };

  const jobTitleInputHandler = (value: string) => {
    setJobTitle(value);
  };

  const gecosInputHandler = (value: string) => {
    setGecos(value);
  };

  const classFieldInputHandler = (value: string) => {
    setClassField([value]);
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
              onChange={firstNameInputHandler}
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
              onChange={jobTitleInputHandler}
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
              value={classField && classField[0]} // TODO: Better represent the classes array
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
