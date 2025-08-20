import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useHBACServiceSettings } from "src/hooks/useHBACServiceSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import { partialHBACServiceToHBACService } from "src/utils/hbacServicesUtils";
import HBACServicesSettings from "./HBACServicesSettings";
import HBACServicesMemberOf from "./HBACServicesMemberOf";

// eslint-disable-next-line react/prop-types
const HBACServicesTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useHBACServiceSettings(cn as string);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/hbac-services/" + cn);
    } else if (tabIndex === "memberof") {
      navigate("/hbac-services/" + cn + "/memberof_hbacsvcgroup");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/hbac-services");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "HBAC services",
          url: URL_PREFIX + "/hbac-services",
        },
        {
          name: cn,
          url: URL_PREFIX + "/hbac-services/" + cn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/hbac-services/" + cn);
    }
    const section_string = section as string;
    if (section_string === "settings") {
      setActiveTabKey("settings");
    } else if (section_string.startsWith("memberof")) {
      setActiveTabKey("memberof");
    }
  }, [section]);

  if (settingsData.isLoading || settingsData.service.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the netgroup is not found
  if (
    !settingsData.isLoading &&
    Object.keys(settingsData.service).length === 0
  ) {
    return <NotFound />;
  }

  const hbacSrv = partialHBACServiceToHBACService(settingsData.service);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={settingsData.service.cn}
          preText="HBAC service:"
          text={settingsData.service.cn}
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
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <HBACServicesSettings
              service={settingsData.service}
              originalService={settingsData.originalService}
              metadata={settingsData.metadata}
              onServiceChange={settingsData.setService}
              isDataLoading={settingsData.isFetching}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              onResetValues={settingsData.resetValues}
              modifiedValues={settingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={"memberof"}
            name="memberof-details"
            title={<TabTitleText>Is member of</TabTitleText>}
          >
            <HBACServicesMemberOf hbacService={hbacSrv} tabSection={section} />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default HBACServicesTabs;
