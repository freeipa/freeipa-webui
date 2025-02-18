import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaTextInput from "../Form/IpaTextInput/IpaTextInput";
import IpaSelect from "../Form/IpaSelect/IpaSelect";
import IpaTextboxList from "../Form/IpaTextboxList/IpaTextboxList";
// Utils
import { asRecord } from "src/utils/userUtils";

interface PropsToEmployeeInfo {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
  activeUsersList: Partial<User>[];
}

const UsersEmployeeInfo = (props: PropsToEmployeeInfo) => {
  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  // Dropdown 'Manager'
  const managerOptions = props.activeUsersList.map(
    (user) => user.uid?.toString() || ""
  );

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Org. unit" fieldId="ou">
            <IpaTextInput
              name={"ou"}
              ariaLabel={"Org. unit"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="Manager" fieldId="manager">
            <IpaSelect
              id="manager"
              name="manager"
              options={managerOptions}
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="Department number" fieldId="departmentnumber">
            <IpaTextboxList
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"departmentnumber"}
              ariaLabel={"department number"}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Employee number" fieldId="employeenumber">
            <IpaTextInput
              name={"employeenumber"}
              ariaLabel={"Employee number"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="Employee type" fieldId="employeetype">
            <IpaTextInput
              name={"employeetype"}
              ariaLabel={"Employee type"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="Preferred language" fieldId="preferredlanguage">
            <IpaTextInput
              name={"preferredlanguage"}
              ariaLabel={"Preferred language"}
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

export default UsersEmployeeInfo;
