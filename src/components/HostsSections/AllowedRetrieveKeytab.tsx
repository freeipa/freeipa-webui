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
  host: Host;
}

const AllowedRetrieveKeytab = (props: PropsToAllowRetrieveKeytab) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <RetrieveKeytabUsersTable host={props.host.fqdn} />
        <RetrieveKeytabHostsTable host={props.host.fqdn} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <RetrieveKeytabUserGroupsTable host={props.host.fqdn} />
        <RetrieveKeytabHostGroupsTable host={props.host.fqdn} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedRetrieveKeytab;
