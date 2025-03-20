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
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useSudoCmdGroupsSettings } from "src/hooks/useSudoCmdGroupsSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import SudoCmdGroupsSettings from "./SudoCmdGroupsSettings";
import { partialSudoCmdGroupToSudoCmdGroup } from "src/utils/sudoCmdGroupsUtils";
import SudoCmdGroupMembers from "./SudoCmdGroupsMembers";

// eslint-disable-next-line react/prop-types
const SudoCmdGroupsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useSudoCmdGroupsSettings(cn as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/sudo-command-groups/" + cn);
    } else if (tabIndex === "member") {
      navigate("/sudo-command-groups/" + cn + "/member_sudocmd");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/sudo-command-groups");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Sudo command groups",
          url: URL_PREFIX + "/sudo-command-groups",
        },
        {
          name: cn,
          url: URL_PREFIX + "/sudo-command-groups/" + cn,
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
      navigate(URL_PREFIX + "/sudo-command-groups/" + cn);
    }
    const section_string = section as string;
    if (section_string.startsWith("member_")) {
      setActiveTabKey("member");
    }
  }, [section]);

  if (settingsData.isLoading || settingsData.group.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the data is not found
  if (!settingsData.isLoading && Object.keys(settingsData.group).length === 0) {
    return <NotFound />;
  }

  const cmdGroup = partialSudoCmdGroupToSudoCmdGroup(settingsData.group);

  return (
    <>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={settingsData.group.cn}
          text={settingsData.group.cn}
          headingLevel="h1"
          preText="Sudo command group:"
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
            <SudoCmdGroupsSettings
              group={settingsData.group}
              originalGroup={settingsData.originalGroup}
              metadata={settingsData.metadata}
              onChange={settingsData.setGroup}
              isDataLoading={settingsData.isFetching}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              onResetValues={settingsData.resetValues}
              modifiedValues={settingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={"member"}
            name={"member-details"}
            title={<TabTitleText>Members</TabTitleText>}
          >
            <SudoCmdGroupMembers sudocmdgroup={cmdGroup} tabSection={section} />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default SudoCmdGroupsTabs;
