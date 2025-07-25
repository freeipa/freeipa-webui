import React from "react";

// PatternFly
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
} from "@patternfly/react-core";

export type AlertVariant = "custom" | "danger" | "warning" | "success" | "info";

export interface AlertInfo {
  name: string;
  title: string | React.ReactNode;
  variant: AlertVariant;
}

export function useAlerts() {
  const [alerts, setAlerts] = React.useState<AlertInfo[]>([]);

  const removeAlertInternal = (name: string) => {
    return alerts.filter((alert) => alert.name !== name);
  };

  const addAlert = (
    name: string,
    title: string | React.ReactNode,
    variant: AlertVariant
  ) => {
    const alert: AlertInfo = {
      name: name,
      title: title,
      variant: variant,
    };
    const newAlerts = removeAlertInternal(name);
    newAlerts.push(alert);
    setAlerts(newAlerts);
  };

  const removeAlert = (name: string) => {
    const newAlerts = removeAlertInternal(name);
    setAlerts(newAlerts);
  };

  const toAlertElements = (): JSX.Element[] => {
    return alerts.map((alert) => (
      <Alert
        key={alert.name}
        data-cy={alert.name}
        variant={alert.variant}
        title={alert.title}
        role="alert"
        timeout
        isLiveRegion
        onTimeout={() => removeAlert(alert.name)}
        actionClose={
          <AlertActionCloseButton
            data-cy={"alert-button-close"}
            variantLabel={`${alert.variant} alert`}
            onClose={() => removeAlert(alert.name)}
          />
        }
      />
    ));
  };

  const removeAllAlerts = () => {
    setAlerts([]);
  };

  const ManagedAlerts = () => {
    return (
      <AlertGroup isToast isLiveRegion onOverflowClick={removeAllAlerts}>
        {toAlertElements()}
      </AlertGroup>
    );
  };

  return {
    addAlert,
    removeAlert,
    removeAllAlerts,
    ManagedAlerts,
  };
}

export default useAlerts;
