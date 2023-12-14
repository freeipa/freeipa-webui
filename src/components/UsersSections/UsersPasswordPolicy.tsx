import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

interface PropsToPasswordPolicy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pwdPolicyData: Record<string, any>;
}

const UsersPasswordPolicy = (props: PropsToPasswordPolicy) => {
  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Max lifetime (days)" fieldId="max-lifetime-days">
            <TextInput
              id="max-lifetime-days"
              name="krbmaxpwdlife"
              value={props.pwdPolicyData.krbmaxpwdlife}
              type="text"
              aria-label="max lifetime in days"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup label="Min lifetime (hours)" fieldId="mini-lifetime-hours">
            <TextInput
              id="min-lifetime-hours"
              name="krbminpwdlife"
              value={props.pwdPolicyData.krbminpwdlife}
              type="text"
              aria-label="min lifetime in hours"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup
            label="History size (number of passwords)"
            fieldId="history-size"
          >
            <TextInput
              id="history-size"
              name="krbpwdhistorylength"
              value={props.pwdPolicyData.krbpwdhistorylength}
              type="text"
              aria-label="history size"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup label="Character classes" fieldId="character-classes">
            <TextInput
              id="character-classes"
              name="krbpwdmindiffchars"
              value={props.pwdPolicyData.krbpwdmindiffchars}
              type="text"
              aria-label="character classes"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup label="Min length" fieldId="min-length">
            <TextInput
              id="min-length"
              name="krbpwdminlength"
              value={props.pwdPolicyData.krbpwdminlength}
              type="text"
              aria-label="min length"
              readOnlyVariant="plain"
            />
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg">
          <FormGroup label="Max failures" fieldId="max-failures">
            <TextInput
              id="max-failures"
              name="krbpwdmaxfailure"
              value={props.pwdPolicyData.krbpwdmaxfailure}
              type="text"
              aria-label="max failures"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup
            label="Future reset interval (seconds)"
            fieldId="future-reset-interval"
          >
            <TextInput
              id="future-reset-interval"
              name="krbpwdfailurecountinterval"
              value={props.pwdPolicyData.krbpwdfailurecountinterval}
              type="text"
              aria-label="future reset interval in seconds"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup
            label="Lockout duration (seconds)"
            fieldId="lockout-duration"
          >
            <TextInput
              id="lockout-duration"
              name="krbpwdlockoutduration"
              value={props.pwdPolicyData.krbpwdlockoutduration}
              type="text"
              aria-label="lockout duration in seconds"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup label="Grace login limit" fieldId="grace-login-limit">
            <TextInput
              id="grace-login-limit"
              name="passwordgracelimit"
              value={props.pwdPolicyData.passwordgracelimit}
              type="text"
              aria-label="grace login limit"
              readOnlyVariant="plain"
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersPasswordPolicy;
