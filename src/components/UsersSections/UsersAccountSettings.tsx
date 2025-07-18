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
  Certificate,
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
  certData?: Certificate[];
  from: "active-users" | "stage-users" | "preserved-users";
}

const UsersAccountSettings = (props: PropsToUsersAccountSettings) => {
  // Use asterisks if a password is set, leave empty otherwise
  const password = props.user.has_password ? "********" : "";

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
    <SecondaryButton
      dataCy="modal-button-add"
      key="add"
      onClickHandler={onClickAddTextAreaCertificates}
    >
      Add
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
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
                dataCy="user-tab-settings-textbox-uid"
                name={"uid"}
                ariaLabel={"User login"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Password" fieldId="password">
              <TextInput
                data-cy="user-tab-settings-textbox-password"
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
              role="group"
            >
              <IpaCalendar
                name={"krbpasswordexpiration"}
                ariaLabel={"Kerberos password expiration date"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
                dataCy="user-tab-settings-calendar-krbpasswordexpiration"
              />
            </FormGroup>
            <FormGroup label="UID" fieldId="uidnumber">
              <IpaTextInput
                dataCy="user-tab-settings-textbox-uidnumber"
                name={"uidnumber"}
                ariaLabel={"UID number"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="GID" fieldId="gidnumber">
              <IpaTextInput
                dataCy="user-tab-settings-textbox-gidnumber"
                name={"gidnumber"}
                ariaLabel={"GID number"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal alias"
              fieldId="krbprincipalname"
              role="group"
            >
              <PrincipalAliasMultiTextBox
                dataCy="user-tab-settings-kerberos-principal-alias"
                ipaObject={ipaObject}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from={props.from}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal expiration (UTC)"
              fieldId="krbprincipalexpiration"
              role="group"
            >
              <IpaCalendar
                dataCy="user-tab-settings-calendar-krbprincipalexpiration"
                name={"krbprincipalexpiration"}
                ariaLabel={"Kerberos principal expiration date"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Login shell" fieldId="loginshell">
              <IpaTextInput
                dataCy="user-tab-settings-textbox-loginshell"
                name={"loginshell"}
                ariaLabel={"Login shell"}
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
                dataCy="user-tab-settings-textbox-homedirectory"
                name={"homedirectory"}
                ariaLabel={"Home directory"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="SSH public keys"
              fieldId="ipasshpubkey"
              role="group"
            >
              <IpaSshPublicKeys
                dataCy="user-tab-settings-ssh-public-keys"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from={props.from}
              />
            </FormGroup>
            <FormGroup
              label="Certificates"
              fieldId="usercertificate"
              role="group"
            >
              <IpaCertificates
                dataCy="user-tab-settings-certificates"
                ipaObject={ipaObject}
                objectType="user"
                onChange={recordOnChange}
                metadata={props.metadata}
                certificates={props.certData}
                onRefresh={props.onRefresh}
              />
            </FormGroup>
            <FormGroup
              label="Certificate mapping data"
              fieldId="ipacertmapdata"
              role="group"
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
              role="group"
              labelIcon={
                <PopoverWithIconLayout message={userAuthTypesMessage} />
              }
            >
              <IpaCheckboxes
                dataCy="user-tab-settings-checkbox-ipauserauthtype"
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
                dataCy="user-tab-settings-ipatokenradiusconfiglink"
                id="ipatokenradiusconfiglink"
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
                dataCy="user-tab-settings-textbox-ipatokenradiususername"
                name={"ipatokenradiususername"}
                ariaLabel={"Radius proxy username"}
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
                dataCy="user-tab-settings-ipaidpconfiglink"
                id="ipaidpconfiglink"
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
                dataCy="user-tab-settings-textbox-ipaidpsub"
                name={"ipaidpsub"}
                ariaLabel={"External IdP user identifier"}
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
        dataCy="usercertificate-modal"
        id="certificate-textarea"
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
