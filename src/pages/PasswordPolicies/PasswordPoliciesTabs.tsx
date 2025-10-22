import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { usePasswordPolicySettings } from "src/hooks/usePwPolicySettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import PasswordPoliciesSettings from "./PasswordPoliciesSettings";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

// eslint-disable-next-line react/prop-types
const PasswordPoliciesTabs = ({ section }) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const pathname = "password-policies";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // States - Identifier of the entity (Password policy -> cn)
  const [id, setId] = React.useState("");

  // Data loaded from the API
  const pwPolicySettingsData = usePasswordPolicySettings(cn);

  // Tab
  const [activeTabKey, setActiveTabKey] = React.useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);

    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + id);
    }
  };

  React.useEffect(() => {
    setId(cn);
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Password policies",
        url: URL_PREFIX + "/" + pathname,
      },
      {
        name: cn,
        url: URL_PREFIX + "/" + pathname + "/" + cn,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
  }, [cn]);

  // Handling of the API data
  if (pwPolicySettingsData.isLoading || !pwPolicySettingsData.pwPolicy) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !pwPolicySettingsData.isLoading &&
    Object.keys(pwPolicySettingsData.pwPolicy).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={id}
          preText="Password policies:"
          text={id}
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
            <PasswordPoliciesSettings
              pwPolicy={pwPolicySettingsData.pwPolicy}
              originalPwPolicy={pwPolicySettingsData.originalPwPolicy}
              metadata={pwPolicySettingsData.metadata}
              onPwPolicyChange={pwPolicySettingsData.setPwPolicy}
              onRefresh={pwPolicySettingsData.refetch}
              isModified={pwPolicySettingsData.modified}
              isDataLoading={pwPolicySettingsData.isLoading}
              modifiedValues={pwPolicySettingsData.modifiedValues}
              onResetValues={pwPolicySettingsData.resetValues}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default PasswordPoliciesTabs;
