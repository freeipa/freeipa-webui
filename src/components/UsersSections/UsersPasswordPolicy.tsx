import React, { useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

const UsersPasswordPolicy = () => {
  // TODO: This state variables should update the user data via the IPA API (`pwpolicy_mod`)
  const [maxLifetimeDays] = useState("");
  const [minLifetimeHours] = useState("");
  const [historySize] = useState("");
  const [characterClasses] = useState("");
  const [minLength] = useState("");
  const [maxFailures] = useState("");
  const [futureResetInterval] = useState("");
  const [lockoutDuration] = useState("");
  const [graceLoginLimit] = useState("");

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Max lifetime (days)" fieldId="max-lifetime-days">
            <TextInput
              id="max-lifetime-days"
              name="krbmaxpwdlife"
              value={maxLifetimeDays}
              type="text"
              aria-label="max lifetime in days"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="Min lifetime (hours)" fieldId="mini-lifetime-hours">
            <TextInput
              id="min-lifetime-hours"
              name="krbminpwdlife"
              value={minLifetimeHours}
              type="text"
              aria-label="min lifetime in hours"
              isDisabled
            />
          </FormGroup>
          <FormGroup
            label="History size (number of passwords)"
            fieldId="history-size"
          >
            <TextInput
              id="history-size"
              name="krbpwdhistorylength"
              value={historySize}
              type="text"
              aria-label="history size"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="Character classes" fieldId="character-classes">
            <TextInput
              id="character-classes"
              name="krbpwdmindiffchars"
              value={characterClasses}
              type="text"
              aria-label="character classes"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="Min length" fieldId="min-length">
            <TextInput
              id="min-length"
              name="krbpwdminlength"
              value={minLength}
              type="text"
              aria-label="min length"
              isDisabled
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Max failures" fieldId="max-failures">
            <TextInput
              id="max-failures"
              name="krbpwdminlength"
              value={maxFailures}
              type="text"
              aria-label="max failures"
              isDisabled
            />
          </FormGroup>
          <FormGroup
            label="Future reset interval (seconds)"
            fieldId="future-reset-interval"
          >
            <TextInput
              id="future-reset-interval"
              name="krbpwdfailurecountinterval"
              value={futureResetInterval}
              type="text"
              aria-label="future reset interval in seconds"
              isDisabled
            />
          </FormGroup>
          <FormGroup
            label="Lockout duration (seconds)"
            fieldId="lockout-duration"
          >
            <TextInput
              id="lockout-duration"
              name="krbpwdlockoutduration"
              value={lockoutDuration}
              type="text"
              aria-label="lockout duration in seconds"
              isDisabled
            />
          </FormGroup>
          <FormGroup label="Grace login limit" fieldId="grace-login-limit">
            <TextInput
              id="grace-login-limit"
              name="passwordgracelimit"
              value={graceLoginLimit}
              type="text"
              aria-label="grace login limit"
              isDisabled
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersPasswordPolicy;
