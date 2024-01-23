import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
// Tables
import RetrieveKeytabUsersTable from "../tables/HostsSettings/RetrieveKeytabUsersTable";
import RetrieveKeytabUserGroupsTable from "../tables/HostsSettings/RetrieveKeytabUserGroupsTable";
import RetrieveKeytabHostsTable from "../tables/HostsSettings/RetrieveKeytabHostsTable";
import RetrieveKeytabHostGroupsTable from "../tables/HostsSettings/RetrieveKeytabHostGroupTable";
// Data types
import { Service } from "../../utils/datatypes/globalDataTypes";

interface PropsToAllowCreateKeytab {
  service: Service;
}

const AllowedRetrieveKeytab = (props: PropsToAllowCreateKeytab) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <RetrieveKeytabUsersTable host={props.service.krbcanonicalname} />
        <RetrieveKeytabHostsTable host={props.service.krbcanonicalname} />
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <RetrieveKeytabUserGroupsTable host={props.service.krbcanonicalname} />
        <RetrieveKeytabHostGroupsTable host={props.service.krbcanonicalname} />
      </FlexItem>
    </Flex>
  );
};

export default AllowedRetrieveKeytab;
