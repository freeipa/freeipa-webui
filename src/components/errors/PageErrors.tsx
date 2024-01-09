import React from "react";
import { Icon, Title } from "@patternfly/react-core";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";

const ErrorPage = (text: string) => {
  return (
    <>
      <div style={{ alignSelf: "center" }}>
        <Icon status="warning" size="xl" className="pf-v5-u-mt-4xl">
          <ExclamationTriangleIcon />
        </Icon>
      </div>
      <div style={{ alignSelf: "center" }}>
        <Title headingLevel="h1" className="pf-v5-u-mt-lg">
          {text}
        </Title>
      </div>
    </>
  );
};

export const EmptyPage = () => {
  return ErrorPage("This page is under construction");
};

export const NotFound = () => {
  return ErrorPage("404: Page not found");
};
