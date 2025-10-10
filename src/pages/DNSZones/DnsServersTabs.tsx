import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useDnsServersSettingsData } from "src/hooks/useDnsServersSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import DnsServersSettings from "src/pages/DNSZones/DnsServersSettings";

const DnsServersTabs = ({ section }: { section: string }) => {
  const { idnsserverid } = useParams();
  const navigate = useNavigate();
  const pathname = "dns-servers";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const dnsServersSettingsData = useDnsServersSettingsData(
    idnsserverid as string
  );

  // States - Identifier of the entity (DNS Zone -> idnsname)
  const [id, setId] = React.useState("");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + idnsserverid);
    }
  };

  React.useEffect(() => {
    if (!idnsserverid) {
      navigate(URL_PREFIX + "/" + pathname);
    } else {
      setId(idnsserverid);
      const currentPath: BreadCrumbItem[] = [
        {
          name: "DNS servers",
          url: URL_PREFIX + "/" + pathname,
        },
        {
          name: idnsserverid,
          url: URL_PREFIX + "/" + pathname + "/" + idnsserverid,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
    }
  }, [idnsserverid]);

  // Handling of the API data
  if (dnsServersSettingsData.isLoading || !dnsServersSettingsData.dnsServer) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the certMapping is not found
  if (
    !dnsServersSettingsData.isLoading &&
    Object.keys(dnsServersSettingsData.dnsServer).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={id}
          preText="DNS server:"
          text={id}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Tabs activeKey={section} onSelect={handleTabClick}>
          <Tab
            eventKey="settings"
            title={<TabTitleText>Settings</TabTitleText>}
          />
        </Tabs>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <DnsServersSettings
          dnsServer={dnsServersSettingsData.dnsServer}
          originalDnsServer={dnsServersSettingsData.originalDnsServer}
          metadata={dnsServersSettingsData.metadata}
          onDnsServerChange={dnsServersSettingsData.setDnsServer}
          onRefresh={dnsServersSettingsData.refetch}
          isModified={dnsServersSettingsData.modified}
          isDataLoading={dnsServersSettingsData.isLoading}
          modifiedValues={dnsServersSettingsData.modifiedValues}
          onResetValues={dnsServersSettingsData.resetValues}
          pathname={pathname}
        />
      </PageSection>
    </>
  );
};

export default DnsServersTabs;
