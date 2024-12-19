import React from "react";
// PatternFly
import { Flex, FlexItem, Form, FormGroup } from "@patternfly/react-core";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Form
import IpaTextArea from "src/components/Form/IpaTextArea/IpaTextArea";
import ConfigObjectclassTable from "./ConfigObjectclassTable";

interface PropsToGroupOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
}

const ConfigGroupOptions = (props: PropsToGroupOptions) => {
  return (
    <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-v5-u-mb-lg pf-v5-u-mt-lg" isHorizontal>
          <FormGroup
            label="Group search fields"
            fieldId="ipagroupsearchfields"
            isRequired
          >
            <IpaTextArea
              name="ipagroupsearchfields"
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
        <Form className="pf-v5-u-mb-lg pf-v5-u-mt-lg">
          <FormGroup
            label="Default group objectclasses"
            fieldId="ipagroupobjectclasses"
          >
            <ConfigObjectclassTable
              title="Default group objectclasses"
              name="ipagroupobjectclasses"
              ipaObject={props.ipaObject}
              onChange={props.recordOnChange}
              objectName="config"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default ConfigGroupOptions;
