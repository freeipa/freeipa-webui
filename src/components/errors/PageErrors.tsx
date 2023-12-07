import React from "react";
import { Icon, Title } from "@patternfly/react-core";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";

const ErrorPage = (text: string) => {
  return (
    <>
      <div style={{ alignSelf: "center" }}>
        <Icon status="warning" size="xl" className="pf-u-mt-4xl">
          <ExclamationTriangleIcon size="lg" />
        </Icon>
      </div>
      <div style={{ alignSelf: "center" }}>
        <Title headingLevel="h1" className="pf-u-mt-lg">
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
