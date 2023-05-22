import React from "react";
// PatternFly
import { AlertGroup } from "@patternfly/react-core";

interface PropsToAlertGroup {
  alerts: JSX.Element[];
  setAlerts: (newAlertsList: JSX.Element[]) => void;
}

const AlertGroupLayout = (props: PropsToAlertGroup) => {
  // Remove all alerts
  const removeAllAlerts = () => {
    props.setAlerts([]);
  };

  return (
    <>
      {props.alerts !== undefined && (
        <AlertGroup isToast isLiveRegion onOverflowClick={removeAllAlerts}>
          {props.alerts}
        </AlertGroup>
      )}
    </>
  );
};

export default AlertGroupLayout;
