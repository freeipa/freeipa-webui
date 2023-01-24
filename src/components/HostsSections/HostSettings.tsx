import React, { useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
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

interface SshPublicKey {
  key: string;
}

interface MacAddress {
  id: number | string;
  address: string;
}

interface PropsToHostSettings {
  host: Host;
}

const HostSettings = (props: PropsToHostSettings) => {
  const REALM = "@SERVER.IPA.DEMO";
  // Host name - textbox (mandatory field)
  const [hostName] = useState(props.host.hostName);

  // Principal alias - textbox
  const [principalAliasList, setPrincipalAliasList] = useState<
    PrincipalAlias[]
  >([
    {
      id: 0,
      alias: "host/" + props.host.hostName + REALM, // TODO: The realm (@SERVER.IPA.DEMO) should adapt to context
    },
  ]);

  // Description - textbox
  const [hostDescription, setHostDescription] = useState(
    props.host.description
  );
  const onChangeDescriptionHandler = (newDescription: string) => {
    setHostDescription(newDescription);
  };

  // Class - textbox
  const [hostClass, setHostClass] = useState(props.host.class);
  const updateHostClass = (newHostClass: string) => {
    setHostClass(newHostClass);
  };

  // Locality - textbox
  const [locality, setLocality] = useState("");
  const updateLocality = (newLocality: string) => {
    setLocality(newLocality);
  };
  const [location, setLocation] = useState("");
  const updateLocation = (newLocation: string) => {
    setLocation(newLocation);
  };
  const [platform, setPlatform] = useState("");
  const updatePlatform = (newPlatform: string) => {
    setPlatform(newPlatform);
  };
  const [operatingSystem, setOperatingSystem] = useState("");
  const updateOperatingSystem = (newOperatingSystem: string) => {
    setOperatingSystem(newOperatingSystem);
  };

  // SSH public keys
  const [sshPublicKeys] = useState<SshPublicKey[]>([]);

  // MAC address
  const [macAddressList, setMacAddressList] = useState<MacAddress[]>([]);

  // - 'Add MAC address' handler
  const onAddMacAddressFieldHandler = () => {
    const macAddressListCopy = [...macAddressList];
    macAddressListCopy.push({
      id: Date.now.toString(),
      address: "",
    });
    setMacAddressList(macAddressListCopy);
  };

  // - 'Change MAC address' handler
  const onHandleMacAddressChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const macAddressListCopy = [...macAddressList];
    macAddressListCopy[idx]["element"] = (
      event.target as HTMLInputElement
    ).value;
    setMacAddressList(macAddressListCopy);
  };

  // - 'Remove MAC address' handler
  const onRemoveMacAddressHandler = (idx: number) => {
    const macAddressListCopy = [...macAddressList];
    macAddressListCopy.splice(idx, 1);
    setMacAddressList(macAddressListCopy);
  };

  // Authentication indicators - checkboxes
  const [radiusCheckbox] = useState(false);
  const [tpaCheckbox] = useState(false);
  const [pkinitCheckbox] = useState(false);
  const [hardenedPassCheckbox] = useState(false);

  const AuthIndicatorsTypesMessage = () => (
    <div>
      <p>
        Defines an allow list for Authentication indicators. Use <b>otp</b> to
        allow OTP-based 2FA authentications. Use <b>radius</b> to allow
        RADIUS-based 2FA authentications. Use <b>pkinit</b> to allow
        PKINIT-based 2FA authentications. Use <b>hardened</b> to allow
        brute-force hardened password authentication by SPAKE or FAST. With{" "}
        <b>no indicator</b> specified, all authentication mechanisms are
        allowed.
      </p>
    </div>
  );

  // Trusted for delegation - checkbox
  const [trustedForDelegationCheckbox] = useState(false);

  // Trusted to authenticate as a user - checkbox
  const [trustedAuthAsUserCheckbox] = useState(false);

  // Assigned ID view - data type unknown, treated as string from now
  const [assignedIDView] = useState("");

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

  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-u-mb-lg">
            <FormGroup label="Host name" fieldId="host-name">
              <TextInput
                id="host-name"
                name="hostname"
                value={hostName}
                type="text"
                aria-label="host name"
                isDisabled
              />
            </FormGroup>
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
            <FormGroup label="Description" fieldId="host-description">
              <TextArea
                value={hostDescription}
                name="description"
                onChange={onChangeDescriptionHandler}
                aria-label="host description"
                resizeOrientation="vertical"
              />
            </FormGroup>
            <FormGroup label="Class" fieldId="host-class">
              <TextInput
                id="host-class"
                name="userclass"
                onChange={updateHostClass}
                value={hostClass}
                type="text"
                aria-label="host class"
              />
            </FormGroup>
            <FormGroup label="Locality" fieldId="locality">
              <TextInput
                id="locality"
                name="l"
                onChange={updateLocality}
                value={locality}
                type="text"
                aria-label="locality"
              />
            </FormGroup>
            <FormGroup label="Location" fieldId="location">
              <TextInput
                id="location"
                name="nshostlocation"
                onChange={updateLocation}
                value={location}
                type="text"
                aria-label="location"
              />
            </FormGroup>
            <FormGroup label="Platform" fieldId="platform">
              <TextInput
                id="platform"
                name="nshardwareplatform"
                onChange={updatePlatform}
                value={platform}
                type="text"
                aria-label="platform"
              />
            </FormGroup>
            <FormGroup label="Operating system" fieldId="operating-system">
              <TextInput
                id="operating-system"
                name="nsosversion"
                onChange={updateOperatingSystem}
                value={operatingSystem}
                type="text"
                aria-label="operating-system"
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form>
            <FormGroup label="SSH public keys" fieldId="ssh-public-keys">
              {sshPublicKeys.length === 0 ? (
                <SecondaryButton>Add</SecondaryButton>
              ) : (
                <>
                  {sshPublicKeys.map((publicKey) => {
                    return (
                      <>
                        {publicKey.key}
                        <SecondaryButton>Show/Set key</SecondaryButton>
                        <SecondaryButton>Delete</SecondaryButton>
                      </>
                    );
                  })}
                  <SecondaryButton>Add</SecondaryButton>
                </>
              )}
            </FormGroup>
            <FormGroup label="MAC address" fieldId="mac-address">
              <Flex direction={{ default: "column" }} name="macaddress">
                {macAddressList.map((macAddress, idx) => (
                  <Flex
                    direction={{ default: "row" }}
                    key={macAddress.id + "-" + idx + "-div"}
                    name={"macaddress-" + idx}
                  >
                    <FlexItem
                      key={macAddress.id + "-textbox"}
                      flex={{ default: "flex_1" }}
                    >
                      <TextInput
                        id="mac-address-text"
                        value={macAddress.address}
                        type="text"
                        name={"macaddress-" + idx}
                        aria-label="mac address"
                        onChange={(value, event) =>
                          onHandleMacAddressChange(value, event, idx)
                        }
                      />
                    </FlexItem>
                    <FlexItem key={macAddress.id + "-delete-button"}>
                      <SecondaryButton
                        name="remove"
                        onClickHandler={() => onRemoveMacAddressHandler(idx)}
                      >
                        Delete
                      </SecondaryButton>
                    </FlexItem>
                  </Flex>
                ))}
              </Flex>
              <SecondaryButton
                classname={macAddressList.length !== 0 ? "pf-u-mt-md" : ""}
                name="add"
                onClickHandler={onAddMacAddressFieldHandler}
              >
                Add
              </SecondaryButton>
            </FormGroup>
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
                name="ipauserauthtype"
                value="otp"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="RADIUS"
                isChecked={radiusCheckbox}
                aria-label="radius from authentication indicators checkbox"
                id="radiusCheckbox"
                name="ipauserauthtype"
                value="radius"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="PKINIT"
                isChecked={pkinitCheckbox}
                aria-label="pkinit from authentication indicators checkbox"
                id="pkinitCheckbox"
                name="ipauserauthtype"
                value="pkinit"
                className="pf-u-mt-xs pf-u-mb-sm"
              />
              <Checkbox
                label="Hardened password (by SPAKE or FAST)"
                isChecked={hardenedPassCheckbox}
                aria-label="hardened password from authentication indicators checkbox"
                id="hardenedPassCheckbox"
                name="ipauserauthtype"
                value="hardened"
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
            <FormGroup label="Assigned ID view" fieldId="assigned-id-view">
              <TextInput
                id="assigned-id-view"
                name="ipaassignedidview"
                value={assignedIDView}
                type="text"
                aria-label="assigned id view"
                isDisabled
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

export default HostSettings;
