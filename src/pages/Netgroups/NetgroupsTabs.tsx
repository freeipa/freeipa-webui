import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import { partialNetgroupToNetgroup } from "src/utils/netgroupsUtils";
// Hooks
import { useNetgroupSettings } from "src/hooks/useNetgroupSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import NetgroupsMembers from "./NetgroupsMembers";
import NetgroupsSettings from "./NetgroupsSettings";
import NetgroupsMemberOf from "./NetgroupsMemberOf";

// eslint-disable-next-line react/prop-types
const NetgroupsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const netgroupSettingsData = useNetgroupSettings(cn as string);
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
      navigate("/netgroups/" + cn);
    } else if (tabIndex === "member") {
      navigate("/netgroups/" + cn + "/member_user");
    } else if (tabIndex === "memberof") {
      navigate("/netgroups/" + cn + "/memberof_netgroup");
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
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/netgroups/" + cn);
    }
    const section_string = section as string;
    if (section_string === "settings") {
      setActiveTabKey("settings");
    } else if (section_string.startsWith("memberof_")) {
      setActiveTabKey("memberof");
    } else if (section_string.startsWith("member_")) {
      setActiveTabKey("member");
    }
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

  const netgroup = partialNetgroupToNetgroup(netgroupSettingsData.netgroup);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={netgroupSettingsData.netgroup.cn}
          preText="Netgroup:"
          text={netgroupSettingsData.netgroup.cn}
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
            data-cy="netgroups-tab-settings"
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
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
            data-cy={"netgroups-tab-member"}
            eventKey={"member"}
            name={"members-details"}
            title={<TabTitleText>Members</TabTitleText>}
          >
            <NetgroupsMembers netgroup={netgroup} tabSection={section} />
          </Tab>
          <Tab
            data-cy="netgroups-tab-memberof"
            eventKey={"memberof"}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <NetgroupsMemberOf
              netgroup={netgroup}
              tabSection={section as string}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default NetgroupsTabs;
