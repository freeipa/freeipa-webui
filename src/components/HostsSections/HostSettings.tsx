import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { Host, Metadata } from "../../utils/datatypes/globalDataTypes";
// Forms
import IpaTextArea from "../Form/IpaTextArea";
import IpaTextInput from "../Form/IpaTextInput";
import IpaCheckboxes from "../Form/IpaCheckboxes";
// Layouts
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Modals
import PrincipalAliasAddModal from "../modals/PrincipalAliasAddModal";
import PrincipalAliasDeleteModal from "../modals/PrincipalAliasDeleteModal";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";

interface PrincipalAlias {
  id: number | string;
  alias: string;
}

interface PropsToHostSettings {
  host: Partial<Host>;
  metadata: Metadata;
  onHostChange: (host: Partial<Host>) => void;
}

const HostSettings = (props: PropsToHostSettings) => {
  // Host name - textbox (mandatory field)
  let fqdn = "";
  if (props.host.fqdn !== undefined) {
    fqdn = props.host.fqdn;
  }
  const [hostName] = useState(fqdn);

  // Get krb realms
  const krbrealms = props.host.krbprincipalname;
  const aliasList: PrincipalAlias[] = [];
  for (let i = 0; krbrealms && krbrealms[i]; i++) {
    aliasList.push({
      id: i,
      alias: krbrealms[i],
    });
  }

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.host,
    props.onHostChange
  );

  // Principal alias - textbox
  const [principalAliasList, setPrincipalAliasList] =
    useState<PrincipalAlias[]>(aliasList);

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
  }

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.host,
    props.onHostChange
  );

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

  // Assigned ID view - data type unknown, treated as string from now
  const [assignedIDView] = useState("");

  // MAC Address validator
  const validateMAC = (value: string) => {
    const mac_regex = /^([a-fA-F0-9]{2}[:|\\-]?){5}[a-fA-F0-9]{2}$/;
    return value.match(mac_regex) !== null ? true : false;
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
    // (whether a single name or a complete name with realm is provided,
    // this needs to be checked)
    if (aliasList.length > 0) {
      // TODO this is not correct!, need to look thorguh the entire list,
      // not just the first item.  Will address in future ticket
      const REALM = aliasList[0].alias;
      if (!newKrbAlias.includes(REALM)) {
        newKrbAlias = newKrbAlias + REALM;
      }
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
          <Form className="pf-v5-u-mb-lg">
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
                <Flex key={idx} className={idx !== 0 ? "pf-v5-u-mt-sm" : ""}>
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
            <FormGroup label="Description" fieldId="description">
              <IpaTextArea
                name="description"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Class" fieldId="userclass">
              <IpaTextInput
                name={"userclass"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Locality" fieldId="l">
              <IpaTextInput
                name={"l"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Location" fieldId="nshostlocation">
              <IpaTextInput
                name={"nshostlocation"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Platform" fieldId="nshardwareplatform">
              <IpaTextInput
                name={"nshardwareplatform"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Operating system" fieldId="nsosversion">
              <IpaTextInput
                name={"nsosversion"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form>
            <FormGroup label="SSH public keys" fieldId="ipasshpubkey">
              <IpaSshPublicKeys
                ipaObject={ipaObject}
                onChange={recordOnChange}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from={"hosts"}
              />
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
                classname={macAddressList.length !== 0 ? "pf-v5-u-mt-md" : ""}
                name="add"
                onClickHandler={onAddMacAddressFieldHandler}
              >
                Add
              </SecondaryButton>
            </FormGroup>
            <FormGroup
              label="Authentication indicators"
              fieldId="krbprincipalauthind"
              labelIcon={
                <PopoverWithIconLayout message={AuthIndicatorsTypesMessage} />
              }
            >
              <IpaCheckboxes
                name="krbprincipalauthind"
                options={[
                  {
                    value: "otp",
                    text: "Two-factor authentication (password + OTP)",
                  },
                  {
                    value: "radius",
                    text: "RADIUS",
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
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Trusted for delegation"
              fieldId="trusted-delegation"
            >
              <IpaCheckbox
                name="ipakrbokasdelegate"
                value="trustedForDelegation"
                text="Trusted for delegation"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Trusted to authenticate as a user"
              fieldId="trusted-auth-as-user"
            >
              <IpaCheckbox
                name="ipakrboktoauthasdelegate"
                value="trustedAuthAsUser"
                text="Trusted to authenticate as a user"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
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
    </>
  );
};

export default HostSettings;
