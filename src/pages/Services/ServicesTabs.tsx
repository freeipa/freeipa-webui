import React, { useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useLocation } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Other
import ServicesSettings from "./ServicesSettings";
import ServicesMemberOf from "./ServicesMemberOf";
import ServicesManagedBy from "./ServicesManagedBy";
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Utils
import { API_VERSION_BACKUP } from "../../utils/utils";
// Hooks
import { useAlerts } from "../../hooks/useAlerts";
// RPC client
import { useSearchEntriesMutation, GenericPayload } from "../../services/rpc";

const ServicesTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  let serviceData: Service = location.state as Service;

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  // 'pagesVisited' array will contain the visited pages.
  // - Those will be passed to the 'BreadcrumbLayout' component.
  const pagesVisited = [
    {
      name: "Services",
      url: URL_PREFIX + "/services",
    },
  ];

  // Handle refresh of a service
  const [retrieveService] = useSearchEntriesMutation({});
  const onRefresh = () => {
    retrieveService({
      searchValue: serviceData.krbcanonicalname,
      sizeLimit: 0,
      apiVersion: API_VERSION_BACKUP,
      startIdx: 0,
      stopIdx: 1,
      entryType: "service",
    } as GenericPayload).then((result) => {
      // Manage new response here
      if ("data" in result) {
        const searchError = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          alerts.addAlert(
            "refresh service",
            error || "Error when searching for services",
            "danger"
          );
        } else {
          // Success
          const serviceListResult = result.data.result.results;
          serviceData = serviceListResult[0];
        }
      }
    });
  };

  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadcrumbLayout
          className="pf-v5-u-mb-md"
          preText=""
          userId={serviceData.krbcanonicalname}
          pagesVisited={pagesVisited}
        />
        <TitleLayout
          id={serviceData.krbcanonicalname}
          text={serviceData.krbcanonicalname}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="light300"
          isBox
          className="pf-v5-u-ml-lg"
        >
          <Tab
            eventKey={0}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <ServicesSettings service={serviceData} onRefresh={onRefresh} />
          </Tab>
          <Tab
            eventKey={1}
            name="details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <ServicesMemberOf service={serviceData} />
          </Tab>
          <Tab
            eventKey={2}
            name="details"
            title={<TabTitleText>Is managed by</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <ServicesManagedBy service={serviceData} />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default ServicesTabs;
