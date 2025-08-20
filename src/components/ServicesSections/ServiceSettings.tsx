import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { Metadata, Service } from "src/utils/datatypes/globalDataTypes";
// Components
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";
// Utils
import { asRecord } from "src/utils/serviceUtils";
// IPA components
import PrincipalAliasMultiTextBox from "../Form/PrincipalAliasMultiTextBox";
import IpaCheckboxes from "../Form/IpaCheckboxes";
import IpaCheckbox from "../Form/IpaCheckbox";
import IpaPACType from "../Form/IpaPACType";

interface PropsToServiceSettings {
  service: Partial<Service>;
  metadata: Metadata;
  onServiceChange: (service: Partial<Service>) => void;
  onRefresh: () => void;
}

const ServiceSettings = (props: PropsToServiceSettings) => {
  const serviceName = props.service.krbcanonicalname || "";

  // Extract 'service' and 'host' from 'krbcanonicalname' parameter
  const serviceHost = serviceName.split("/");
  const service = serviceHost[0];
  const hostRealm = serviceHost[1];
  let host = "";

  if (hostRealm) {
    host = hostRealm.split("@")[0];
  }

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.service,
    props.onServiceChange
  );

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

  // Render component
  return (
    <>
      <Flex direction={{ default: "column", lg: "row" }}>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-v6-u-mb-lg">
            <FormGroup
              label="Principal alias"
              fieldId="principal-alias"
              role="group"
            >
              <PrincipalAliasMultiTextBox
                dataCy="service-tab-settings-principal-alias"
                ipaObject={ipaObject}
                metadata={props.metadata}
                onRefresh={props.onRefresh}
                from="services"
              />
            </FormGroup>
            <FormGroup label="Service" fieldId="service">
              <TextInput
                data-cy="services-tab-settings-textbox-service"
                id="service"
                name="service"
                value={service}
                type="text"
                aria-label="service"
                isDisabled
              />
            </FormGroup>
            <FormGroup label="Host name" fieldId="host-name">
              <TextInput
                data-cy="services-tab-settings-textbox-host"
                id="host-name"
                name="host"
                value={host}
                type="text"
                aria-label="host name"
                isDisabled
              />
            </FormGroup>
            <FormGroup label="PAC type" fieldId="pac-type" role="group">
              <IpaPACType
                dataCy="service-tab-settings-pac-type"
                name="ipakrbauthzdata"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="service"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Form className="pf-v6-u-mb-lg">
            <FormGroup
              label="Authentication indicators"
              fieldId="authentication-indicators"
              role="group"
              labelHelp={
                <PopoverWithIconLayout message={AuthIndicatorsTypesMessage} />
              }
            >
              <IpaCheckboxes
                dataCy="service-tab-settings-checkbox-authentication-indicators"
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
                objectName="service"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Trusted for delegation"
              fieldId="trusted-delegation"
              role="group"
            >
              <IpaCheckbox
                dataCy="service-tab-settings-checkbox-trusted-delegation"
                name="ipakrbokasdelegate"
                value="trustedForDelegation"
                text="Trusted for delegation"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="service"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Trusted to authenticate as a user"
              fieldId="trusted-auth-as-user"
              role="group"
            >
              <IpaCheckbox
                dataCy="service-tab-settings-checkbox-trusted-auth-as-user"
                name="ipakrboktoauthasdelegate"
                value="trustedAuthAsUser"
                text="Trusted to authenticate as a user"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="service"
                metadata={props.metadata}
              />
            </FormGroup>
            <FormGroup
              label="Requires pre-authentication"
              fieldId="requires-pre-authentication"
              role="group"
            >
              <IpaCheckbox
                dataCy="service-tab-settings-checkbox-requires-pre-authentication"
                name="ipakrbrequirespreauth"
                value="requiresPreAuth"
                text="Requires pre-authentication"
                ipaObject={ipaObject}
                onChange={recordOnChange}
                objectName="service"
                metadata={props.metadata}
              />
            </FormGroup>
          </Form>
        </FlexItem>
      </Flex>
    </>
  );
};

export default ServiceSettings;
