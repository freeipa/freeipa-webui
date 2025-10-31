import React from "react";
// PatternFly
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
} from "@patternfly/react-core";
// Alerts
import alertsStore, {
  AlertInfo,
  removeAlert,
  removeAllAlerts,
} from "src/store/alerts";

const ManagedAlerts = () => {
  const [alerts, setAlerts] = React.useState<AlertInfo[]>([]);

  alertsStore.subscribe(() => {
    setAlerts(alertsStore.getState());
  });

  const toAlertElements = (alerts: AlertInfo[]): JSX.Element[] => {
    return alerts.map((alert) => (
      <Alert
        key={alert.name}
        data-cy={alert.name}
        variant={alert.variant}
        title={alert.title}
        role="alert"
        timeout
        isLiveRegion
        onTimeout={() =>
          alertsStore.dispatch(removeAlert({ name: alert.name }))
        }
        actionClose={
          <AlertActionCloseButton
            data-cy={"alert-button-close"}
            variantLabel={`${alert.variant} alert`}
            onClose={() =>
              alertsStore.dispatch(removeAlert({ name: alert.name }))
            }
          />
        }
      />
    ));
  };

  return (
    <AlertGroup
      isToast
      isLiveRegion
      onOverflowClick={() => alertsStore.dispatch(removeAllAlerts())}
    >
      {toAlertElements(alerts)}
    </AlertGroup>
  );
};

export default ManagedAlerts;
