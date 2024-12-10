import React from "react";
// PatternFly
import { Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaCheckboxes from "src/components/Form/IpaCheckboxes/IpaCheckboxes";

interface PropsToServiceOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
}

const ConfigServiceOptions = (props: PropsToServiceOptions) => {
  return (
    <Form className="pf-v5-u-mt-md" isHorizontal>
      <FormGroup label="Default PAC types" fieldId="ipakrbauthzdata">
        <IpaCheckboxes
          name="ipakrbauthzdata"
          options={[
            {
              value: "MS-PAC",
              text: "MS-PAC",
            },
            {
              value: "PAD",
              text: "PAD",
            },
            {
              value: "nfs:NONE",
              text: "nfs:NONE",
            },
          ]}
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="config"
          metadata={props.metadata}
        />
      </FormGroup>
    </Form>
  );
};

export default ConfigServiceOptions;
