import React, { useState } from "react";
// PatternFly
import {
  Checkbox,
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
import SecondaryButton from "../layouts/SecondaryButton";
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Modals
import PrincipalAliasMultiTextBox from "../Form/PrincipalAliasMultiTextBox";
// Utils
import { asRecord } from "../../utils/hostUtils";

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
  host: Partial<Host>;
  metadata: Metadata;
  onHostChange: (host: Partial<Host>) => void;
  onRefresh: () => void;
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

  // - 'Remove MAC address' handler
  const onRemoveMacAddressHandler = (idx: number) => {
    const macAddressListCopy = [...macAddressList];
    macAddressListCopy.splice(idx, 1);
    setMacAddressList(macAddressListCopy);
  };

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
            <FormGroup
              label="Kerberos principal alias"
              fieldId="krbprincipalname"
            >
              <PrincipalAliasMultiTextBox
                ipaObject={ipaObject}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from="hosts"
              />
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
    </>
  );
};

export default HostSettings;
