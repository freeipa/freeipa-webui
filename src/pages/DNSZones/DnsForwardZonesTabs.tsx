import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useDnsForwardZonesData } from "src/hooks/useDnsForwardZonesData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import DnsForwardZonesSettings from "./DnsForwardZonesSettings";
// React Router DOM
import { useSafeParams } from "src/utils/paramsUtils";

type DnsParams = {
  idnsname: string;
};

const DnsForwardZonesTabs = ({ section }: { section: string }) => {
  const { idnsname } = useSafeParams<DnsParams>(["idnsname"]);

  // Data loaded from the API
  const {
    isLoading,
    modified,
    metadata,
    resetValues,
    originalDnsForwardZone,
    setDnsForwardZone,
    refetch,
    dnsForwardZone,
    modifiedValues,
  } = useDnsForwardZonesData(idnsname);

  const pathname = "dns-forward-zones";
  const breadcrumbItems: BreadCrumbItem[] = [
    {
      name: "DNS forward zones",
      url: URL_PREFIX + "/" + pathname,
    },
    {
      name: idnsname,
      url: URL_PREFIX + "/" + pathname + "/" + idnsname,
      isActive: true,
    },
  ];

  // Handling of the API data
  if (isLoading) {
    return <DataSpinner />;
  }

  if (!isLoading && dnsForwardZone.idnsname === "") {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={idnsname}
          preText="DNS forward zone:"
          text={idnsname}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={section}
          isBox
          className="pf-v6-u-ml-lg"
          variant="secondary"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
            data-cy="dns-zones-tab-settings"
          >
            <DnsForwardZonesSettings
              dnsForwardZone={dnsForwardZone}
              originalDnsForwardZone={originalDnsForwardZone}
              metadata={metadata}
              onDnsForwardZoneChange={setDnsForwardZone}
              onRefresh={refetch}
              isModified={modified}
              isDataLoading={isLoading}
              modifiedValues={modifiedValues}
              onResetValues={resetValues}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default DnsForwardZonesTabs;
