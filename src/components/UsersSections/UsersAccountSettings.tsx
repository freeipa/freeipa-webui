/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  DropdownItem,
  CalendarMonth,
  Button,
} from "@patternfly/react-core";
// Data types
import {
  IDPServer,
  Metadata,
  RadiusServer,
  User,
} from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";
import ModalWithTextAreaLayout from "src/components/layouts/ModalWithTextAreaLayout";
// Modals
import CertificateMappingDataModal from "src/components/modals/CertificateMappingDataModal";
import IpaTextInputFromList from "../Form/IpaTextInputFromList";
import AddTextInputFromListModal from "../modals/AddTextInputFromListModal";
// Utils
import { asRecord } from "src/utils/userUtils";
// RTK
import {
  ErrorResult,
  useAddPrincipalAliasMutation,
  useRemovePrincipalAliasMutation,
} from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import DeletionConfirmationModal from "../modals/DeletionConfirmationModal";
// Form
import IpaCheckbox from "../Form/IpaCheckbox";
import IpaSelect from "../Form/IpaSelect";
import IpaTextInput from "../Form/IpaTextInput";
import IpaCalendar from "../Form/IpaCalendar";
// ipaObject utils
import { updateIpaObject } from "src/utils/ipaObjectUtils";

interface PropsToUsersAccountSettings {
  user: Partial<User>;
  onUserChange: (element: Partial<User>) => void;
  metadata: Metadata;
  onRefresh: () => void;
  radiusProxyConf: RadiusServer[];
  idpConf: IDPServer[];
}

// Generic data to pass to the Textbox adder
interface ElementData {
  id: string | number;
  element: string;
}

