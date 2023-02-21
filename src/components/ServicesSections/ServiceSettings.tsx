import React, { useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Radio,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Modals
import PrincipalAliasAddModal from "../modals/PrincipalAliasAddModal";
import PrincipalAliasDeleteModal from "../modals/PrincipalAliasDeleteModal";

interface PrincipalAlias {
  id: number | string;
  alias: string;
}

interface PropsToServiceSettings {
  service: Service;
}

const ServiceSettings = (props: PropsToServiceSettings) => {
  // Get realm
  // TODO: Adapt to context
  const REALM = "@SERVER.IPA.DEMO";

  // Principal alias - textbox
  const [principalAliasList, setPrincipalAliasList] = useState<
    PrincipalAlias[]
  >([
    {
      id: 0,
      alias: props.service.id,
    },
  ]);

  // Principal alias - Add Modal
  const [isPrincipalAliasAddModalOpen, setIsPrincipalAliasAddModalOpen] =
    useState(false);

  // - Modal fields data
  // -- New kerberos principal alias - textbox
  const [newKrbAlias, setNewKrbAlias] = useState("");

  const onChangeNewKrbAlias = (newAlias: string) => {
    setNewKrbAlias(newAlias);
  };

  // - Close modal
  const onClosePrincipalAliasAddModal = () => {
    // Reset values
    setNewKrbAlias("");
    setIsPrincipalAliasAddModalOpen(false);
  };

  // - Open modal
  const onOpenPrincipalAliasAddModal = () => {
    setIsPrincipalAliasAddModalOpen(true);
  };

  // - Add new kerberos principal alias
  const addNewKrbPrincipalAlias = (newKrbAlias: string) => {
    // Process new krb alias
    // (whether a single name or a complete name with realm is provided, this needs to be checked)
    if (!newKrbAlias.includes(REALM)) {
      newKrbAlias = newKrbAlias + REALM;
    }
    const principalAliasListCopy = [...principalAliasList];
    principalAliasListCopy.push({
      id: Date.now.toString(),
      alias: newKrbAlias,
    });
    setPrincipalAliasList(principalAliasListCopy);
    // Reset values and close modal
    onClosePrincipalAliasAddModal();
  };

  // - Modal actions
  const principalAliasAddModalActions = [
    <SecondaryButton
      key="add"
      onClickHandler={() => addNewKrbPrincipalAlias(newKrbAlias)}
    >
      Add
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onClosePrincipalAliasAddModal}>
      Cancel
    </Button>,
  ];

  // - Data to modal
  const dataToModal = {
    newKrbAlias,
    onChangeNewKrbAlias,
    onClosePrincipalAliasAddModal,
    onOpenPrincipalAliasAddModal,
    addNewKrbPrincipalAlias,
  };

  // Principal alias - Delete Modal
  const [isPrincipalAliasDeleteModalOpen, setIsPrincipalAliasDeleteModalOpen] =
    useState(false);

  // - Alias to delete
  const [aliasToDelete, setAliasToDelete] = useState("");

  // - Close modal
  const onClosePrincipalAliasDeleteModal = () => {
    setIsPrincipalAliasDeleteModalOpen(false);
  };

  // - Open modal
  const onOpenPrincipalAliasDeleteModal = () => {
    setIsPrincipalAliasDeleteModalOpen(true);
  };

  const openModalAndSetAlias = (krbAliasToDelete: string) => {
    setAliasToDelete(krbAliasToDelete);
    onOpenPrincipalAliasDeleteModal();
  };

  // - Delete new kerberos principal alias
  const deleteNewKrbPrincipalAlias = () => {
    const principalAliasUpdatedList: PrincipalAlias[] = [];
    principalAliasList.map((krbAlias) => {
      if (krbAlias.alias !== aliasToDelete) {
        principalAliasUpdatedList.push(krbAlias);
      }
    });
    setPrincipalAliasList(principalAliasUpdatedList);
    // Reset delete variable
    setAliasToDelete("");
    // Close modal
    onClosePrincipalAliasDeleteModal();
  };

  // - Modal actions
  const principalAliasDeleteModalActions = [
    <SecondaryButton key="delete" onClickHandler={deleteNewKrbPrincipalAlias}>
      Delete
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onClosePrincipalAliasDeleteModal}
    >
      Cancel
    </Button>,
  ];

  // PAC type - radio button & checkboxes
  // - Radio buttons
  const [isInheritedChecked, setIsInheritedChecked] = useState(true);
  const [isOverrideChecked, setIsOverrideChecked] = useState(false);

  const onChangeInheritedRadio = (isChecked: boolean) => {
    setIsInheritedChecked(isChecked);
    setIsOverrideChecked(!isChecked);
    setIsMsPacChecked(false);
    setIsPadChecked(false);
  };

  const onChangeOverrideRadio = (isChecked: boolean) => {
    setIsOverrideChecked(isChecked);
    setIsInheritedChecked(!isChecked);
  };

  // - Checkboxes
  const [isMsPacChecked, setIsMsPacChecked] = useState(false);
  const [isPadChecked, setIsPadChecked] = useState(false);

  const onChangeMsPac = (isChecked: boolean) => {
    setIsMsPacChecked(isChecked);
  };

  const onChangePad = (isChecked: boolean) => {
    setIsPadChecked(isChecked);
  };

  // Authentication indicators - checkboxes
  const [radiusCheckbox] = useState(false);
  const [tpaCheckbox] = useState(false);
  const [pkinitCheckbox] = useState(false);
  const [hardenedPassCheckbox] = useState(false);
  const [idpCheckbox] = useState(false);

  const AuthIndicatorsTypesMessage = () => (
    <div>
      <p>
        Defines an allow list for Authentication indicators. Use <b>otp</b> to
        allow OTP-based 2FA authentications. Use <b>radius</b> to allow
        RADIUS-based 2FA authentications. Use <b>pkinit</b> to allow
        PKINIT-based 2FA authentications. Use <b>hardened</b> to allow
        brute-force hardened password authentication by SPAKE or FAST. Use{" "}
        <b>idp</b> to allow authentication against an external Identity Provider
        supporting OAuth 2.0 Device Authorization Flow (RFC 8628). With{" "}
        <b>no indicator</b> specified, all authentication mechanisms are
        allowed.
      </p>
    </div>
  );

  // Trusted for delegation - checkbox
  const [trustedForDelegationCheckbox] = useState(false);

  // Trusted to authenticate as a user - checkbox
  const [trustedAuthAsUserCheckbox] = useState(false);

  // Required pre-authentication
  const [requiresPreAuthCheckbox, setRequiresPreAuthCheckbox] = useState(true);

  const onChangeRequiresPreAuth = (isChecked: boolean) => {
    setRequiresPreAuthCheckbox(isChecked);
  };

  // Render component
  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup label="Principal alias" fieldId="principal-alias">
              {principalAliasList.map((alias, idx) => (
                <Flex key={idx} className={idx !== 0 ? "pf-u-mt-sm" : ""}>
                  <FlexItem>{alias.alias}</FlexItem>
                  <FlexItem>
                    <SecondaryButton
                      onClickHandler={() => openModalAndSetAlias(alias.alias)}
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </FormGroup>
            <FormGroup>
              <SecondaryButton onClickHandler={onOpenPrincipalAliasAddModal}>
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup label="Service" fieldId="service">
              <TextInput
                id="service"
                name="service"
                value={props.service.serviceType}
                type="text"
                aria-label="service"
                isDisabled
              />
            </FormGroup>
            <FormGroup label="Host name" fieldId="host-name">
              <TextInput
                id="host-name"
                name="host"
                value={props.service.host}
                type="text"
                aria-label="host name"
                isDisabled
              />
            </FormGroup>
            <FormGroup label="PAC type" fieldId="pac-type">
              <Radio
                isChecked={isInheritedChecked}
                name="inherited"
                onChange={onChangeInheritedRadio}
                label="Inherited from server configuration"
                id="inherited-from-server-conf"
              />
              <Radio
                isChecked={isOverrideChecked}
                name="override"
                onChange={onChangeOverrideRadio}
                label="Override inherited settings"
                id="override-inherited-settings"
              />
              <Checkbox
                label="MS-PAC"
                isChecked={isMsPacChecked}
                onChange={onChangeMsPac}
                isDisabled={!isOverrideChecked}
                id="ms-pac-checkbox"
                name="ms-pac"
                className="pf-u-ml-lg"
              />
              <Checkbox
                label="PAD"
                isChecked={isPadChecked}
                onChange={onChangePad}
                isDisabled={!isOverrideChecked}
                id="pad-checkbox"
                name="pad"
                className="pf-u-ml-lg"
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup
              label="Authentication indicators"
              fieldId="authentication-indicators"
              labelIcon={
                <PopoverWithIconLayout message={AuthIndicatorsTypesMessage} />
              }
            >
              <Checkbox
                label="Two-factor authentication (password + OTP)"
                isChecked={tpaCheckbox}
                aria-label="two factor authentication from authentication indicators checkbox"
                id="tpaCheckbox"
                name="krbprincipalauthind"
                value="otp"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="RADIUS"
                isChecked={radiusCheckbox}
                aria-label="radius from authentication indicators checkbox"
                id="radiusCheckbox"
                name="krbprincipalauthind"
                value="radius"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="PKINIT"
                isChecked={pkinitCheckbox}
                aria-label="pkinit from authentication indicators checkbox"
                id="pkinitCheckbox"
                name="krbprincipalauthind"
                value="pkinit"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="Hardened password (by SPAKE or FAST)"
                isChecked={hardenedPassCheckbox}
                aria-label="hardened password from authentication indicators checkbox"
                id="hardenedPassCheckbox"
                name="krbprincipalauthind"
                value="hardened"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="External Identity Provider"
                isChecked={idpCheckbox}
                aria-label="external identity provider from authentication indicators checkbox"
                id="idpCheckbox"
                name="krbprincipalauthind"
                value="ipd"
              />
            </FormGroup>
            <FormGroup
              label="Trusted for delegation"
              fieldId="trusted-delegation"
            >
              <Checkbox
                label="Trusted for delegation"
                isChecked={trustedForDelegationCheckbox}
                aria-label="trusted for delegation checkbox"
                id="trustedForDelegationCheckbox"
                name="ipakrbokasdelegate"
                value="trustedForDelegation"
              />
            </FormGroup>
            <FormGroup
              label="Trusted to authenticate as a user"
              fieldId="trusted-auth-as-user"
            >
              <Checkbox
                label="Trusted to authenticate as a user"
                isChecked={trustedAuthAsUserCheckbox}
                aria-label="trusted to authenticate as a user checkbox"
                id="trustedAuthAsUserCheckbox"
                name="ipakrboktoauthasdelegate"
                value="trustedAuthAsUser"
              />
            </FormGroup>
            <FormGroup
              label="Requires pre-authentication"
              fieldId="requires-pre-authentication"
            >
              <Checkbox
                label="Requires pre-authentication"
                isChecked={requiresPreAuthCheckbox}
                onChange={onChangeRequiresPreAuth}
                aria-label="requires pre authentication checkbox"
                id="requiresPreAuthenticationCheckbox"
                name="ipakrbrequirespreauth"
                value="requiresPreAuth"
              />
            </FormGroup>
          </Form>
        </FlexItem>
      </Flex>
      <PrincipalAliasAddModal
        isOpen={isPrincipalAliasAddModalOpen}
        onClose={onClosePrincipalAliasAddModal}
        actions={principalAliasAddModalActions}
        data={dataToModal}
      />
      <PrincipalAliasDeleteModal
        isOpen={isPrincipalAliasDeleteModalOpen}
        onClose={onClosePrincipalAliasDeleteModal}
        actions={principalAliasDeleteModalActions}
        hostToRemove={aliasToDelete}
      />
    </>
  );
};

export default ServiceSettings;
