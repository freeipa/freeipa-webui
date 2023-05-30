/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

interface PropsToKerberosTicket {
  krbtpolicyData: any;
}

const UsersKerberosTicket = (props: PropsToKerberosTicket) => {
  // TODO: Specify field access (read/write) based on 'attributelevelrights'
  const [maxRenew, setMaxRenew] = useState("");
  const [maxLife, setMaxLife] = useState("");

  // Updates data on 'krbtpolicyData' changes
  useEffect(() => {
    if (props.krbtpolicyData !== undefined) {
      setMaxRenew(props.krbtpolicyData.krbmaxrenewableage[0]);
      setMaxLife(props.krbtpolicyData.krbmaxticketlife[0]);
    }
  }, [props.krbtpolicyData]);

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Max renew (seconds)" fieldId="max-renew">
            <TextInput
              id="max-renew"
              name="krbmaxrenewableage"
              value={maxRenew}
              type="text"
              aria-label="max renew in seconds"
              isDisabled
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Max life (seconds)" fieldId="max-life">
            <TextInput
              id="max-life"
              name="krbmaxticketlife"
              value={maxLife}
              type="text"
              aria-label="max life in seconds"
              isDisabled
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersKerberosTicket;
