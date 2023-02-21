import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
// Tables
import CreateKeytabUsersTable from "../tables/HostsSettings/CreateKeytabUsersTable";
import CreateKeytabUserGroupsTable from "../tables/HostsSettings/CreateKeytabUserGroupsTable";
import CreateKeytabHostsTable from "../tables/HostsSettings/CreateKeytabHostsTable";
import CreateKeytabHostGroupsTable from "../tables/HostsSettings/CreateKeytabHostGroupsTable";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";

interface PropsToAllowCreateKeytab {
  service: Service;
}

const AllowedCreateKeytab = (props: PropsToAllowCreateKeytab) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUsersTable host={props.service.id} />
        <CreateKeytabHostsTable host={props.service.id} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUserGroupsTable host={props.service.id} />
        <CreateKeytabHostGroupsTable host={props.service.id} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedCreateKeytab;
