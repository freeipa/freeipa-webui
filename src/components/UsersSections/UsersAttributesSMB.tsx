/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  SelectVariant,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Select,
  SelectOption,
  TextInput,
} from "@patternfly/react-core";
// Layout
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Utils
import { isFieldReadable, isFieldWritable } from "src/utils/utils";
import FieldWrapper from "src/utils/FieldWrapper";

interface PropsToUsersAttributesSMB {
  userData: any;
  attrLevelRights: any;
}

const UsersAttributesSMB = (props: PropsToUsersAttributesSMB) => {
  // TODO: This state variables should update the user data via the IPA API
  const [SMBLogonScriptPath, setSMBLogonScriptPath] = useState("");
  const [SMBProfilePath, setSMBProfilePath] = useState("");
  const [SMBHomeDirectory, setSMBHomeDirectory] = useState("");

  // Updates data on 'userData' changes
  useEffect(() => {
    if (props.userData !== undefined) {
      const userData = props.userData as User;
      if (userData.ipantlogonscript !== undefined) {
        setSMBLogonScriptPath(userData.ipantlogonscript);
      }
      if (userData.ipantprofilepath !== undefined) {
        setSMBProfilePath(userData.ipantprofilepath);
      }
      if (userData.ipanthomedirectory !== undefined) {
        setSMBHomeDirectory(userData.ipanthomedirectory);
      }
      if (userData.ipanthomedirectorydrive !== undefined) {
        setSMBHomeDirectoryDriveSelected(userData.ipanthomedirectorydrive);
      }
    }
  }, [props.userData]);

  const onChangeSMBLogonScriptPath = (value: string) => {
    setSMBLogonScriptPath(value);
  };

  const SBMLogonScriptPathMessage = () => (
    <div>Path to a script executed on a Windows system at logon</div>
  );

  const onChangeSMBProfilePath = (value: string) => {
    setSMBProfilePath(value);
  };

  const SMBProfilePathMessage = () => (
    <div>Path to an user profile, in UNC format \\server\share</div>
  );

  const onChangeSMBHomeDirectory = (value: string) => {
    setSMBHomeDirectory(value);
  };

  const SMBHomeDirectoryMessage = () => (
    <div>Path to an user home directory, in UNC format</div>
  );

  // Dropdown 'SMB profile path'
  const [isSMBHomeDirectoryDriveOpen, setIsSMBHomeDirectoryDriveOpen] =
    useState(false);
  const [SMBHomeDirectoryDriveSelected, setSMBHomeDirectoryDriveSelected] =
    useState("");
  const SMBHomeDirectoryDriveOptions = [
    "",
    "A:",
    "B:",
    "C:",
    "D:",
    "E:",
    "F:",
    "G:",
    "H:",
    "I:",
    "J:",
    "K:",
    "L:",
    "M:",
    "N:",
    "O:",
    "P:",
    "Q:",
    "R:",
    "S:",
    "T:",
    "U:",
    "V:",
    "W:",
    "X:",
    "Y:",
    "Z:",
  ];
  const SMBHomeDirectoryDriveOnToggle = (isOpen: boolean) => {
    setIsSMBHomeDirectoryDriveOpen(isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SMBHomeDirectoryDriveOnSelect = (selection: any) => {
    setSMBHomeDirectoryDriveSelected(selection.target.textContent);
    setIsSMBHomeDirectoryDriveOpen(false);
  };

  const SMBHomeDirectoryDriveMessage = "Drive to mount a home directory";

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.ipantlogonscript)}
            isReadable={isFieldReadable(props.attrLevelRights.ipantlogonscript)}
          >
            <FormGroup
              label="SMB logon script path"
              fieldId="smb-logon-script-path"
              labelIcon={
                <PopoverWithIconLayout message={SBMLogonScriptPathMessage} />
              }
            >
              <TextInput
                id="smb-logon-script-path"
                name="ipantlogonscript"
                value={SMBLogonScriptPath}
                type="text"
                aria-label="smb logon script path"
                onChange={onChangeSMBLogonScriptPath}
              />
            </FormGroup>
          </FieldWrapper>

          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.ipantprofilepath)}
            isReadable={isFieldReadable(props.attrLevelRights.ipantprofilepath)}
          >
            <FormGroup
              label="SMB profile path"
              fieldId="smb-profile-path"
              labelIcon={
                <PopoverWithIconLayout message={SMBProfilePathMessage} />
              }
            >
              <TextInput
                id="smb-profile-path"
                name="ipantprofilepath"
                value={SMBProfilePath}
                type="text"
                aria-label="smb profile path"
                onChange={onChangeSMBProfilePath}
              />
            </FormGroup>
          </FieldWrapper>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.ipanthomedirectory
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.ipanthomedirectory
            )}
          >
            <FormGroup
              label="SMB home directory"
              fieldId="smb-home-directory"
              labelIcon={
                <PopoverWithIconLayout
                  message={SMBHomeDirectoryMessage}
                  hasAutoWidth={true}
                />
              }
            >
              <TextInput
                id="smb-home-directory"
                name="ipanthomedirectory"
                value={SMBHomeDirectory}
                type="text"
                aria-label="smb home directory"
                onChange={onChangeSMBHomeDirectory}
              />
            </FormGroup>
          </FieldWrapper>

          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.ipanthomedirectorydrive
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.ipanthomedirectorydrive
            )}
          >
            <FormGroup
              label="SMB home directory drive"
              fieldId="smb-home-directory-drive"
              labelIcon={
                <PopoverWithIconLayout
                  message={SMBHomeDirectoryDriveMessage}
                  hasAutoWidth={true}
                />
              }
            >
              <Select
                id="smb-home-directory-drive"
                name="ipanthomedirectorydrive"
                variant={SelectVariant.single}
                direction={"up"}
                placeholderText=" "
                aria-label="Select samba home directory drive"
                onToggle={SMBHomeDirectoryDriveOnToggle}
                onSelect={SMBHomeDirectoryDriveOnSelect}
                selections={SMBHomeDirectoryDriveSelected}
                isOpen={isSMBHomeDirectoryDriveOpen}
                aria-labelledby="smb-directory-drive"
                maxHeight="280px"
              >
                {SMBHomeDirectoryDriveOptions.map((option, index) => (
                  <SelectOption key={index} value={option} />
                ))}
              </Select>
            </FormGroup>
          </FieldWrapper>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersAttributesSMB;
