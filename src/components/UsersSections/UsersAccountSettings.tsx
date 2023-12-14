/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  Button,
} from "@patternfly/react-core";
// Data types
import {
  IDPServer,
  Metadata,
  User,
  RadiusServer,
} from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";
import ModalWithTextAreaLayout from "src/components/layouts/ModalWithTextAreaLayout";
// Utils
import { asRecord } from "src/utils/userUtils";
// Form
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaSelect from "../Form/IpaSelect";
import IpaCheckboxes from "../Form/IpaCheckboxes";
import PrincipalAliasMultiTextBox from "../Form/PrincipalAliasMultiTextBox";
import IpaCalendar from "../Form/IpaCalendar";
import IpaSshPublicKeys from "../Form/IpaSshPublicKeys";
import IpaCertificates from "../Form/IpaCertificates";
import IpaCertificateMappingData from "../Form/IpaCertificateMappingData";

interface PropsToUsersAccountSettings {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
  onRefresh: () => void;
  radiusProxyConf: RadiusServer[];
  idpConf: IDPServer[];
  certData: Record<string, unknown>;
  from: "active-users" | "stage-users" | "preserved-users";
}

const UsersAccountSettings = (props: PropsToUsersAccountSettings) => {
  // TODO: Handle the `has_password` variable (boolean) by another Ipa component
  const [password] = useState("");

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  // Dropdown 'Radius proxy configuration'
  const radiusProxyList = props.radiusProxyConf.map((item) =>
    item.cn.toString()
  );

  // Dropdown 'External IdP configuration'
  const idpConfOptions = props.idpConf.map((item) => item.cn.toString());

  // Certificates
  // -Text area
  const [textAreaCertificatesValue, setTextAreaCertificatesValue] =
    useState("");
  const [isTextAreaCertificatesOpen, setIsTextAreaCertificatesOpen] =
    useState(false);

  const onChangeTextAreaCertificatesValue = (value: string) => {
    setTextAreaCertificatesValue(value);
  };

  const onClickAddTextAreaCertificates = () => {
    // Store data here
    // Closes the modal
    setIsTextAreaCertificatesOpen(false);
  };

  const onClickCancelTextAreaCertificates = () => {
    // Closes the modal
    setIsTextAreaCertificatesOpen(false);
  };

  const certificatesOptions = [
    <SecondaryButton key="add" onClickHandler={onClickAddTextAreaCertificates}>
      Add
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onClickCancelTextAreaCertificates}
    >
      Cancel
    </Button>,
  ];

  const userAuthTypesMessage = () => (
    <div>
      <p>
        Per-user setting, overwrites the global setting if any option is
        checked.
      </p>
      <p>
        <b>Password + Two-factor:</b> LDAP and Kerberos allow authentication
        with either one of the authentication types but Kerberos uses
        pre-authentication method which requires to use armor cache.
      </p>
      <p>
        <b>RADIUS with another type:</b> Kerberos always use RADIUS, but LDAP
        never does. LDAP only recognize the password and two-factor
        authentication options.
      </p>
    </div>
  );

  // Messages for the popover
  const certificateMappingDataMessage = () => (
    <div>
      <p>Add one or more certificate mappings to the user entry</p>
    </div>
  );

  // Render 'UsersAccountSettings'
  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-v5-u-mb-lg">
            <FormGroup label="User login" fieldId="uid">
              <IpaTextInput
                name={"uid"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Password" fieldId="password">
              <TextInput
                id="password"
                name="has_password"
                value={password}
                type="password"
                aria-label="password"
                readOnlyVariant="plain"
              />
            </FormGroup>
            <FormGroup
              label="Password expiration"
              fieldId="krbpasswordexpiration"
            >
              <IpaCalendar
                name={"krbpasswordexpiration"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="UID" fieldId="uidnumber">
              <IpaTextInput
                name={"uidnumber"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="GID" fieldId="gidnumber">
              <IpaTextInput
                name={"gidnumber"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal alias"
              fieldId="krbprincipalname"
            >
              <PrincipalAliasMultiTextBox
                ipaObject={ipaObject}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from={props.from}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal expiration (UTC)"
              fieldId="krbprincipalexpiration"
            >
              <IpaCalendar
                name={"krbprincipalexpiration"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Login shell" fieldId="loginshell">
              <IpaTextInput
                name={"loginshell"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }} className="pf-v5-u-w-50">
          <Form className="pf-v5-u-mb-lg">
            <FormGroup label="Home directory" fieldId="homedirectory">
              <IpaTextInput
                name={"homedirectory"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="SSH public keys" fieldId="ipasshpubkey">
              <IpaSshPublicKeys
                ipaObject={ipaObject}
                onChange={recordOnChange}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from={props.from}
              />
            </FormGroup>
            <FormGroup label="Certificates" fieldId="usercertificate">
              <IpaCertificates
                ipaObject={ipaObject}
                onChange={recordOnChange}
                metadata={props.metadata}
                certificates={props.certData}
                onRefresh={props.onRefresh}
              />
            </FormGroup>
            <FormGroup
              label="Certificate mapping data"
              fieldId="ipacertmapdata"
              labelIcon={
                <PopoverWithIconLayout
                  message={certificateMappingDataMessage}
                />
              }
              // Keep long words to have the same width as the other elements
              style={{
                overflowWrap: "break-word",
                maxWidth: "100%",
                wordBreak: "break-all",
              }}
            >
              <IpaCertificateMappingData
                ipaObject={ipaObject}
                onChange={recordOnChange}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
              />
            </FormGroup>
            <FormGroup
              label="User authentication types"
              fieldId="ipauserauthtype"
              labelIcon={
                <PopoverWithIconLayout message={userAuthTypesMessage} />
              }
            >
              <IpaCheckboxes
                name="ipauserauthtype"
                options={[
                  {
                    value: "password",
                    text: "Password",
                  },
                  {
                    value: "radius",
                    text: "RADIUS",
                  },
                  {
                    value: "otp",
                    text: "Two-factor authentication (password + OTP)",
                  },
                  {
                    value: "pkinit",
                    text: "PKINIT",
                  },
                  {
                    value: "hardened",
                    text: "Hardened password (by SPAKE or FAST)",
                  },
                  {
                    value: "idp",
                    text: "External Identity Provider",
                  },
                ]}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Radius proxy configuration"
              fieldId="ipatokenradiusconfiglink"
            >
              <IpaSelect
                id="radius-proxy-configuration"
                name="ipatokenradiusconfiglink"
                options={radiusProxyList}
                ipaObject={ipaObject}
                setIpaObject={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Radius proxy username"
              fieldId="ipatokenradiususername"
            >
              <IpaTextInput
                name={"ipatokenradiususername"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="External IdP configuration"
              fieldId="ipaidpconfiglink"
            >
              <IpaSelect
                id="external-idp-configuration"
                name="ipaidpconfiglink"
                options={idpConfOptions}
                ipaObject={ipaObject}
                setIpaObject={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="External IdP user identifier" fieldId="ipaidpsub">
              <IpaTextInput
                name={"ipaidpsub"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
      </Flex>
      <ModalWithTextAreaLayout
        value={textAreaCertificatesValue}
        onChange={onChangeTextAreaCertificatesValue}
        isOpen={isTextAreaCertificatesOpen}
        onClose={onClickCancelTextAreaCertificates}
        actions={certificatesOptions}
        title="New certificate"
        subtitle="Certificate in base64 or PEM format:"
        ariaLabel="new certificate modal text area"
        cssStyle={{ height: "422px" }}
        name="usercertificate"
        objectName="user"
        ipaObject={ipaObject}
        metadata={props.metadata}
      />
    </>
  );
};

export default UsersAccountSettings;
