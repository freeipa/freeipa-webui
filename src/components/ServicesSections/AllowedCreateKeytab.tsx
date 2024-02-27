import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
// Tables
import CreateKeytabUsersTable from "../tables/HostsSettings/CreateKeytabUsersTable";
import CreateKeytabUserGroupsTable from "../tables/HostsSettings/CreateKeytabUserGroupsTable";
import CreateKeytabHostsTable from "../tables/HostsSettings/CreateKeytabHostsTable";
import CreateKeytabHostGroupsTable from "../tables/HostsSettings/CreateKeytabHostGroupsTable";
// Data types
import { Service } from "../../utils/datatypes/globalDataTypes";

interface PropsToAllowCreateKeytab {
  service: Service;
  onRefresh: () => void;
}

const AllowedCreateKeytab = (props: PropsToAllowCreateKeytab) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUsersTable
          from="service"
          id={props.service.krbcanonicalname}
          entry={props.service}
          onRefresh={props.onRefresh}
        />
        <CreateKeytabHostsTable host={props.service.krbcanonicalname} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <CreateKeytabUserGroupsTable host={props.service.krbcanonicalname} />
        <CreateKeytabHostGroupsTable host={props.service.krbcanonicalname} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedCreateKeytab;
