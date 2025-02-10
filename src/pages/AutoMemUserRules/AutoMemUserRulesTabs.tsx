import React from "react";
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
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
// Layouts
import DataSpinner from "src/components/layouts/DataSpinner";
// Icons
import LockIcon from "@patternfly/react-icons/dist/esm/icons/lock-icon";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";

import AutoMemSettings from "./AutoMemSettings";
import { useAutomemberSettingsData } from "src/hooks/useAutomemberSettingsData";

interface AutoMemUserRulesTabsProps {
  section: string;
  automemberType: string;
}

const AutoMemUserRulesTabs = (props: AutoMemUserRulesTabsProps) => {
  const { section, automemberType } = props;
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Generate strings from section name
  const sectionName =
    props.automemberType === "group" ? "User group rule" : "Host group rule";
  const pathname =
    props.automemberType === "group" ? "user-group-rules" : "host-group-rules";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Tab
  const [activeTabKey, setActiveTabKey] = React.useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/" + pathname + "/" + cn);
  };

  const settingsData = useAutomemberSettingsData(cn as string, automemberType);

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the User group rule page
      navigate("/" + pathname);
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "User group rule",
          url: URL_PREFIX + "/user-group-rules",
        },
        {
          name: cn,
          url: URL_PREFIX + "/user-group-rules/" + cn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // If the section is not defined, redirect to the User group rule page
  React.useEffect(() => {
    if (!section) {
      navigate("/user-group-rules/" + cn);
    }
  }, [section]);

  if (settingsData.isLoading || settingsData.automember === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the netgroup is not found
  if (
    !settingsData.isLoading &&
    Object.keys(settingsData.automember).length === 0
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
          id={cn as string}
          preText="User group rule:"
          text={cn as string}
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
            <AutoMemSettings
              automemberRule={settingsData.automember}
              originalAutomemberRule={settingsData.automember}
              automemberType={automemberType}
              metadata={settingsData.metadata}
              onAutomemberChange={settingsData.setAutomember}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              modifiedValues={settingsData.modifiedValues}
              onResetValues={settingsData.resetValues}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default AutoMemUserRulesTabs;
