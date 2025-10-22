import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useDnsZonesData } from "src/hooks/useDnsZonesData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import DnsZonesSettings from "./DnsZonesSettings";
import DnsResourceRecords from "./DnsResourceRecords";
import { useSafeParams } from "src/utils/paramsUtils";

type DnsParams = {
  idnsname: string;
};

const DnsZonesTabs = ({ section }: { section: string }) => {
  const { idnsname } = useSafeParams<DnsParams>(["idnsname"]);
  const navigate = useNavigate();
  const pathname = "dns-zones";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // States - Identifier of the entity (DNS Zone -> idnsname)
  const [id, setId] = React.useState("");

  // Data loaded from the API
  const dnsZonesSettingsData = useDnsZonesData(idnsname);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + id);
    } else if (tabIndex === "dns-records") {
      navigate("/" + pathname + "/" + id + "/dns-records");
    }
  };

  React.useEffect(() => {
    setId(idnsname);
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "DNS zones",
        url: URL_PREFIX + "/" + pathname,
      },
      {
        name: idnsname,
        url: URL_PREFIX + "/" + pathname + "/" + idnsname,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
  }, [idnsname]);

  // Handling of the API data
  if (dnsZonesSettingsData.isLoading || !dnsZonesSettingsData.dnsZone) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the certMapping is not found
  if (
    !dnsZonesSettingsData.isLoading &&
    Object.keys(dnsZonesSettingsData.dnsZone).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout id={id} preText="DNS zone:" text={id} headingLevel="h1" />
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
            data-cy="dns-zones-tab-settings"
          >
            <DnsZonesSettings
              dnsZone={dnsZonesSettingsData.dnsZone}
              originalDnsZone={dnsZonesSettingsData.originalDnsZone}
              permissionsData={dnsZonesSettingsData.permissionsData}
              metadata={dnsZonesSettingsData.metadata}
              onDnsZoneChange={dnsZonesSettingsData.setDnsZone}
              onRefresh={dnsZonesSettingsData.refetch}
              isModified={dnsZonesSettingsData.modified}
              isDataLoading={dnsZonesSettingsData.isLoading}
              modifiedValues={dnsZonesSettingsData.modifiedValues}
              onResetValues={dnsZonesSettingsData.resetValues}
              pathname={pathname}
            />
          </Tab>
          <Tab
            eventKey={"dns-records"}
            name="dns-records"
            title={<TabTitleText>DNS records</TabTitleText>}
            data-cy="dns-zones-tab-dns-records"
          >
            <DnsResourceRecords dnsZoneId={id} />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default DnsZonesTabs;
