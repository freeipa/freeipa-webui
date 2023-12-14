import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Forms
import IpaCertificates from "../Form/IpaCertificates";
import { asRecord } from "../../utils/hostUtils";
// Data types
import { Host, Metadata } from "../../utils/datatypes/globalDataTypes";

interface PropsToHostSettings {
  host: Partial<Host>;
  metadata: Metadata;
  onHostChange: (host: Partial<Host>) => void;
  onRefresh: () => void;
  certData: Record<string, unknown>;
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
          <FormGroup label="Certificates" fieldId="certificates">
            {certificatesList.length > 0 ? (
              certificatesList.map((cert) => {
                return (
                  <>
                    {cert.certificate}
                    <SecondaryButton>Show</SecondaryButton>
                    <SecondaryButton>Delete</SecondaryButton>
                  </>
                );
              })
            ) : (
              <SecondaryButton>Add</SecondaryButton>
            )}
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default HostCertificate;