const UsersAccountSettings = (props: PropsToUsersAccountSettings) => {
  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.user,
    props.onUserChange
  );

  // Alerts to show in the UI
  const alerts = useAlerts();

  // RTK hooks
  const [addPrincipalAlias] = useAddPrincipalAliasMutation();
  const [removePrincipalAlias] = useRemovePrincipalAliasMutation();

  // TextInput Modal data
  const [isTextInputModalOpen, setIsTextInputModalOpen] = useState(false);
  const [newAliasValue, setNewAliasValue] = React.useState("");

  const onOpenTextInputModal = () => {
    setIsTextInputModalOpen(true);
  };

  const onCloseTextInputModal = () => {
    setIsTextInputModalOpen(false);
  };

  // Deletion confirmation Modal data
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] =
    React.useState(false);
  const [aliasIdxToDelete, setAliasIdxToDelete] = React.useState<number>(999);
  const [messageDeletionConf, setMessageDeletionConf] = React.useState("");

  const onRemoveAlias = (idx: number) => {
    // Get the specific index of the element to remove
    setAliasIdxToDelete(idx);
    // Set message to show on the deletion confirmation modal
    const aliasToDelete = ipaObject["krbprincipalname"][idx];
    setMessageDeletionConf(
      "Do you want to remove kerberos alias " + aliasToDelete + "?"
    );
    // Open deletion confirmation modal
    onOpenDeletionConfModal();
  };

  const onOpenDeletionConfModal = () => {
    setIsDeleteConfModalOpen(true);
  };

  const onCloseDeletionConfModal = () => {
    setIsDeleteConfModalOpen(false);
  };

  const deletionConfModalActions = [
    <Button
      key="add-principal-alias"
      variant="danger"
      onClick={() => onRemovePrincipalAlias(aliasIdxToDelete)}
    >
      Delete
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseDeletionConfModal}>
      Cancel
    </Button>,
  ];

  // Add 'principal alias'
  const onAddPrincipalAlias = () => {
    const payload = [props.user.uid, [newAliasValue]];

    addPrincipalAlias(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsTextInputModalOpen(false);
          // Set alert: success
          alerts.addAlert(
            "add-alias-success",
            "Added new aliases to user '" + props.user.uid + "'",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("add-alias-error", errorMessage.message, "danger");
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  // Remove handler
  const onRemovePrincipalAlias = (idx: number) => {
    const aliasList = [...ipaObject.krbprincipalname];
    const elementToRemove = aliasList[idx];

    // Set payload
    const payload = [ipaObject.uid, [elementToRemove]];

    removePrincipalAlias(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsDeleteConfModalOpen(false);
          // Show toast notification: success
          alerts.addAlert(
            "remove-alias-success",
            "Removed aliases from user '" + props.user.uid + "'",
            "success"
          );
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("remove-alias-error", errorMessage.message, "danger");
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  const textInputModalActions = [
    <SecondaryButton
      key="add-principal-alias"
      onClickHandler={onAddPrincipalAlias}
    >
      Add
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onCloseTextInputModal}>
      Cancel
    </Button>,
  ];

  // Dropdown 'Radius proxy configuration'
  const [isRadiusConfOpen, setIsRadiusConfOpen] = useState(false);
  const [radiusConfSelected, setRadiusConfSelected] = useState(
    ipaObject.ipatokenradiusconfiglink
  );
  const [radiusConfOptions, setRadiusConfOptions] = useState<string[]>([]);
  const radiusConfOnToggle = (isOpen: boolean) => {
    setIsRadiusConfOpen(isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radiusConfOnSelect = (selection: any) => {
    setRadiusConfSelected(selection.target.textContent as string);
    updateIpaObject(
      ipaObject,
      recordOnChange,
      selection.target.textContent as string,
      "ipatokenradiusconfiglink"
    );
    setIsRadiusConfOpen(false);
  };

  useEffect(() => {
    const radiusProxyList: string[] = [];
    props.radiusProxyConf.map((item) => {
      const itemString = item.cn.toString();
      radiusProxyList.push(itemString);
    });
    setRadiusConfOptions(radiusProxyList);
  }, [props.radiusProxyConf]);

  // Dropdown 'External IdP configuration'
  const [isIdpConfOpen, setIsIdpConfOpen] = useState(false);
  const [idpConfSelected, setIdpConfSelected] = useState("");
  const [idpConfOptions, setIdpConfOptions] = useState<string[]>([]);

  const idpConfOnToggle = (isOpen: boolean) => {
    setIsIdpConfOpen(isOpen);
  };

  const idpConfOnSelect = (selection: any) => {
    setIdpConfSelected(selection.target.textContent as string);
    updateIpaObject(
      ipaObject,
      recordOnChange,
      selection.target.textContent as string,
      "ipaidpconfiglink"
    );
    setIsIdpConfOpen(false);
  };

  useEffect(() => {
    const idpList: string[] = [];
    props.idpConf.map((item) => {
      const itemString = item.cn.toString();
      idpList.push(itemString);
    });
    setIdpConfOptions(idpList);
  }, [props.idpConf]);

  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [userLogin] = useState(props.user.uid);
  const [password] = useState("");
  const [passwordExpiration] = useState("");
  const [uid, setUid] = useState(props.user.uidnumber);
  const [gid, setGid] = useState("");
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
      <alerts.ManagedAlerts />
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
            <FormGroup
              label="Kerberos principal alias"
              fieldId="kerberos-principal-alias"
            >
              <IpaTextInputFromList
                name="krbprincipalname"
                elementsList={ipaObject.krbprincipalname}
                ipaObject={ipaObject}
                metadata={props.metadata}
                onOpenModal={onOpenTextInputModal}
                onRemove={onRemoveAlias}
              />
              <AddTextInputFromListModal
                newValue={newAliasValue}
                setNewValue={setNewAliasValue}
                title={"Add kerberos principal alias"}
                isOpen={isTextInputModalOpen}
                onClose={onCloseTextInputModal}
                actions={textInputModalActions}
                textInputTitle={"New kerberos principal alias"}
                textInputName="krbprincalname"
              />
              <DeletionConfirmationModal
                title={"Remove kerberos alias"}
                isOpen={isDeleteConfModalOpen}
                onClose={onCloseDeletionConfModal}
                actions={deletionConfModalActions}
                messageText={messageDeletionConf}
              />
            </FormGroup>
            <FormGroup
              label="Kerberos principal expiration (UTC)"
              fieldId="kerberos-principal-expiration"
            >
              <IpaCalendar
                name={"krbprincipalexpiration"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
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
              <IpaCheckbox
                id="password"
                label="Password"
                name="ipauserauthtype"
                value="password"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <IpaCheckbox
                id="radius"
                label="RADIUS"
                name="ipauserauthtype"
                value="radius"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <IpaCheckbox
                id="otp"
                label="Two-factor authentication (password + OTP)"
                name="ipauserauthtype"
                value="otp"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <IpaCheckbox
                id="pkinit"
                label="PKINIT"
                name="ipauserauthtype"
                value="pkinit"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <IpaCheckbox
                id="hardened"
                label="Hardened password (by SPAKE or FAST)"
                name="ipauserauthtype"
                value="hardened"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <IpaCheckbox
                id="idp"
                label="External Identity Provider"
                name="ipauserauthtype"
                value="idp"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="user"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Radius proxy configuration"
              fieldId="radius-proxy-configuration"
            >
              <IpaSelect
                id="radius-proxy-configuration"
                name="ipatokenradiusconfiglink"
                onToggle={radiusConfOnToggle}
                onSelect={radiusConfOnSelect}
                elementsOptions={radiusConfOptions}
                isOpen={isRadiusConfOpen}
                ipaObject={ipaObject}
                objectName="user"
                metadata={props.metadata}
                value={radiusConfSelected}
              />
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
              <IpaSelect
                id="external-idp-configuration"
                name="ipaidpconfiglink"
                onToggle={idpConfOnToggle}
                onSelect={idpConfOnSelect}
                elementsOptions={idpConfOptions}
                isOpen={isIdpConfOpen}
                ipaObject={ipaObject}
                objectName="user"
                metadata={props.metadata}
                value={idpConfSelected}
              />
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
