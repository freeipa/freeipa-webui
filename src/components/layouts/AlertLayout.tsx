import React from "react";
// PatternFly
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";

interface PropsToAlert {
  key: string | number;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  title: React.ReactNode;
  onCloseHandler: () => void;
}

const AlertLayout = (props: PropsToAlert) => {
  return (
    <Alert
      key={props.key}
      variant={props.variant}
      title={props.title}
      timeout
      isLiveRegion
      actionClose={
        <AlertActionCloseButton
          variantLabel={`${props.variant} alert`}
          onClose={props.onCloseHandler}
        />
      }
    />
  );
};

export default AlertLayout;
