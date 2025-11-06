import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useTrustsSettingsData } from "src/hooks/useTrustsSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TrustsSettings from "src/pages/Trusts/TrustsSettings";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

const TrustsTabs = ({ section }: { section: string }) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const pathname = "trusts";

  // Data loaded from the API
  const trustsSettingsData = useTrustsSettingsData(cn);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + cn);
    } else if (tabIndex === "trusted-domains") {
      navigate("/" + pathname + "/" + cn + "/trusted-domains");
    }
  };

  const breadcrumbItems: BreadCrumbItem[] = React.useMemo(
    () => [
      {
        name: "Trusts",
        url: URL_PREFIX + "/" + pathname,
      },
    ],
    [pathname]
  );

  // Handling of the API data
  if (trustsSettingsData.isLoading || !trustsSettingsData.trust) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the trust is not found
  if (
    !trustsSettingsData.isLoading &&
    (!trustsSettingsData.trust || trustsSettingsData.trust.cn === "")
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
      </PageSection>
      <PageSection hasBodyWrapper={true}>
        <TitleLayout id={cn} preText="Trust:" text={cn} headingLevel="h1" />
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
            eventKey="settings"
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
            data-cy="trusts-tab-settings"
          >
            <TrustsSettings
              trust={trustsSettingsData.trust}
              originalTrust={trustsSettingsData.originalTrust}
              metadata={trustsSettingsData.metadata}
              onTrustChange={trustsSettingsData.setTrust}
              onRefresh={trustsSettingsData.refetch}
              isModified={trustsSettingsData.modified}
              isDataLoading={trustsSettingsData.isLoading}
              modifiedValues={trustsSettingsData.modifiedValues}
              onResetValues={trustsSettingsData.resetValues}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default TrustsTabs;
