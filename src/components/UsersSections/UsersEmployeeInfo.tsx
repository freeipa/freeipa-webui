/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  SelectOption,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Select,
  TextInput,
  SelectVariant,
} from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

interface PropsToEmployeeData {
  uidsData: any;
  userData: any;
}

const UsersEmployeeInfo = (props: PropsToEmployeeData) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [orgUnit, setOrgUnit] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");

  const onChangeOrgUnit = (value: string) => {
    setOrgUnit(value);
  };
  const onChangeEmployeeNumber = (value: string) => {
    setEmployeeNumber(value);
  };
  const onChangeEmployeeType = (value: string) => {
    setEmployeeType(value);
  };
  const onChangePreferredLanguage = (value: string) => {
    setPreferredLanguage(value);
  };

  // Updates data on 'userData' changes
  useEffect(() => {
    if (props.userData !== undefined) {
      const userData = props.userData as User;
      if (userData.ou !== undefined) {
        setOrgUnit(userData.ou);
      }
      if (userData.employeenumber !== undefined) {
        setEmployeeNumber(userData.employeenumber);
      }
      if (userData.employeetype !== undefined) {
        setEmployeeType(userData.employeetype);
      }
      if (userData.preferredlanguage !== undefined) {
        setPreferredLanguage(userData.preferredlanguage);
      }
      if (userData.departmentnumber !== undefined) {
        setDepartmentNumberList(userData.departmentnumber);
      }
      if (userData.manager !== undefined) {
        setManagerSelected(userData.manager);
      }
    }
  }, [props.userData]);

  // Dropdown 'Manager'
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerSelected, setManagerSelected] = useState("");
  const [managerOptions, setManagerOptions] = useState<string[]>([]);
  const managerOnToggle = (isOpen: boolean) => {
    setIsManagerOpen(isOpen);
  };

  // Updates data on 'uidsData' changes
  useEffect(() => {
    if (props.uidsData !== undefined) {
      const uidsList = props.uidsData.map((uid) => uid.uid[0]);
      setManagerOptions(uidsList);
    }
  }, [props.uidsData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const managerOnSelect = (selection: any) => {
    setManagerSelected(selection.target.textContent);
    setIsManagerOpen(false);
  };

  // Department number
  const [departmentNumberList, setDepartmentNumberList] = useState<string[]>(
    []
  );

  // - 'Add department number' handler
  const onAddDepartmentNumberHandler = () => {
    const departmentNumberListCopy = [...departmentNumberList];
    departmentNumberListCopy.push("");
    setDepartmentNumberList(departmentNumberListCopy);
  };

  // - 'Change department number' handle
  const onHandleDepartmentNumberChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const departmentNumberListCopy = [...departmentNumberList];
    departmentNumberListCopy[idx]["departmentNumber"] = (
      event.target as HTMLInputElement
    ).value;
    setDepartmentNumberList(departmentNumberListCopy);
  };

  // - 'Remove department number' handler
  const onRemoveDepartmentNumberHandler = (idx: number) => {
    const departmentNumberListCopy = [...departmentNumberList];
    departmentNumberListCopy.splice(idx, 1);
    setDepartmentNumberList(departmentNumberListCopy);
  };

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Org. unit" fieldId="org-unit">
            <TextInput
              id="org-unit"
              name="ou"
              value={orgUnit}
              type="text"
              aria-label="organization unit"
              onChange={onChangeOrgUnit}
            />
          </FormGroup>
          <FormGroup label="Manager" fieldId="manager">
            <Select
              id="manager"
              name="manager"
              variant={SelectVariant.single}
              placeholderText=" "
              aria-label="Select manager"
              onToggle={managerOnToggle}
              onSelect={managerOnSelect}
              selections={managerSelected}
              isOpen={isManagerOpen}
              aria-labelledby="manager"
              style={{ height: "186px", overflowY: "scroll" }}
            >
              {managerOptions.map((option, index) => (
                <SelectOption key={index} value={option} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup label="Department number" fieldId="department-number">
            <Flex direction={{ default: "column" }} name="departmentnumber">
              {departmentNumberList.map((departmentNumber, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={departmentNumber + "-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={departmentNumber + "-" + idx + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id={"department-number" + idx}
                      value={departmentNumber}
                      type="text"
                      name={"departmentnumber-" + idx}
                      aria-label="department number"
                      onChange={(value, event) =>
                        onHandleDepartmentNumberChange(value, event, idx)
                      }
                    />
                  </FlexItem>
                  <FlexItem
                    key={departmentNumber + "-" + idx + "-delete-button"}
                  >
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() =>
                        onRemoveDepartmentNumberHandler(idx)
                      }
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              name="add"
              onClickHandler={onAddDepartmentNumberHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Employee number" fieldId="employee-number">
            <TextInput
              id="employee-number"
              name="employeenumber"
              value={employeeNumber}
              type="text"
              aria-label="employee number"
              onChange={onChangeEmployeeNumber}
            />
          </FormGroup>
          <FormGroup label="Employee type" fieldId="employee-type">
            <TextInput
              id="employee-type"
              name="employeetype"
              value={employeeType}
              type="text"
              aria-label="employee type"
              onChange={onChangeEmployeeType}
            />
          </FormGroup>
          <FormGroup label="Preferred language" fieldId="preferred-language">
            <TextInput
              id="preferred-language"
              name="preferredlanguage"
              value={preferredLanguage}
              type="text"
              aria-label="preferred language"
              onChange={onChangePreferredLanguage}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersEmployeeInfo;
