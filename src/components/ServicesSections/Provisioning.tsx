import React from "react";
// PatternFly
import {
  Content,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Icon,
} from "@patternfly/react-core";
// Icons
import { CheckIcon } from "@patternfly/react-icons";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
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
    <Flex
      direction={{ default: "column", lg: "row" }}
      className="pf-v6-u-mb-lg"
    >
      <FlexItem flex={{ default: "flex_1" }}>
        <Form>
          <FormGroup label="Kerberos key" fieldId="kerberos-key" role="group">
            <Flex>
              {hasKeytab ? (
                <>
                  <FlexItem>{kerberosKeyIcon}</FlexItem>
                  <FlexItem>
                    <Content>Kerberos key present, Host provisioned</Content>
                  </FlexItem>
                </>
              ) : (
                <>
                  <FlexItem>{noKerberosKeyIcon}</FlexItem>
                  <FlexItem>
                    <Content>Kerberos key not present</Content>
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
