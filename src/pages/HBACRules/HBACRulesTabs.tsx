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
import { useHBACRuleSettings } from "src/hooks/useHBACRuleSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import HBACRulesSettings from "./HBACRulesSettings";

// eslint-disable-next-line react/prop-types
const NetgroupsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useHBACRuleSettings(cn as string);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    navigate("/netgroups/" + cn);
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/hbac-rules");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "HBAC rules",
          url: URL_PREFIX + "/hbac-rules",
        },
        {
          name: cn,
          url: URL_PREFIX + "/hbac-rules/" + cn,
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
      navigate(URL_PREFIX + "/hbac-rules/" + cn);
    }
    setActiveTabKey(section);
  }, [section]);

  if (settingsData.isLoading || settingsData.rule.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the netgroup is not found
  if (!settingsData.isLoading && Object.keys(settingsData.rule).length === 0) {
    return <NotFound />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={settingsData.rule.cn}
          preText="HBAC rule:"
          text={settingsData.rule.cn}
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
            <HBACRulesSettings
              rule={settingsData.rule}
              originalRule={settingsData.originalRule}
              metadata={settingsData.metadata}
              onRuleChange={settingsData.setRule}
              isDataLoading={settingsData.isFetching}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              onResetValues={settingsData.resetValues}
              modifiedValues={settingsData.modifiedValues}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default NetgroupsTabs;
