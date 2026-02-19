import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useIdRangesSettingsData } from "src/hooks/useIdRangesSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import IdRangesSettings from "src/pages/IdRanges/IdRangesSettings";
import { CnParams, useSafeParams } from "src/utils/paramsUtils";

const IdRangesTabs = ({ section }: { section: string }) => {
  const { cn } = useSafeParams<CnParams>(["cn"]);
  const navigate = useNavigate();
  const pathname = "id-ranges";

  // Data loaded from the API
  const idRangesSettingsData = useIdRangesSettingsData(cn);

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
      name: "ID ranges",
      url: `${URL_PREFIX}/${pathname}`,
    },
    {
      name: cn,
      url: `${URL_PREFIX}/${pathname}/${cn}`,
      isActive: true,
    },
  ];

  if (idRangesSettingsData.isLoading || !idRangesSettingsData.idRange) {
    return <DataSpinner />;
  }

  if (
    !idRangesSettingsData.isLoading &&
    Object.keys(idRangesSettingsData.idRange).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout id={cn} preText="ID range:" text={cn} headingLevel="h1" />
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
            data-cy="id-ranges-tab-settings"
          >
            <IdRangesSettings
              idRange={idRangesSettingsData.idRange}
              metadata={idRangesSettingsData.metadata}
              onRefresh={idRangesSettingsData.refetch}
              onIdRangeChange={idRangesSettingsData.setIdRange}
              isDataLoading={idRangesSettingsData.isLoading}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default IdRangesTabs;
