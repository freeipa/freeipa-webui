import React from "react";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useDnsRecordsData } from "src/hooks/useDnsRecordsData";
// Components
import DataSpinner from "src/components/layouts/DataSpinner";
import { BreadCrumbItem } from "src/components/layouts/BreadCrumb/BreadCrumb";
import DnsResourceRecordsSettings from "./DnsResourceRecordsSettings";
import { useSafeParams } from "src/utils/paramsUtils";

type DnsParams = {
  idnsname: string;
  recordName: string;
};

const DnsResourceRecordsPreSettings = () => {
  const pathname = "dns-zones";

  // Params
  const { idnsname, recordName } = useSafeParams<DnsParams>([
    "idnsname",
    "recordName",
  ]);

  // Data loaded from the API
  const dnsrecordsSettingsData = useDnsRecordsData(idnsname, recordName);

  // Breadcrumbs
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "DNS zones",
        url: URL_PREFIX + "/" + pathname,
      },
      {
        name: idnsname,
        url: URL_PREFIX + "/" + pathname + "/" + idnsname,
      },
      {
        name: recordName,
        url: URL_PREFIX + "/" + pathname + "/" + idnsname + "/" + recordName,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
  }, [idnsname, recordName]);

  // Handling of the API data
  if (dnsrecordsSettingsData.isLoading || !dnsrecordsSettingsData.dnsRecord) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the certMapping is not found
  if (
    !dnsrecordsSettingsData.isLoading &&
    Object.keys(dnsrecordsSettingsData.dnsRecord).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <DnsResourceRecordsSettings
      idnsname={idnsname}
      recordName={recordName}
      dnsRecord={dnsrecordsSettingsData.dnsRecord}
      originalDnsRecord={dnsrecordsSettingsData.originalDnsRecord}
      host={dnsrecordsSettingsData.host}
      originalHost={dnsrecordsSettingsData.originalHost} // is this needed?
      metadata={dnsrecordsSettingsData.metadata}
      onDnsRecordChange={dnsrecordsSettingsData.setDnsRecord}
      onHostChange={dnsrecordsSettingsData.setHost}
      isModified={dnsrecordsSettingsData.modified}
      isDataLoading={dnsrecordsSettingsData.isLoading}
      modifiedValues={dnsrecordsSettingsData.modifiedValues}
      onResetValues={dnsrecordsSettingsData.resetValues}
      pathname={pathname}
      onRefresh={dnsrecordsSettingsData.refetch}
      breadcrumbItems={breadcrumbItems}
    />
  );
};

export default DnsResourceRecordsPreSettings;
