/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Select,
  SelectVariant,
  SelectOption,
  DropdownItem,
  CalendarMonth,
  Button,
} from "@patternfly/react-core";
// Data types
import { IDPServer, User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import DataTimePickerLayout from "src/components/layouts/Calendar/DataTimePickerLayout";
import CalendarButton from "src/components/layouts/Calendar/CalendarButton";
import CalendarLayout from "src/components/layouts/Calendar/CalendarLayout";
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";
import ModalWithTextAreaLayout from "src/components/layouts/ModalWithTextAreaLayout";
// Modals
import CertificateMappingDataModal from "src/components/modals/CertificateMappingDataModal";

interface PropsToUsersAccountSettings {
  user: Partial<User>;
}

// Generic data to pass to the Textbox adder
interface ElementData {
  id: string | number;
  element: string;
}

const UsersAccountSettings = (props: PropsToUsersAccountSettings) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [userLogin] = useState(props.user.uid);
  const [password] = useState("");
  const [passwordExpiration] = useState("");
  const [uid, setUid] = useState(props.user.uidnumber);
  const [gid, setGid] = useState("");
  const [principalAliasList, setPrincipalAliasList] = useState<ElementData[]>([
    {
      id: 0,
      element: props.user.uid + "@IPAEXAMPLE.TEST",
    },
  ]);
  const [homeDirectory, setHomeDirectory] = useState("/home/" + userLogin);
  const [loginShell, setLoginShell] = useState("/bin/sh");
  const [radiusUsername, setRadiusUsername] = useState("");
  const [idpIdentifier, setIdpIdentifier] = useState("");

  // UID
  const uidInputHandler = (value: string) => {
    setUid(value);
  };

  // GID
  const gidInputHandler = (value: string) => {
    setGid(value);
  };

  // Principal alias
  // - 'Add principal alias' handler
  const onAddPrincipalAliasFieldHandler = () => {
    const principalAliasListCopy = [...principalAliasList];
    principalAliasListCopy.push({
      id: Date.now.toString(),
      element: "",
    });
    setPrincipalAliasList(principalAliasListCopy);
  };

  // - 'Change principal alias' handler
  const onHandlePrincipalAliasChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const principalAliasListCopy = [...principalAliasList];
    principalAliasListCopy[idx]["element"] = (
      event.target as HTMLInputElement
    ).value;
    setPrincipalAliasList(principalAliasListCopy);
  };

  // - 'Remove principal alias' handler
  const onRemovePrincipalAliasHandler = (idx: number) => {
    const principalAliasListCopy = [...principalAliasList];
    principalAliasListCopy.splice(idx, 1);
    setPrincipalAliasList(principalAliasListCopy);
  };

  // Home directory
  const homeDirectoryInputHandler = (value: string) => {
    setHomeDirectory(value);
  };

  // Login shell
  const loginShellInputHandler = (value: string) => {
    setLoginShell(value);
  };

  // SSH public keys
  // -Text area
  const [textAreaSshPublicKeysValue, setTextAreaSshPublicKeysValue] =
    useState("");
  const [isTextAreaSshPublicKeysOpen, setIsTextAreaSshPublicKeysOpen] =
    useState(false);

  const onChangeTextAreaSshPublicKeysValue = (value: string) => {
    setTextAreaSshPublicKeysValue(value);
  };

  const onClickSetTextAreaSshPublicKeys = () => {
    // Store data here
    // Closes the modal
    setIsTextAreaSshPublicKeysOpen(false);
  };

  const onClickCancelTextAreaSshPublicKeys = () => {
    // Closes the modal
    setIsTextAreaSshPublicKeysOpen(false);
  };

  const openSshPublicKeysModal = () => {
    setIsTextAreaSshPublicKeysOpen(true);
  };

  const sshPublicKeysOptions = [
    <SecondaryButton key="set" onClickHandler={onClickSetTextAreaSshPublicKeys}>
      Set
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onClickCancelTextAreaSshPublicKeys}
    >
      Cancel
    </Button>,
  ];

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

  const openCertificatesModal = () => {
    setIsTextAreaCertificatesOpen(true);
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

  // Certificate mapping data
  // - Radio buttons
  const [certMappingDataCheck, setCertMappingDataCheck] = useState(true);
  const [issuerAndSubjectCheck, setIssuerAndSubjectCheck] = useState(false);

  const onChangeMappingDataCheck = (value: boolean) => {
    setCertMappingDataCheck(value);
    setIssuerAndSubjectCheck(!value);
  };

  const onChangeIssuerAndSubjectCheck = (value: boolean) => {
    setIssuerAndSubjectCheck(value);
    setCertMappingDataCheck(!value);
  };

  // -- Issuer and subject textboxes
  const [issuer, setIssuer] = useState("");
  const [subject, setSubject] = useState("");
  // -- Temporal values for issuer and subject. This helps to restore the original
  //    values when the modal is close without saving (instead of showing empty
  //    textboxes/textareas)
  const [issuerTemp, setIssuerTemp] = useState(issuer);
  const [subjectTemp, setSubjectTemp] = useState(subject);

  const onChangeIssuer = (value: string) => {
    setIssuerTemp(value);
  };
  const onChangeSubject = (value: string) => {
    setSubjectTemp(value);
  };

  // -- Certificate mapping data: Lists and generated textboxe and textarea
  const [certificateMappingDataList, setCertificateMappingDataList] = useState<
    ElementData[]
  >([]);
  const [certificateList, setCertificateList] = useState<ElementData[]>([]);
  // -- Copy of the data to be used as a temporal values. This helps to restore the
  //   original values when the modal is close without saving (instead of showing empty
  //   textboxes/textareas)
  const [certificateMappingDataListTemp, setCertificateMappingDataListTemp] =
    useState<ElementData[]>([]);
  const [certificateListTemp, setCertificateListTemp] =
    useState<ElementData[]>(certificateList);
  // -- Deep-copy of the data that will be used for a short-term copy on simple operations.
  const certificateMappingDataListCopy = structuredClone(
    certificateMappingDataListTemp
  );
  const certificateListCopy = structuredClone(certificateListTemp);

  // --- 'Add certificate mapping data' handler
  const onAddCertificateMappingDataHandler = () => {
    certificateMappingDataListCopy.push({
      id: Date.now.toString(),
      element: "",
    });
    setCertificateMappingDataListTemp(certificateMappingDataListCopy);
  };

  // --- 'Change certificate mapping data' handler
  const onHandleCertificateMappingDataChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    certificateMappingDataListCopy[idx]["element"] = (
      event.target as HTMLInputElement
    ).value;
    setCertificateMappingDataListTemp(certificateMappingDataListCopy);
  };

  // --- 'Remove certificate mapping data' handler
  const onRemoveCertificateMappingDataHandler = (idx: number) => {
    certificateMappingDataListCopy.splice(idx, 1);
    setCertificateMappingDataListTemp(certificateMappingDataListCopy);
  };

  // --- 'Add certificate' handler
  const onAddCertificateHandler = () => {
    certificateListCopy.push({
      id: Date.now.toString(),
      element: "",
    });
    setCertificateListTemp(certificateListCopy);
  };

  // --- 'Change certificate' handler
  const onHandleCertificateChange = (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => {
    certificateListCopy[idx]["element"] = (
      event.target as HTMLTextAreaElement
    ).value;
    setCertificateListTemp(certificateListCopy);
  };

  // --- 'Remove certificate' handler
  const onRemoveCertificateHandler = (idx: number) => {
    certificateListCopy.splice(idx, 1);
    setCertificateListTemp(certificateListCopy);
  };

  // - Modal
  const [
    isCertificatesMappingDataModalOpen,
    setIsCertificatesMappingDataModalOpen,
  ] = useState(false);

  // -- Close modal
  const onCloseCertificatesMappingData = () => {
    // Reset values on lists | original -> temp
    setCertificateMappingDataListTemp(certificateMappingDataList);
    setCertificateListTemp(certificateList);
    // Reset values on 'issuer and subject' values | original -> temp
    setIssuerTemp(issuer);
    setSubjectTemp(subject);
    // Close the modal
    setIsCertificatesMappingDataModalOpen(false);
  };

  // -- Open modal
  const openCertificatesMappingDataModal = () => {
    setIsCertificatesMappingDataModalOpen(true);
  };

  // -- Add data
  const onAddCertificateMappingData = () => {
    // Add temp values into the original lists | temp -> original
    if (certMappingDataCheck) {
      setCertificateMappingDataList(certificateMappingDataListTemp);
      setCertificateList(certificateListTemp);
    } else {
      // Reset values | original -> temp
      setCertificateMappingDataListTemp(certificateMappingDataList);
      setCertificateListTemp(certificateList);
    }
    // Add temp values to the 'issuer and subject' values | temp -> original
    if (issuerAndSubjectCheck) {
      setIssuer(issuerTemp);
      setSubject(subjectTemp);
    } else {
      // Reset values | original -> temp
      setIssuerTemp(issuer);
      setSubjectTemp(subject);
    }
    // Close the modal
    setIsCertificatesMappingDataModalOpen(false);
  };

  const certificatesMappingDataActions = [
    <SecondaryButton key="add" onClickHandler={onAddCertificateMappingData}>
      Add
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onCloseCertificatesMappingData}
    >
      Cancel
    </Button>,
  ];

  // RADIUS username
  const radiusUsernameInputHandler = (value: string) => {
    setRadiusUsername(value);
  };

  // Track changes on External IdP user identifier textbox field
  const idpIdentifierInputHandler = (value: string) => {
    setIdpIdentifier(value);
  };

  // Checkboxes
  const [passwordCheckbox] = useState(false);
  const [radiusCheckbox] = useState(false);
  const [tpaCheckbox] = useState(false);
  const [pkinitCheckbox] = useState(false);
  const [hardenedPassCheckbox] = useState(false);
  const [extIdentityProvCheckbox] = useState(false);

  // Date and time picker (Calendar)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isTimeOpen, setIsTimeOpen] = React.useState(false);
  const [valueDate, setValueDate] = React.useState("YYYY-MM-DD");
  const [valueTime, setValueTime] = React.useState("HH:MM");
  const times = Array.from(new Array(10), (_, i) => i + 10);
  const defaultTime = "0:00";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateFormat = (date: any) =>
    date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

  const onToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
    setIsTimeOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const onToggleTime = (_ev: any) => {
    setIsTimeOpen(!isTimeOpen);
    setIsCalendarOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectCalendar = (newValueDate: any) => {
    const newValue = dateFormat(newValueDate);
    setValueDate(newValue);
    setIsCalendarOpen(!isCalendarOpen);
    // setting default time when it is not picked
    if (valueTime === "HH:MM") {
      setValueTime(defaultTime);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectTime = (ev: any) => {
    setValueTime(ev.target.value);
    setIsTimeOpen(!isTimeOpen);
  };

  const timeOptions = times.map((time) => (
    <DropdownItem key={time} component="button" value={`${time}:00`}>
      {`${time}:00`}
    </DropdownItem>
  ));

  const calendar = (
    <CalendarMonth date={new Date(valueDate)} onChange={onSelectCalendar} />
  );

  const time = (
    <DataTimePickerLayout
      dropdownOnSelect={onSelectTime}
      toggleAriaLabel="Toggle the time picker menu"
      toggleIndicator={null}
      toggleOnToggle={onToggleTime}
      toggleStyle={{ padding: "6px 16px" }}
      dropdownIsOpen={isTimeOpen}
      dropdownItems={timeOptions}
    />
  );

  const calendarButton = (
    <CalendarButton
      ariaLabel="Toggle the calendar"
      onClick={onToggleCalendar}
    />
  );

  // Dropdown 'Radius proxy configuration'
  const [isRadiusConfOpen, setIsRadiusConfOpen] = useState(false);
  const [radiusConfSelected, setRadiusConfSelected] = useState("");
  const radiusConfOptions = [
    { value: "Option 1", disabled: false },
    { value: "Option 2", disabled: false },
    { value: "Option 3", disabled: false },
  ];
  const radiusConfOnToggle = (isOpen: boolean) => {
    setIsRadiusConfOpen(isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radiusConfOnSelect = (selection: any) => {
    setRadiusConfSelected(selection.target.textContent);
    setIsRadiusConfOpen(false);
  };

  // Dropdown 'External IdP configuration'
  const [isIdpConfOpen, setIsIdpConfOpen] = useState(false);
  const [idpConfSelected, setIdpConfSelected] = useState("");
  const [idpConfOptions] = useState<IDPServer[]>([]);

  const idpConfOnToggle = (isOpen: boolean) => {
    setIsIdpConfOpen(isOpen);
  };

  const idpConfOnSelect = (selection: any) => {
    setIdpConfSelected(selection.target.textContent);
    setIsIdpConfOpen(false);
  };

  // Messages for the popover
  const certificateMappingDataMessage = () => (
    <div>
      <p>Add one or more certificate mappings to the user entry</p>
    </div>
  );
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

  // Render 'UsersAccountSettings'
  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup label="User login" fieldId="user-login">
              <TextInput
                id="user-login"
                name="uid"
                value={userLogin}
                type="text"
                aria-label="user login"
                isDisabled
              />
            </FormGroup>
            <FormGroup label="Password" fieldId="password">
              <TextInput
                id="password"
                name="has_password"
                value={password}
                type="password"
                aria-label="password"
                isDisabled
              />
            </FormGroup>
            <FormGroup
              label="Password expiration"
              fieldId="password-expiration"
            >
              <TextInput
                id="password-expiration"
                name="krbpasswordexpiration"
                value={passwordExpiration}
                type="text"
                aria-label="password expiration"
                isDisabled
              />
            </FormGroup>
            <FormGroup label="UID" fieldId="uid">
              <TextInput
                id="uid"
                name="uidnumber"
                value={uid}
                type="text"
                onChange={uidInputHandler}
                aria-label="uid"
              />
            </FormGroup>
            <FormGroup label="GID" fieldId="gid">
              <TextInput
                id="gid"
                name="gidnumber"
                value={gid}
                type="text"
                onChange={gidInputHandler}
                aria-label="gid"
              />
            </FormGroup>
            <FormGroup label="Principal alias" fieldId="principal-alias">
              <Flex direction={{ default: "column" }} name="krbprincipalname">
                {principalAliasList.map((principalAlias, idx) => (
                  <Flex
                    direction={{ default: "row" }}
                    key={principalAlias.id + "-" + idx + "-div"}
                    name="value"
                  >
                    <FlexItem
                      key={principalAlias.id + "-textbox"}
                      flex={{ default: "flex_1" }}
                    >
                      <TextInput
                        id="principal-alias"
                        value={principalAlias.element}
                        type="text"
                        name={"krbprincipalname-" + idx}
                        aria-label="principal alias"
                        onChange={(value, event) =>
                          onHandlePrincipalAliasChange(value, event, idx)
                        }
                      />
                    </FlexItem>
                    <FlexItem key={principalAlias.id + "-delete-button"}>
                      <SecondaryButton
                        name="remove"
                        onClickHandler={() =>
                          onRemovePrincipalAliasHandler(idx)
                        }
                      >
                        Delete
                      </SecondaryButton>
                    </FlexItem>
                  </Flex>
                ))}
              </Flex>
              <SecondaryButton
                classname="pf-u-mt-md"
                name="add"
                onClickHandler={onAddPrincipalAliasFieldHandler}
              >
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup
              label="Kerberos principal expiration (UTC)"
              fieldId="kerberos-principal-expiration"
            >
              <CalendarLayout
                name="krbprincipalexpiration"
                position="bottom"
                bodyContent={calendar}
                showClose={false}
                isVisible={isCalendarOpen}
                hasNoPadding={true}
                hasAutoWidth={true}
                textInputId="date-time"
                textInputAriaLabel="date and time picker"
                textInputValue={valueDate + " " + valueTime}
              >
                {calendarButton}
                {time}
              </CalendarLayout>
            </FormGroup>
            <FormGroup label="Login shell" fieldId="login-shell">
              <TextInput
                id="login-shell"
                name="loginshell"
                value={loginShell}
                type="text"
                onChange={loginShellInputHandler}
                aria-label="login shell"
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup label="Home directory" fieldId="home-directory">
              <TextInput
                id="home-directory"
                name="homedirectory"
                value={homeDirectory}
                type="text"
                onChange={homeDirectoryInputHandler}
                aria-label="home directory"
              />
            </FormGroup>
            <FormGroup label="SSH public keys" fieldId="ssh-public-keys">
              <SecondaryButton onClickHandler={openSshPublicKeysModal}>
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup label="Certificates" fieldId="certificates">
              <SecondaryButton onClickHandler={openCertificatesModal}>
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup
              label="Certificate mapping data"
              fieldId="certificate-mapping-data"
              labelIcon={
                <PopoverWithIconLayout
                  message={certificateMappingDataMessage}
                />
              }
            >
              <SecondaryButton
                onClickHandler={openCertificatesMappingDataModal}
              >
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup
              label="User authentication types"
              fieldId="user-authentication-types"
              labelIcon={
                <PopoverWithIconLayout message={userAuthTypesMessage} />
              }
            >
              <Checkbox
                label="Password"
                isChecked={passwordCheckbox}
                aria-label="password from user authentication types"
                id="passwordCheckbox"
                name="ipauserauthtype"
                value="password"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="RADIUS"
                isChecked={radiusCheckbox}
                aria-label="radius from user authentication types"
                id="radiusCheckbox"
                name="ipauserauthtype"
                value="radius"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="Two-factor authentication (password + OTP)"
                isChecked={tpaCheckbox}
                aria-label="two factor authentication from user authentication types"
                id="tpaCheckbox"
                name="ipauserauthtype"
                value="otp"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="PKINIT"
                isChecked={pkinitCheckbox}
                aria-label="pkinit from user authentication types"
                id="pkinitCheckbox"
                name="ipauserauthtype"
                value="pkinit"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="Hardened password (by SPAKE or FAST)"
                isChecked={hardenedPassCheckbox}
                aria-label="hardened password from user authentication types"
                id="hardenedPassCheckbox"
                name="ipauserauthtype"
                value="hardened"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="External Identity Provider"
                isChecked={extIdentityProvCheckbox}
                aria-label="external identity provider from user authentication types"
                id="extIdentityProvCheckbox"
                name="ipauserauthtype"
                value="idp"
              />
            </FormGroup>
            <FormGroup
              label="Radius proxy configuration"
              fieldId="radius-proxy-configuration"
            >
              <Select
                id="radius-proxy-configuration"
                name="ipatokenradiusconfiglink"
                variant={SelectVariant.single}
                placeholderText=" "
                aria-label="Select Input with descriptions"
                onToggle={radiusConfOnToggle}
                onSelect={radiusConfOnSelect}
                selections={radiusConfSelected}
                isOpen={isRadiusConfOpen}
                aria-labelledby="radius-proxy-conf"
              >
                {radiusConfOptions.map((option, index) => (
                  <SelectOption
                    isDisabled={option.disabled}
                    key={index}
                    value={option.value}
                  />
                ))}
              </Select>
            </FormGroup>
            <FormGroup
              label="Radius proxy username"
              fieldId="radius-proxy-username"
            >
              <TextInput
                id="radius-proxy-username"
                name="ipatokenradiususername"
                value={radiusUsername}
                type="text"
                onChange={radiusUsernameInputHandler}
                aria-label="radius proxy username"
              />
            </FormGroup>
            <FormGroup
              label="External IdP configuration"
              fieldId="external-idp-configuration"
            >
              <Select
                id="external-idp-configuration"
                name="ipaidpconfiglink"
                variant={SelectVariant.single}
                placeholderText=" "
                aria-label="Select Input with descriptions"
                onToggle={idpConfOnToggle}
                onSelect={idpConfOnSelect}
                selections={idpConfSelected}
                isOpen={isIdpConfOpen}
                aria-labelledby="external-idp-conf"
              >
                {idpConfOptions.map((option, index) => (
                  <SelectOption key={index} value={option.cn} />
                ))}
              </Select>
            </FormGroup>
            <FormGroup
              label="External IdP user identifier"
              fieldId="external-idp-user-identifier"
            >
              <TextInput
                id="external-idp-user-identifier"
                name="ipaidpsub"
                value={idpIdentifier}
                type="text"
                onChange={idpIdentifierInputHandler}
                aria-label="idp user identifier"
              />
            </FormGroup>
          </Form>
        </FlexItem>
      </Flex>
      <ModalWithTextAreaLayout
        value={textAreaSshPublicKeysValue}
        onChange={onChangeTextAreaSshPublicKeysValue}
        isOpen={isTextAreaSshPublicKeysOpen}
        onClose={onClickCancelTextAreaSshPublicKeys}
        actions={sshPublicKeysOptions}
        title="Set SSH key"
        subtitle="SSH public key:"
        cssName="ipasshpubkey"
        ariaLabel="new ssh public key modal text area"
      />
      <ModalWithTextAreaLayout
        value={textAreaCertificatesValue}
        onChange={onChangeTextAreaCertificatesValue}
        isOpen={isTextAreaCertificatesOpen}
        onClose={onClickCancelTextAreaCertificates}
        actions={certificatesOptions}
        title="New certificate"
        subtitle="Certificate in base64 or PEM format:"
        cssName="usercertificate"
        ariaLabel="new certificate modal text area"
      />
      <CertificateMappingDataModal
        // Modal options
        isOpen={isCertificatesMappingDataModalOpen}
        onClose={onCloseCertificatesMappingData}
        actions={certificatesMappingDataActions}
        // First radio option: Certificate mapping data
        isCertMappingDataChecked={certMappingDataCheck}
        onChangeCertMappingDataCheck={onChangeMappingDataCheck}
        // Second radio option: Issuer and subject
        isIssuerAndSubjectChecked={issuerAndSubjectCheck}
        onChangeIssuerAndSubjectCheck={onChangeIssuerAndSubjectCheck}
        issuerValue={issuerTemp}
        subjectValue={subjectTemp}
        onChangeIssuer={onChangeIssuer}
        onChangeSubject={onChangeSubject}
        // Generated texboxes, textareas, and data
        certificateMappingDataList={certificateMappingDataListTemp}
        certificateList={certificateListTemp}
        onAddCertificateMappingDataHandler={onAddCertificateMappingDataHandler}
        onHandleCertificateMappingDataChange={
          onHandleCertificateMappingDataChange
        }
        onRemoveCertificateMappingDataHandler={
          onRemoveCertificateMappingDataHandler
        }
        onAddCertificateHandler={onAddCertificateHandler}
        onHandleCertificateChange={onHandleCertificateChange}
        onRemoveCertificateHandler={onRemoveCertificateHandler}
      />
    </>
  );
};

export default UsersAccountSettings;
