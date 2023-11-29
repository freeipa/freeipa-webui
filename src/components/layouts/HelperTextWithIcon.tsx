import React from "react";
// PatternFly
import { HelperText, HelperTextItem } from "@patternfly/react-core";
// Icons
import {
  InfoIcon,
  QuestionIcon,
  ExclamationIcon,
  CheckIcon,
  TimesIcon,
} from "@patternfly/react-icons";

type IconType = "info" | "question" | "warning" | "success" | "error";

interface PropsToHelperTextWithIcon {
  message: string | React.ReactNode;
  type?: IconType;
}

const getIcon = (type?: IconType) => {
  switch (type) {
    case "info":
      return <InfoIcon />;
    case "question":
      return <QuestionIcon />;
    case "warning":
      return <ExclamationIcon />;
    case "success":
      return <CheckIcon />;
    case "error":
      return <TimesIcon />;
    default:
      return <InfoIcon />;
  }
};

const HelperTextWithIcon = (props: PropsToHelperTextWithIcon) => {
  return (
    <HelperText>
      {!props.type ? (
        <HelperTextItem>{props.message}</HelperTextItem>
      ) : (
        <HelperTextItem icon={getIcon(props.type)}>
          {props.message}
        </HelperTextItem>
      )}
    </HelperText>
  );
};

export default HelperTextWithIcon;
