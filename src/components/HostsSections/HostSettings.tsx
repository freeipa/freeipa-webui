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
import IpaCheckbox from "../Form/IpaCheckbox";
import IpaCheckboxes from "../Form/IpaCheckboxes";
import IpaSshPublicKeys from "../Form/IpaSshPublicKeys";
import IpaTextboxList from "../Form/IpaTextboxList";

// Layouts
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Modals
import PrincipalAliasMultiTextBox from "../Form/PrincipalAliasMultiTextBox";
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
  onRefresh: () => void;
}

const HostSettings = (props: PropsToHostSettings) => {
  // Host name - textbox (mandatory field)
  let fqdn = "";
  if (props.host.fqdn !== undefined) {
    fqdn = props.host.fqdn;
  }
  const [hostName] = useState(fqdn);

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hosts" });

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

  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-v6-u-mb-lg">
            <FormGroup label="Host name" fieldId="host-name">
              <TextInput
                data-cy="hosts-tab-settings-textbox-host-name"
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
              role="group"
            >
              <PrincipalAliasMultiTextBox
                dataCy="host-tab-settings-principal-alias"
                ipaObject={ipaObject}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from="hosts"
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="description">
              <IpaTextArea
                dataCy="host-tab-settings-textbox-description"
                name="description"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Class" fieldId="userclass">
              <IpaTextInput
                dataCy="host-tab-settings-textbox-userclass"
                name={"userclass"}
                ariaLabel={"User class"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Locality" fieldId="l">
              <IpaTextInput
                dataCy="host-tab-settings-textbox-locality"
                name={"l"}
                ariaLabel={"Locality"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Location" fieldId="nshostlocation">
              <IpaTextInput
                dataCy="host-tab-settings-textbox-location"
                name={"nshostlocation"}
                ariaLabel={"Location"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Platform" fieldId="nshardwareplatform">
              <IpaTextInput
                dataCy="host-tab-settings-textbox-platform"
                name={"nshardwareplatform"}
                ariaLabel={"Platform"}
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="host"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup label="Operating system" fieldId="nsosversion">
              <IpaTextInput
                dataCy="host-tab-settings-textbox-os-version"
                name={"nsosversion"}
                ariaLabel={"Operating system"}
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
            <FormGroup
              label="SSH public keys"
              fieldId="ipasshpubkey"
              role="group"
            >
              <IpaSshPublicKeys
                dataCy="host-tab-settings-ssh-public-keys"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from={"hosts"}
              />
            </FormGroup>
            <FormGroup label="MAC address" fieldId="macaddress" role="group">
              <IpaTextboxList
                dataCy="host-tab-settings-textbox-mac-address"
                ipaObject={ipaObject}
                setIpaObject={recordOnChange}
                name={"macaddress"}
                ariaLabel={"MAC address"}
                validator={validateMAC}
              />
            </FormGroup>
            <FormGroup
              label="Authentication indicators"
              fieldId="krbprincipalauthind"
              role="group"
              labelHelp={
                <PopoverWithIconLayout message={AuthIndicatorsTypesMessage} />
              }
            >
              <IpaCheckboxes
                dataCy="host-tab-settings-checkbox-auth-indicators"
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
              role="group"
            >
              <IpaCheckbox
                dataCy="host-tab-settings-checkbox-trusted-for-delegation"
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
              role="group"
            >
              <IpaCheckbox
                dataCy="host-tab-settings-checkbox-trusted-auth-as-user"
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
                data-cy="host-tab-settings-textbox-assigned-id-view"
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
