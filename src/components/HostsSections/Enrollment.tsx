import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup, Icon } from "@patternfly/react-core";
// Layouts
import TextLayout from "../layouts/TextLayout";
// Icons
import { CheckIcon } from "@patternfly/react-icons";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
// Data types
import { Host } from "../../utils/datatypes/globalDataTypes";

interface PropsToEnrollment {
  host: Partial<Host>;
}

const Enrollment = (props: PropsToEnrollment) => {
  // Icons
  const presentIcon = (
    <Icon>
      <CheckIcon />
    </Icon>
  );

  const missingIcon = (
    <Icon>
      <ExclamationTriangleIcon />
    </Icon>
  );

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form>
          <FormGroup label="Kerberos key" fieldId="kerberos-key">
            <Flex>
              <FlexItem>
                {props.host.has_keytab ? presentIcon : missingIcon}
              </FlexItem>
              <FlexItem>
                <TextLayout>
                  {props.host.has_keytab
                    ? "Kerberos key present, Host provisioned"
                    : "Kerberos key not present, Host not provisioned"}
                </TextLayout>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form>
          <FormGroup label="One-time password" fieldId="one-time-password">
            <Flex>
              <FlexItem>
                {props.host.has_password ? presentIcon : missingIcon}
              </FlexItem>
              <FlexItem>
                <TextLayout>
                  {props.host.has_password
                    ? "One-Time Password Present"
                    : "One-Time Password Not Present"}
                </TextLayout>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default Enrollment;
