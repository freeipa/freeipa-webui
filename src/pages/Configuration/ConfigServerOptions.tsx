import React from "react";
// PatternFly
import { Form, FormGroup, TextArea } from "@patternfly/react-core";
// Data types
import { Config, Metadata } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaDropdownSearch from "src/components/Form/IpaDropdownSearch";

interface PropsToServerOptions {
  config: Partial<Config>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
}

const ConfigServerOptions = (props: PropsToServerOptions) => {
  let options = props.config.pkinit_server_server
    ? [...props.config.pkinit_server_server]
    : [];

  const handleSearch = (value: string) => {
    options = options.filter(
      (item) =>
        item !== props.config.ca_renewal_master_server &&
        item.indexOf(value) !== -1
    );
  };

  return (
    <Form className="pf-v6-u-mb-lg pf-v6-u-mt-lg" isHorizontal>
      <FormGroup
        label="IPA CA renewal master"
        fieldId="ca_renewal_master_server"
      >
        <IpaDropdownSearch
          dataCy="configuration-dropdown-renewal-master"
          id="ca_renewal_master_server"
          name="ca_renewal_master_server"
          options={options}
          ipaObject={props.ipaObject}
          setIpaObject={props.recordOnChange}
          objectName="config"
          metadata={props.metadata}
          onSearch={handleSearch}
        />
      </FormGroup>
      <FormGroup
        label="IPA masters capable of PKINIT"
        fieldId="pkinit_server_server"
      >
        <TextArea
          data-cy="configuration-textbox-pkinit-server"
          id="pkinit_server_server"
          name="pkinit_server_server"
          aria-label="master capable of PKINIT"
          value={
            props.config.pkinit_server_server
              ? props.config.pkinit_server_server.join(", ")
              : ""
          }
          isDisabled
        />
      </FormGroup>
    </Form>
  );
};

export default ConfigServerOptions;
