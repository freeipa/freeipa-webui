import React, { useState } from "react";
// PatternFly
import {
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Components
import ServicesSettings from "./ServicesSettings";
import ServicesMemberOf from "./ServicesMemberOf";
import ServicesManagedBy from "./ServicesManagedBy";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import { partialServiceToService } from "src/utils/serviceUtils";
// Hooks
import { useAlerts } from "../../hooks/useAlerts";
// Hooks
import { useServiceSettings } from "src/hooks/useServiceSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import DataSpinner from "src/components/layouts/DataSpinner";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";

// eslint-disable-next-line react/prop-types
const ServicesTabs = ({ section }) => {
  const { id } = useParams();

  // As the id is sent by React Router DOM partially decoded, this should be fixed
  const decodedId = decodeURIComponent(id as string); // original ID
  const doubleEncodedId = encodeURIComponent(encodeURIComponent(decodedId)); // double encoded ID

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Data loaded from DB
  const serviceSettingsData = useServiceSettings(decodedId as string);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/services/" + doubleEncodedId);
    } else if (tabIndex === "memberof") {
      navigate("/services/" + doubleEncodedId + "/memberof_role");
    } else if (tabIndex === "managedby") {
      navigate("/services/" + doubleEncodedId + "/managedby_host");
    }
  };

  React.useEffect(() => {
    if (!id) {
      // Redirect to the main page
      navigate("/services");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Services",
          url: URL_PREFIX + "/services",
        },
        {
          name: decodedId,
          url: URL_PREFIX + "/services/" + doubleEncodedId,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [id]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/services/" + doubleEncodedId);
    }
    setActiveTabKey(section);
  }, [section]);

  if (serviceSettingsData.isLoading || !serviceSettingsData.service) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the service is not found
  if (
    !serviceSettingsData.isLoading &&
    Object.keys(serviceSettingsData.service).length === 0
  ) {
    return <NotFound />;
  }

  const service = partialServiceToService(serviceSettingsData.service);
  const certificates = serviceSettingsData.certData || {};

  return (
    <>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={service.krbcanonicalname}
          preText="Service:"
          text={service.krbcanonicalname}
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
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <ServicesSettings
              service={service}
              originalService={serviceSettingsData.originalService}
              metadata={serviceSettingsData.metadata}
              onServiceChange={serviceSettingsData.setService}
              isDataLoading={serviceSettingsData.isLoading}
              onRefresh={serviceSettingsData.refetch}
              isModified={serviceSettingsData.modified}
              onResetValues={serviceSettingsData.resetValues}
              modifiedValues={serviceSettingsData.modifiedValues}
              certData={certificates}
            />
          </Tab>
          <Tab
            eventKey={"memberof"}
            name="details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <ServicesMemberOf service={service} tabSection={section} />
          </Tab>
          <Tab
            eventKey={"managedby"}
            name="details"
            title={<TabTitleText>Is managed by</TabTitleText>}
          >
            <ServicesManagedBy service={service} />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default ServicesTabs;
