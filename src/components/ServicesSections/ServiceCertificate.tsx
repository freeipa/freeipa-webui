import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Forms
import IpaCertificates from "../Form/IpaCertificates";
// Utils
import { asRecord } from "src/utils/serviceUtils";
// Data types
import {
  Certificate,
  Metadata,
  Service,
} from "src/utils/datatypes/globalDataTypes";

interface PropsToServiceSettings {
  service: Partial<Service>;
  metadata: Metadata;
  onServiceChange: (service: Partial<Service>) => void;
  onRefresh: () => void;
  certData?: Certificate[];
}

const ServiceCertificate = (props: PropsToServiceSettings) => {
  const { ipaObject, recordOnChange } = asRecord(
    props.service,
    props.onServiceChange
  );

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Certificates" fieldId="certificates" role="group">
            <IpaCertificates
              ipaObject={ipaObject}
              onChange={recordOnChange}
              metadata={props.metadata}
              certificates={props.certData}
              onRefresh={props.onRefresh}
              objectType="service"
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default ServiceCertificate;
