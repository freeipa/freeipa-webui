import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useSelinuxUserMapSettings } from "src/hooks/useSelinuxUserMapSettingsData";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import SELinuxUserMapsSettings from "./SELinuxUserMapsSettings";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

// eslint-disable-next-line react/prop-types
const SELinuxUserMapsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settingsData = useSelinuxUserMapSettings(cn);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const handleTabClick = () => {
    navigate("/selinux-user-maps/" + cn);
  };

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "SELinux user maps",
        url: "/selinux-user-maps",
      },
      {
        name: cn,
        url: "/selinux-user-maps/" + cn,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    dispatch(updateBreadCrumbPath(currentPath));
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate("/selinux-user-maps/" + cn);
    }
  }, [section]);

  if (settingsData.isLoading || settingsData.rule.cn === undefined) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the rule is not found
  if (!settingsData.isLoading && Object.keys(settingsData.rule).length === 0) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={settingsData.rule.cn}
          preText="SELinux user map:"
          text={settingsData.rule.cn}
          headingLevel="h1"
          disabled={settingsData.rule.ipaenabledflag?.toString() !== "true"}
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={section}
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
            <SELinuxUserMapsSettings
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
    </>
  );
};

export default SELinuxUserMapsTabs;
