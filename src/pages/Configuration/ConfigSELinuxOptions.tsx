import React from "react";
// PatternFly
import { Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaTextArea from "src/components/Form/IpaTextArea/IpaTextArea";
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";

interface PropsToSELinuxOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
}

const ConfigSELinuxOptions = (props: PropsToSELinuxOptions) => {
  return (
    <Form className="pf-v5-u-mb-lg pf-v5-u-mt-lg" isHorizontal>
      <FormGroup
        label="SELinux user map order"
        fieldId="ipaselinuxusermaporder"
        isRequired
      >
        <IpaTextArea
          name={"ipaselinuxusermaporder"}
          ariaLabel={"SELinux user map order"}
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="config"
          metadata={props.metadata}
        />
      </FormGroup>
      <FormGroup
        label="Default SELinux user"
        fieldId="ipaselinuxusermapdefault"
      >
        <IpaTextInput
          name={"ipaselinuxusermapdefault"}
          ariaLabel={"Default SELinux user"}
          ipaObject={props.ipaObject}
          onChange={props.recordOnChange}
          objectName="config"
          metadata={props.metadata}
        />
      </FormGroup>
    </Form>
  );
};

export default ConfigSELinuxOptions;
