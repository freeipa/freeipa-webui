import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaTextInput from "../Form/IpaTextInput";
import IpaSelect from "../Form/IpaSelect";
import IpaTextboxList from "../Form/IpaTextboxList";
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
        <Form className="pf-v6-u-mb-lg">
          <FormGroup label="Org. unit" fieldId="ou">
            <IpaTextInput
              dataCy="user-tab-settings-textbox-ou"
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
              dataCy="user-tab-settings-select-manager"
              id="manager"
              name="manager"
              options={managerOptions}
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Department number"
            fieldId="departmentnumber"
            role="group"
          >
            <IpaTextboxList
              dataCy="user-tab-settings-textbox-departmentnumber"
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              name={"departmentnumber"}
              ariaLabel={"department number"}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v6-u-mb-lg">
          <FormGroup label="Employee number" fieldId="employee-number">
            <IpaTextInput
              dataCy="user-tab-settings-textbox-employeenumber"
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
              dataCy="user-tab-settings-textbox-employee-type"
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
              dataCy="user-tab-settings-textbox-preferred-language"
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
