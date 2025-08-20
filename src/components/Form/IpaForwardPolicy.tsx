import React from "react";
// PatternFly
import { Flex, FlexItem, Radio } from "@patternfly/react-core";
// Utils
import {
  getParamProperties,
  IPAParamDefinition,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";

const IpaForwardPolicy = (props: IPAParamDefinition) => {
  const { readOnly, value } = getParamProperties(props);

  // States
  const [option, setOption] = React.useState<string>(value as string);

  // Handle radio button changes
  const handleRadioChange = (newValue: string) => {
    setOption(newValue);
    if (props.ipaObject && props.onChange) {
      updateIpaObject(props.ipaObject, props.onChange, newValue, props.name);
    }
  };

  React.useEffect(() => {
    handleRadioChange(value as string);
  }, [value]);

  return (
    <Flex>
      <FlexItem>
        <Radio
          data-cy="dns-zone-tab-settings-radio-forward-first"
          id={"forward-first"}
          key={"forward-first"}
          name={props.name}
          label={"Forward first"}
          value={"first"}
          readOnly={readOnly}
          onChange={() => handleRadioChange("first")}
          isChecked={option === "first"}
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="dns-zone-tab-settings-radio-forward-only"
          id={"forward-only"}
          key={"forward-only"}
          name={props.name}
          label={"Forward only"}
          value={"only"}
          readOnly={readOnly}
          onChange={() => handleRadioChange("only")}
          isChecked={option === "only"}
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="dns-zone-tab-settings-radio-forwarding-disabled"
          id={"forwarding-disabled"}
          key={"forwarding-disabled"}
          name={props.name}
          label={"Forwarding disabled"}
          value={"none"}
          readOnly={readOnly}
          onChange={() => handleRadioChange("none")}
          isChecked={option === "none"}
        />
      </FlexItem>
    </Flex>
  );
};

export default IpaForwardPolicy;
