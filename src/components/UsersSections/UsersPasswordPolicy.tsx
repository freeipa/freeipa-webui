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

interface PropsToPasswordPolicy {
  pwpolicyData: any;
}

const UsersPasswordPolicy = (props: PropsToPasswordPolicy) => {
  // TODO: Specify field access (read/write) based on 'attributelevelrights'
  const [maxLifetimeDays, setMaxLifetimeDays] = useState("");
  const [minLifetimeHours, setMinLifetimeHours] = useState("");
  const [historySize, setHistorySize] = useState("");
  const [characterClasses, setCharacterClasses] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxFailures, setMaxFailures] = useState("");
  const [futureResetInterval, setFutureResetInterval] = useState("");
  const [lockoutDuration, setLockoutDuration] = useState("");
  const [graceLoginLimit, setGraceLoginLimit] = useState("");

  // Updates data on 'pwpolicyData' changes
  useEffect(() => {
    if (props.pwpolicyData !== undefined) {
      setMaxLifetimeDays(props.pwpolicyData.krbmaxpwdlife[0]);
      setMinLifetimeHours(props.pwpolicyData.krbminpwdlife[0]);
      setHistorySize(props.pwpolicyData.krbpwdhistorylength[0]);
      setCharacterClasses(props.pwpolicyData.krbpwdmindiffchars[0]);
      setMinLength(props.pwpolicyData.krbpwdminlength[0]);
      setMaxFailures(props.pwpolicyData.krbpwdmaxfailure[0]);
      setFutureResetInterval(props.pwpolicyData.krbpwdfailurecountinterval[0]);
      setLockoutDuration(props.pwpolicyData.krbpwdlockoutduration[0]);
      setGraceLoginLimit(props.pwpolicyData.passwordgracelimit[0]);
    }
  }, [props.pwpolicyData]);

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
