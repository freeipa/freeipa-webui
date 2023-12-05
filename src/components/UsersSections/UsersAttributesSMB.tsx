import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Layout
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Data types
import { Metadata, User } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaTextInput from "../Form/IpaTextInput";
import IpaSelect from "../Form/IpaSelect";
// Utils
import { asRecord } from "src/utils/userUtils";

interface PropsToSmbServices {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
}

const UsersAttributesSMB = (props: PropsToSmbServices) => {
  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  // Tooltip messages
  const SBMLogonScriptPathMessage = () => (
    <div>Path to a script executed on a Windows system at logon</div>
  );

  const SMBProfilePathMessage = () => (
    <div>Path to an user profile, in UNC format \\server\share</div>
  );

  const SMBHomeDirectoryMessage = () => (
    <div>Path to an user home directory, in UNC format</div>
  );

  const SMBHomeDirectoryDriveMessage = "Drive to mount a home directory";

  // Dropdown 'SMB profile path' options
  const SMBHomeDirectoryDriveOptions = [
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

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup
            label="SMB logon script path"
            fieldId="ipantlogonscript"
            labelIcon={
              <PopoverWithIconLayout message={SBMLogonScriptPathMessage} />
            }
          >
            <IpaTextInput
              name={"ipantlogonscript"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="SMB profile path"
            fieldId="ipantprofilepath"
            labelIcon={
              <PopoverWithIconLayout message={SMBProfilePathMessage} />
            }
          >
            <IpaTextInput
              name={"ipantprofilepath"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup
            label="SMB home directory"
            fieldId="ipanthomedirectory"
            labelIcon={
              <PopoverWithIconLayout
                message={SMBHomeDirectoryMessage}
                hasAutoWidth={true}
              />
            }
          >
            <IpaTextInput
              name={"ipanthomedirectory"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="SMB home directory drive"
            fieldId="ipanthomedirectorydrive"
            labelIcon={
              <PopoverWithIconLayout
                message={SMBHomeDirectoryDriveMessage}
                hasAutoWidth={true}
              />
            }
          >
            <IpaSelect
              id="smb-home-directory-drive"
              name="ipanthomedirectorydrive"
              options={SMBHomeDirectoryDriveOptions}
              ipaObject={ipaObject}
              setIpaObject={recordOnChange}
              objectName="user"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersAttributesSMB;
