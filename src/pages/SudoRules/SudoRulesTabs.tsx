import React, { useState } from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useSudoRuleSettings } from "src/hooks/useSudoRuleSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import SudoRulesSettings from "./SudoRulesSettings";
import { partialSudoRuleToSudoRule } from "src/utils/sudoRulesUtils";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

// eslint-disable-next-line react/prop-types
const SudoRulesTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useSudoRuleSettings(cn);

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
    // Just one section: 'Settings'
    navigate("/sudo-rules/" + cn);
  };

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Sudo rules",
        url: URL_PREFIX + "/sudo-rules",
      },
      {
        name: cn,
        url: URL_PREFIX + "/sudo-rules/" + cn,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/sudo-rules/" + cn);
    }
    setActiveTabKey(section);
  }, [section]);

  if (settingsData.isLoading || settingsData.rule.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the data is not found
  if (!settingsData.isLoading && Object.keys(settingsData.rule).length === 0) {
    return <NotFound />;
  }

  const rule = partialSudoRuleToSudoRule(settingsData.rule);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={rule.cn}
          text={rule.cn}
          headingLevel="h1"
          preText="Sudo rule:"
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
            <SudoRulesSettings
              rule={settingsData.rule}
              originalRule={settingsData.originalRule}
              metadata={settingsData.metadata}
              onRuleChange={settingsData.setRule}
              onRefresh={settingsData.refetch}
              isModified={settingsData.modified}
              isDataLoading={settingsData.isFetching}
              modifiedValues={settingsData.modifiedValues}
              onResetValues={settingsData.resetValues}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default SudoRulesTabs;
