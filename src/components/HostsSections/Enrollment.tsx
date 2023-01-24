import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup, Icon } from "@patternfly/react-core";
// Layouts
import TextLayout from "../layouts/TextLayout";
// Icons
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";

const Enrollment = () => {
  // TODO: This needs to be adapted to real data. The text and icons might change due to that.
  // Icons
  const kerberusKeyIcon = (
    <Icon>
      <CheckIcon />
    </Icon>
  );

  const oneTimePwd = (
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
              <FlexItem>{kerberusKeyIcon}</FlexItem>
              <FlexItem>
                <TextLayout>Kerberos key present, Host provisioned</TextLayout>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form>
          <FormGroup label="One-time password" fieldId="one-time-password">
            <Flex>
              <FlexItem>{oneTimePwd}</FlexItem>
              <FlexItem>
                <TextLayout>One-Time Password Not Present</TextLayout>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default Enrollment;
