import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Forms
import IpaCertificates from "../Form/IpaCertificates";
import { asRecord } from "../../utils/hostUtils";
// Data types
import {
  Certificate,
  Host,
  Metadata,
} from "../../utils/datatypes/globalDataTypes";

interface PropsToHostSettings {
  host: Partial<Host>;
  metadata: Metadata;
  onHostChange: (host: Partial<Host>) => void;
  onRefresh: () => void;
  certData?: Certificate[];
}

const HostCertificate = (props: PropsToHostSettings) => {
  const { ipaObject, recordOnChange } = asRecord(
    props.host,
    props.onHostChange
  );

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup
            label="Certificates"
            fieldId="usercertificate"
            role="group"
          >
            <IpaCertificates
              dataCy="host-certificate"
              ipaObject={ipaObject}
              onChange={recordOnChange}
              metadata={props.metadata}
              certificates={props.certData}
              onRefresh={props.onRefresh}
              objectType="host"
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default HostCertificate;
