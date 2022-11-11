// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

const UsersKerberosTicket = () => {
  // TODO: This state variables should update the user data via the IPA API (`krbtpolicy_mod`)
  const [maxRenew] = useState("");
  const [maxLife] = useState("");

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
