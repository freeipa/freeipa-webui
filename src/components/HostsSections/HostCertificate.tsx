import React, { useState } from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";

interface Certificate {
  id: string | number;
  certificate: string;
}

const HostCertificate = () => {
  // Certificates
  const [certificatesList] = useState<Certificate[]>([]);

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
