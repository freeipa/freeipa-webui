import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
// Tables
import RetrieveKeytabUsersTable from "../tables/HostsSettings/RetrieveKeytabUsersTable";
import RetrieveKeytabUserGroupsTable from "../tables/HostsSettings/RetrieveKeytabUserGroupsTable";
import RetrieveKeytabHostsTable from "../tables/HostsSettings/RetrieveKeytabHostsTable";
import RetrieveKeytabHostGroupsTable from "../tables/HostsSettings/RetrieveKeytabHostGroupTable";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";

interface PropsToAllowRetrieveKeytab {
  host: Partial<Host>;
}

const AllowedRetrieveKeytab = (props: PropsToAllowRetrieveKeytab) => {
  let fqdn = "";
  if (props.host.fqdn !== undefined) {
    fqdn = props.host.fqdn;
  }
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <RetrieveKeytabUsersTable host={fqdn} />
        <RetrieveKeytabHostsTable host={fqdn} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <RetrieveKeytabUserGroupsTable host={fqdn} />
        <RetrieveKeytabHostGroupsTable host={fqdn} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedRetrieveKeytab;
