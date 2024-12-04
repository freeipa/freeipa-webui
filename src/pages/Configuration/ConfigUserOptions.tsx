import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Components
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";
// Form
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaTextArea from "src/components/Form/IpaTextArea";
import IpaNumberInput from "src/components/Form/IpaNumberInput";
import IpaCheckboxes from "src/components/Form/IpaCheckboxes";
import IpaCheckbox from "src/components/Form/IpaCheckbox/IpaCheckbox";
import IpaDropdownSearch from "src/components/Form/IpaDropdownSearch";
import ConfigObjectclassTable from "./ConfigObjectclassTable";

interface PropsToSearchOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  groups: string[];
  onSearch: (value: string) => void;
}

const ConfigUserOptions = (props: PropsToSearchOptions) => {
  const AuthTypesMessage = () => (
    <div>
      <p>Implicit method (password) will be used if no method is chosen.</p>
      <p>
        <strong>Password + Two-factor:</strong> LDAP and Kerberos allow
        authentication with either one of the authentication types but Kerberos
        uses pre-authentication method which requires to use armor ccache.
      </p>
      <p>
        <strong>RADIUS with another type:</strong>
        Kerberos always use RADIUS, but LDAP never does. LDAP only recognize the
        password and two-factor authentication options.
      </p>
    </div>
  );

  const DomainMessage = () => (
    <div>
      <p>colon-separated list of domains used for short name qualification</p>
    </div>
  );

  return (
    <Flex
      direction={{ default: "column", lg: "row" }}
      flex={{ default: "flex_1" }}
    >
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg pf-v5-u-mt-lg" isHorizontal>
          <FormGroup
            label="User search fields"
            fieldId="ipausersearchfields"
            isRequired
          >
            <IpaTextArea
              name="ipausersearchfields"
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Default e-mail domain"
            fieldId="ipadefaultemaildomain"
          >
            <IpaTextInput
              name={"ipadefaultemaildomain"}
              ariaLabel={"Default e-mail domain"}
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Domain resolution order"
            fieldId="ipadomainresolutionorder"
            labelIcon={
              <PopoverWithIconLayout message={DomainMessage} triggerHover />
            }
          >
            <IpaTextArea
              name={"ipadomainresolutionorder"}
              ariaLabel={"Domain resolution order"}
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Default users group"
            fieldId="ipadefaultprimarygroup"
          >
            <IpaDropdownSearch
              id="ipadefaultprimarygroup"
              name="ipadefaultprimarygroup"
              options={props.groups}
              ipaObject={props.ipaObject}
              setIpaObject={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
              onSearch={props.onSearch}
            />
          </FormGroup>
          <FormGroup
            label="Home directory base"
            fieldId="ipahomesrootdir"
            isRequired
          >
            <IpaTextInput
              name={"ipahomesrootdir"}
              ariaLabel={"Home directory base"}
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Default shell"
            fieldId="ipadefaultloginshell"
            isRequired
          >
            <IpaTextInput
              name={"ipadefaultloginshell"}
              ariaLabel={"Default shell"}
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Maximum username length"
            fieldId="ipamaxusernamelength"
            isRequired
          >
            <IpaNumberInput
              id="ipamaxusernamelength"
              name="ipamaxusernamelength"
              aria-label="Maximum username length"
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
              numCharsShown={6}
              minValue={1}
              maxValue={255}
            />
          </FormGroup>
          <FormGroup
            label="Password Expiration Notification (days)"
            fieldId="ipapwdexpadvnotify"
            isRequired
          >
            <IpaNumberInput
              id="ipapwdexpadvnotify"
              name="ipapwdexpadvnotify"
              aria-label="Password Expiration Notification (days)"
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
              numCharsShown={6}
              minValue={1}
              maxValue={2147483647}
            />
          </FormGroup>
          <FormGroup label="Password plugin features" fieldId="ipaconfigstring">
            <IpaCheckboxes
              name="ipaconfigstring"
              options={[
                {
                  value: "AllowNThash",
                  text: "AllowNThash",
                },
                {
                  value: "KDC:Disable Last Success",
                  text: "KDC:Disable Last Success",
                },

                {
                  value: "KDC:Disable Lockout",
                  text: "KDC:Disable Lockout",
                },
              ]}
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Default user authentication types"
            fieldId="ipauserauthtyp"
            labelIcon={
              <PopoverWithIconLayout message={AuthTypesMessage} triggerHover />
            }
          >
            <IpaCheckboxes
              name="ipauserauthtype"
              options={[
                {
                  value: "disabled",
                  text: "Disable per-user override",
                },
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
                  text: "Two factor authentication (password + OTP)",
                },
                {
                  value: "pkinit",
                  text: "PKINIT",
                },
                {
                  value: "hardened",
                  text: "Hardened Password (by SPAKE or FAST)",
                },
                {
                  value: "idp",
                  text: "External Identity Provider",
                },
                {
                  value: "passkey",
                  text: "Passkey",
                },
              ]}
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup
            label="Enable migration mode"
            fieldId="ipamigrationenabled"
          >
            <IpaCheckbox
              name="ipamigrationenabled"
              value="ipamigrationenabled"
              text=""
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
              className="pf-v5-u-pt-sm"
            />
          </FormGroup>
          <FormGroup
            label="Enable adding subids to new users"
            fieldId="ipauserdefaultsubordinateid"
          >
            <IpaCheckbox
              name="ipauserdefaultsubordinateid"
              value="ipauserdefaultsubordinateid"
              text=""
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
              className="pf-v5-u-pt-sm"
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg pf-v5-u-mt-lg">
          <FormGroup
            label="Default user objectclasses"
            fieldId="ipauserobjectclasses"
          >
            <ConfigObjectclassTable
              title="Default user objectclasses"
              name="ipauserobjectclasses"
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default ConfigUserOptions;
