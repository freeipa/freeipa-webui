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
import { useHBACServiceGroupSettings } from "src/hooks/useHBACServiceGrpSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import HBACServiceGroupsSettings from "./HBACServiceGroupsSettings";
import HBACSvcGroupMembers from "./HBACServiceGroupsMembers";
// Utils
import { partialHBACSvcGrpToHBACSvcGrp } from "src/utils/hbacServiceGrpUtils";

// eslint-disable-next-line react/prop-types
const HBACServiceGroupsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useHBACServiceGroupSettings(cn as string);
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
      navigate("/hbac-service-groups/" + cn);
    } else if (tabIndex === "members") {
      navigate("/hbac-service-groups/" + cn + "/member_hbacsvc");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/hbac-service-groups");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "HBAC service groups",
          url: URL_PREFIX + "/hbac-service-groups",
        },
        {
          name: cn,
          url: URL_PREFIX + "/hbac-service-groups/" + cn,
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
      navigate(URL_PREFIX + "/hbac-service-groups/" + cn);
    }
    const section_string = section as string;
    if (section_string === "settings") {
      setActiveTabKey("settings");
    } else if (section_string.startsWith("member_")) {
      setActiveTabKey("members");
    }
  }, [section]);

  if (settingsData.isLoading || settingsData.svcGroup.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the netgroup is not found
  if (
    !settingsData.isLoading &&
    Object.keys(settingsData.svcGroup).length === 0
  ) {
    return <NotFound />;
  }

  const hbacSrvGroup = partialHBACSvcGrpToHBACSvcGrp(settingsData.svcGroup);

  return (
    <>
      <PageSection hasBodyWrapper={false} className="pf-v6-u-pr-0">
        <BreadCrumb
          className="pf-v6-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={settingsData.svcGroup.cn}
          preText="HBAC service group:"
          text={settingsData.svcGroup.cn}
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
            <HBACServiceGroupsSettings
              svcGroup={settingsData.svcGroup}
              originalSvcGrp={settingsData.originalSvcGrp}
              metadata={settingsData.metadata}
              onSvcGrpChange={settingsData.setSvcGroup}
              isDataLoading={settingsData.isFetching}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              onResetValues={settingsData.resetValues}
              modifiedValues={settingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={"members"}
            name="members-details"
            title={<TabTitleText>Members</TabTitleText>}
          >
            <HBACSvcGroupMembers
              hbacsvcgroup={hbacSrvGroup}
              tabSection={section}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default HBACServiceGroupsTabs;
