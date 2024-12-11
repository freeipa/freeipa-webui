import React from "react";
// PatternFly
import { Form, FormGroup } from "@patternfly/react-core";
// Ipa Components
import IpaTextInput from "../Form/IpaTextInput";
import IpaTextArea from "../Form/IpaTextArea";
import IpaNumberInput from "../Form/IpaNumberInput/IpaNumberInput";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";

interface PropsToSudoRuleGeneral {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
}

const SudoRuleGeneral = (props: PropsToSudoRuleGeneral) => {
  return (
    <Form className="pf-v5-u-mt-sm pf-v5-u-mb-lg pf-v5-u-mr-md" isHorizontal>
      <FormGroup label="Rule name" fieldId="rule-name">
        <IpaTextInput
          name="cn"
          aria-label="rule name"
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="sudorule"
          metadata={props.metadata}
        />
      </FormGroup>
      <FormGroup label="Sudo order" fieldId="sudo-order">
        <IpaNumberInput
          name="sudoorder"
          aria-label="sudo order"
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="sudorule"
          metadata={props.metadata}
          numCharsShown={15}
          minValue={0}
          maxValue={2147483647}
        />
      </FormGroup>
      <FormGroup label="Description" fieldId="description">
        <IpaTextArea
          name="description"
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="sudorule"
          metadata={props.metadata}
        />
      </FormGroup>
    </Form>
  );
};

export default SudoRuleGeneral;
