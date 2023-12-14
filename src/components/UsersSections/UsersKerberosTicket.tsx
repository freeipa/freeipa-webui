import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

interface PropsToKrbTicket {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  krbPolicyData: Record<string, any>;
}

const UsersKerberosTicket = (props: PropsToKrbTicket) => {
  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Max renew (seconds)" fieldId="max-renew">
            <TextInput
              id="max-renew"
              name="krbmaxrenewableage"
              value={props.krbPolicyData.krbmaxrenewableage}
              type="text"
              aria-label="max renew in seconds"
              readOnlyVariant="plain"
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Max life (seconds)" fieldId="max-life">
            <TextInput
              id="max-life"
              name="krbmaxticketlife"
              value={props.krbPolicyData.krbmaxticketlife}
              type="text"
              aria-label="max life in seconds"
              readOnlyVariant="plain"
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersKerberosTicket;
