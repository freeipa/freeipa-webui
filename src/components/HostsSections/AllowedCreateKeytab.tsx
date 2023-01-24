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
  host: Host;
}

const AllowedCreateKeytab = (props: PropsToAllowCreateKeytab) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUsersTable host={props.host.hostName} />
        <CreateKeytabHostsTable host={props.host.hostName} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUserGroupsTable host={props.host.hostName} />
        <CreateKeytabHostGroupsTable host={props.host.hostName} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedCreateKeytab;
