import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
// Tables
import CreateKeytabUsersTable from "../tables/HostsSettings/CreateKeytabUsersTable";
import CreateKeytabUserGroupsTable from "../tables/HostsSettings/CreateKeytabUserGroupsTable";
import CreateKeytabHostsTable from "../tables/HostsSettings/CreateKeytabHostsTable";
import CreateKeytabHostGroupsTable from "../tables/HostsSettings/CreateKeytabHostGroupsTable";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";

interface PropsToAllowCreateKeytab {
  host: Partial<Host>;
}

const AllowedCreateKeytab = (props: PropsToAllowCreateKeytab) => {
  let fqdn = "";
  if (props.host.fqdn !== undefined) {
    fqdn = props.host.fqdn;
  }
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUsersTable host={fqdn} />
        <CreateKeytabHostsTable host={fqdn} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUserGroupsTable host={fqdn} />
        <CreateKeytabHostGroupsTable host={fqdn} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedCreateKeytab;
