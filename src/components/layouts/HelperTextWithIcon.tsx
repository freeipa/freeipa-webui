import React from "react";
// PatternFly
import { HelperText, HelperTextItem } from "@patternfly/react-core";
// Icons
import InfoIcon from "@patternfly/react-icons/dist/esm/icons/info-icon";
import QuestionIcon from "@patternfly/react-icons/dist/esm/icons/question-icon";
import ExclamationIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-icon";
import CheckIcon from "@patternfly/react-icons/dist/esm/icons/check-icon";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";

interface PropsToHelperTextWithIcon {
  message: string | React.ReactNode;
  useDefaultIcons?: boolean | true;
  type: "info" | "question" | "warning" | "success" | "error";
}

/*
 * Helper text component documentation:
 * http://v4-archive.patternfly.org/v4/components/helper-text
 */

const HelperTextWithIcon = (props: PropsToHelperTextWithIcon) => {
  const [icon, setIcon] = React.useState(<InfoIcon />);

  React.useEffect(() => {
    switch (props.type) {
      case "info":
        setIcon(<InfoIcon />);
        break;
      case "question":
        setIcon(<QuestionIcon />);
        break;
      case "warning":
        setIcon(<ExclamationIcon />);
        break;
      case "success":
        setIcon(<CheckIcon />);
        break;
      case "error":
        setIcon(<TimesIcon />);
        break;
      default:
        setIcon(<InfoIcon />);
        break;
    }
  }, [props.type]);

  return (
    <HelperText>
      {props.useDefaultIcons ? (
        <HelperTextItem>{props.message}</HelperTextItem>
      ) : (
        <HelperTextItem icon={icon}>{props.message}</HelperTextItem>
      )}
    </HelperText>
  );
};

export default HelperTextWithIcon;
