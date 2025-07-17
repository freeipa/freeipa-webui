import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";

interface PropsToHelpTextLayout {
  textContent: string;
  icon?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const HelpTextWithIconLayout = (props: PropsToHelpTextLayout) => {
  return (
    <Button
      data-cy="help-text-with-icon-button"
      variant="link"
      icon={props.icon || <OutlinedQuestionCircleIcon />}
      onClick={props.onClick}
    >
      {props.textContent}
    </Button>
  );
};

export default HelpTextWithIconLayout;
