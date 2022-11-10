import React, { useState } from "react";
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

const UsersAttributesSMB = () => {
  // TODO: This state variables should update the user data via the IPA API
  const [SMBLogonScriptPath, setSMBLogonScriptPath] = useState("");
  const [SMBProfilePath, setSMBProfilePath] = useState("");
  const [SMBHomeDirectory, setSMBHomeDirectory] = useState("");

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
    { value: "A:", disabled: false },
    { value: "B:", disabled: false },
    { value: "C:", disabled: false },
    { value: "D:", disabled: false },
    { value: "E:", disabled: false },
    { value: "F:", disabled: false },
    { value: "G:", disabled: false },
    { value: "H:", disabled: false },
    { value: "I:", disabled: false },
    { value: "J:", disabled: false },
    { value: "K:", disabled: false },
    { value: "L:", disabled: false },
    { value: "M:", disabled: false },
    { value: "N:", disabled: false },
    { value: "O:", disabled: false },
    { value: "P:", disabled: false },
    { value: "Q:", disabled: false },
    { value: "R:", disabled: false },
    { value: "S:", disabled: false },
    { value: "T:", disabled: false },
    { value: "U:", disabled: false },
    { value: "V:", disabled: false },
    { value: "W:", disabled: false },
    { value: "X:", disabled: false },
    { value: "Y:", disabled: false },
    { value: "Z:", disabled: false },
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
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
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
                <SelectOption
                  isDisabled={option.disabled}
                  key={index}
                  value={option.value}
                />
              ))}
            </Select>
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersAttributesSMB;
