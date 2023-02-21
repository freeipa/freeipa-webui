import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup, Icon } from "@patternfly/react-core";
// Layouts
import TextLayout from "../layouts/TextLayout";
// Icons
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";

const Provisioning = () => {
  // TODO: This needs to be adapted to real data. The text and icons should change.
  // Icons
  const kerberosKeyIcon = (
    <Icon>
      <CheckIcon />
    </Icon>
  );

  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form>
          <FormGroup label="Kerberos key" fieldId="kerberos-key">
            <Flex>
              <FlexItem>{kerberosKeyIcon}</FlexItem>
              <FlexItem>
                <TextLayout>Kerberos key present, Host provisioned</TextLayout>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default Provisioning;
