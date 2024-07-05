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
import { useNavigate, useParams } from "react-router-dom";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useNetgroupSettings } from "src/hooks/useNetgroupSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import NetgroupsSettings from "./NetgroupsSettings";

// eslint-disable-next-line react/prop-types
const NetgroupsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const netgroupSettingsData = useNetgroupSettings(cn as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/netgroups/" + cn);
    } else if (tabIndex === "memberof") {
      navigate("/netgroups/" + cn + "/memberof_netgroup");
    } else if (tabIndex === "managedby") {
      navigate("/netgroups/" + cn + "/managedby_netgroup");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/netgroups");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Netgroups",
          url: URL_PREFIX + "/netgroups",
        },
        {
          name: cn,
          url: URL_PREFIX + "/netgroups/" + cn,
          isActive: true,
        },
      ];
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/netgroups/" + cn);
    }
    setActiveTabKey(section);
  }, [section]);

  if (
    netgroupSettingsData.isLoading ||
    netgroupSettingsData.netgroup.cn === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the netgroup is not found
  if (
    !netgroupSettingsData.isLoading &&
    Object.keys(netgroupSettingsData.netgroup).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb className="pf-v5-u-mb-md" />
        <TitleLayout
          id={netgroupSettingsData.netgroup.cn}
          text={netgroupSettingsData.netgroup.cn}
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
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <NetgroupsSettings
              netgroup={netgroupSettingsData.netgroup}
              originalGroup={netgroupSettingsData.originalGroup}
              metadata={netgroupSettingsData.metadata}
              onGroupChange={netgroupSettingsData.setNetgroup}
              isDataLoading={netgroupSettingsData.isFetching}
              onRefresh={netgroupSettingsData.refetch}
              isModified={netgroupSettingsData.modified}
              onResetValues={netgroupSettingsData.resetValues}
              modifiedValues={netgroupSettingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={"members"}
            name="member-details"
            title={<TabTitleText>Members</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
          <Tab
            eventKey={"memberof"}
            name="menerof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default NetgroupsTabs;
