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
// Utils
import { isFieldReadable, isFieldWritable } from "src/utils/utils";
import FieldWrapper from "src/utils/FieldWrapper";

interface PropsToPasswordPolicy {
  pwpolicyData: any;
  attrLevelRights: any;
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
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.krbmaxpwdlife)}
            isReadable={isFieldReadable(props.attrLevelRights.krbmaxpwdlife)}
          >
            <FormGroup label="Max lifetime (days)" fieldId="max-lifetime-days">
              <TextInput
                id="max-lifetime-days"
                name="krbmaxpwdlife"
                value={maxLifetimeDays}
                type="text"
                aria-label="max lifetime in days"
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.krbminpwdlife)}
            isReadable={isFieldReadable(props.attrLevelRights.krbminpwdlife)}
          >
            <FormGroup
              label="Min lifetime (hours)"
              fieldId="mini-lifetime-hours"
            >
              <TextInput
                id="min-lifetime-hours"
                name="krbminpwdlife"
                value={minLifetimeHours}
                type="text"
                aria-label="min lifetime in hours"
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.krbpwdhistorylength
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.krbpwdhistorylength
            )}
          >
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
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.krbpwdmindiffchars
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.krbpwdmindiffchars
            )}
          >
            <FormGroup label="Character classes" fieldId="character-classes">
              <TextInput
                id="character-classes"
                name="krbpwdmindiffchars"
                value={characterClasses}
                type="text"
                aria-label="character classes"
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.krbpwdminlength)}
            isReadable={isFieldReadable(props.attrLevelRights.krbpwdminlength)}
          >
            <FormGroup label="Min length" fieldId="min-length">
              <TextInput
                id="min-length"
                name="krbpwdminlength"
                value={minLength}
                type="text"
                aria-label="min length"
              />
            </FormGroup>
          </FieldWrapper>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FieldWrapper
            isWritable={isFieldWritable(props.attrLevelRights.krbpwdmaxfailure)}
            isReadable={isFieldReadable(props.attrLevelRights.krbpwdmaxfailure)}
          >
            <FormGroup label="Max failures" fieldId="max-failures">
              <TextInput
                id="max-failures"
                name="krbpwdmaxfailure"
                value={maxFailures}
                type="text"
                aria-label="max failures"
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.krbpwdfailurecountinterval
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.krbpwdfailurecountinterval
            )}
          >
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
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.krbpwdlockoutduration
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.krbpwdlockoutduration
            )}
          >
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
              />
            </FormGroup>
          </FieldWrapper>
          <FieldWrapper
            isWritable={isFieldWritable(
              props.attrLevelRights.passwordgracelimit
            )}
            isReadable={isFieldReadable(
              props.attrLevelRights.passwordgracelimit
            )}
          >
            <FormGroup label="Grace login limit" fieldId="grace-login-limit">
              <TextInput
                id="grace-login-limit"
                name="passwordgracelimit"
                value={graceLoginLimit}
                type="text"
                aria-label="grace login limit"
              />
            </FormGroup>
          </FieldWrapper>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersPasswordPolicy;
