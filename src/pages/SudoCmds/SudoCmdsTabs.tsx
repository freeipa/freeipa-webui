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
import { useHBACServiceSettings } from "src/hooks/useHBACServiceSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";

// eslint-disable-next-line react/prop-types
const SudoCmdsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useHBACServiceSettings(cn as string);

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
    navigate("/sudo-commands/" + cn);
  };

  React.useEffect(() => {
    if (!cn) {
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
          name: cn,
          url: URL_PREFIX + "/sudo-commands/" + cn,
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
      navigate(URL_PREFIX + "/sudo-commands/" + cn);
    }
    setActiveTabKey(section);
  }, [section]);

  if (settingsData.isLoading || settingsData.service.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the data is not found
  if (
    !settingsData.isLoading &&
    Object.keys(settingsData.service).length === 0
  ) {
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
          id={settingsData.service.cn}
          text={settingsData.service.cn}
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
          ></Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default SudoCmdsTabs;
