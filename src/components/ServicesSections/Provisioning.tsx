import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup, Icon } from "@patternfly/react-core";
// Layouts
import TextLayout from "../layouts/TextLayout";
// Icons
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
// Data types
import { Metadata, Service } from "src/utils/datatypes/globalDataTypes";

interface PropsToServiceProvisioning {
  service: Partial<Service>;
  metadata: Metadata;
}

const Provisioning = (props: PropsToServiceProvisioning) => {
  const hasKeytab = props.service.has_keytab || false;

  // Icons
  const kerberosKeyIcon = (
    <Icon>
      <CheckIcon />
    </Icon>
  );
  const noKerberosKeyIcon = (
    <Icon>
      <ExclamationTriangleIcon />
    </Icon>
  );

  // TODO: Implement the logic to show the correct message
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form>
          <FormGroup label="Kerberos key" fieldId="kerberos-key">
            <Flex>
              {hasKeytab ? (
                <>
                  <FlexItem>{kerberosKeyIcon}</FlexItem>
                  <FlexItem>
                    <TextLayout>
                      Kerberos key present, Host provisioned
                    </TextLayout>
                  </FlexItem>
                </>
              ) : (
                <>
                  <FlexItem>{noKerberosKeyIcon}</FlexItem>
                  <FlexItem>
                    <TextLayout>Kerberos key not present</TextLayout>
                  </FlexItem>
                </>
              )}
            </Flex>
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default Provisioning;
