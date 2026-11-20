import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import ServicesSettings from "./ServicesSettings";
import ServicesMemberOf from "./ServicesMemberOf";
import ServicesManagedBy from "./ServicesManagedBy";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import { partialServiceToService } from "src/utils/serviceUtils";

// Hooks
import { useServiceSettings } from "src/hooks/useServiceSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import {
  closeHelpPanel,
  setHelpTopic,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import DataSpinner from "src/components/layouts/DataSpinner";
// Navigation
import { NotFound } from "src/components/errors/PageErrors";
import { useSafeParams } from "src/utils/paramsUtils";
import { encodeRouteId } from "src/utils/routeUtils";

type ServicesParams = {
  id: string;
};

// eslint-disable-next-line react/prop-types
const ServicesTabs = ({ section }) => {
  const { id } = useSafeParams<ServicesParams>(["id"]);

  // useSafeParams returns the original id
  const serviceId = id;
  const encodedId = encodeRouteId(serviceId);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("services-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // - Close links panel when tab section is changed
  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  // Data loaded from DB
  const serviceSettingsData = useServiceSettings(serviceId as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState("settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/services/" + encodedId);
    } else if (tabIndex === "memberof") {
      navigate("/services/" + encodedId + "/memberof_role");
    } else if (tabIndex === "managedby") {
      navigate("/services/" + encodedId + "/managedby_host");
    }
  };

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Services",
        url: "/services",
      },
      {
        name: serviceId,
        url: "/services/" + encodedId,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [serviceId]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate("/services/" + encodedId);
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
  const certificates = serviceSettingsData.certData;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={service.krbcanonicalname}
          preText="Service:"
          text={service.krbcanonicalname}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="secondary"
          isBox
          className="pf-v6-u-ml-lg"
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
              changeFromPage={(page) => dispatch(setHelpTopic(page))}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
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
