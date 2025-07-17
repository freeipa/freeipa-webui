import React from "react";
// PatternFly
import { Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaNumberInput from "src/components/Form/IpaNumberInput";

interface PropsToSearchOPtions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
}

const ConfigSearchOptions = (props: PropsToSearchOPtions) => {
  return (
    <Form className="pf-v5-u-mb-lg pf-v5-u-mt-lg" isHorizontal>
      <FormGroup label="Search size limit" fieldId="ipasearchrecordslimit">
        <IpaNumberInput
          dataCy="configuration-textbox-ipasearchrecordslimit"
          id="ipasearchrecordslimit"
          name="ipasearchrecordslimit"
          aria-label="search size limit"
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="config"
          metadata={props.metadata}
          numCharsShown={6}
          minValue={-1}
          maxValue={2147483647}
        />
      </FormGroup>
      <FormGroup label="Search time limit" fieldId="ipasearchtimelimit">
        <IpaNumberInput
          dataCy="configuration-textbox-ipasearchtimelimit"
          id="ipasearchtimelimit"
          name="ipasearchtimelimit"
          aria-label="search time limit"
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="config"
          metadata={props.metadata}
          numCharsShown={6}
          minValue={-1}
          maxValue={2147483647}
        />
      </FormGroup>
    </Form>
  );
};

export default ConfigSearchOptions;
