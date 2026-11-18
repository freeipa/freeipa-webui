import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Navigation
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useTopologySuffixSettingsData } from "src/hooks/useTopologySuffixSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TopologySuffixesSettings from "src/pages/Topology/TopologySuffixesSettings";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

const TopologySuffixesTabs = ({ section }: { section: string }) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const pathname = "topology-suffixes";

  // Data loaded from the API
  const topologySuffixSettingsData = useTopologySuffixSettingsData(cn);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + cn);
    }
  };

  const breadcrumbItems: BreadCrumbItem[] = [
    {
      name: "Topology suffixes",
      url: `/${pathname}`,
    },
    {
      name: cn,
      url: `/${pathname}/${cn}`,
      isActive: true,
    },
  ];

  if (topologySuffixSettingsData.isLoading) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the topology suffix is not found
  if (Object.keys(topologySuffixSettingsData.topologySuffix).length === 0) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={cn}
          preText="Topology suffix:"
          text={cn}
          headingLevel="h1"
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
            data-cy="topology-suffixes-tab-settings"
          >
            <TopologySuffixesSettings
              topologySuffix={topologySuffixSettingsData.topologySuffix}
              metadata={topologySuffixSettingsData.metadata}
              onRefresh={topologySuffixSettingsData.refetch}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default TopologySuffixesTabs;
