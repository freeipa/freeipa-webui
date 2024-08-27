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
import { useSudoCmdsSettings } from "src/hooks/useSudoCmdsSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import SudoCmdsSettings from "./SudoCmdsSettings";

// eslint-disable-next-line react/prop-types
const SudoCmdsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { sudocmd } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useSudoCmdsSettings(sudocmd as string);

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
    navigate("/sudo-commands/" + sudocmd);
  };

  React.useEffect(() => {
    if (!sudocmd) {
      // Redirect to the main page
      navigate("/sudo-commands");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Sudo commands",
          url: URL_PREFIX + "/sudo-commands",
        },
        {
          name: sudocmd,
          url: URL_PREFIX + "/sudo-commands/" + sudocmd,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [sudocmd]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/sudo-commands/" + sudocmd);
    }
    setActiveTabKey(section);
  }, [section]);

  if (settingsData.isLoading || settingsData.cmd.sudocmd === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the data is not found
  if (!settingsData.isLoading && Object.keys(settingsData.cmd).length === 0) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={settingsData.cmd.sudocmd}
          text={settingsData.cmd.sudocmd}
          headingLevel="h1"
          preText="Sudo command"
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
            <SudoCmdsSettings
              cmd={settingsData.cmd}
              originalCmd={settingsData.originalCmd}
              metadata={settingsData.metadata}
              onChange={settingsData.setCmd}
              isDataLoading={settingsData.isFetching}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              onResetValues={settingsData.resetValues}
              modifiedValues={settingsData.modifiedValues}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default SudoCmdsTabs;
