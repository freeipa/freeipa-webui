import React from "react";
// PatternFly
import { Flex, FlexItem } from "@patternfly/react-core";
// Tables
import KeytabUsersTable from "../tables/HostsSettings/KeytabUsersTable";
import RetrieveKeytabUserGroupsTable from "../tables/HostsSettings/RetrieveKeytabUserGroupsTable";
import RetrieveKeytabHostsTable from "../tables/HostsSettings/RetrieveKeytabHostsTable";
import RetrieveKeytabHostGroupsTable from "../tables/HostsSettings/RetrieveKeytabHostGroupTable";
// Data types
import { Service } from "../../utils/datatypes/globalDataTypes";

interface PropsToAllowCreateKeytab {
  service: Service;
  onRefresh: () => void;
}

const AllowedRetrieveKeytab = (props: PropsToAllowCreateKeytab) => {
  return (
    <Flex direction={{ default: "column", lg: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <KeytabUsersTable
          from="service"
          id={props.service.krbcanonicalname}
          entry={props.service}
          onRefresh={props.onRefresh}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
          opType="retrieve"
          entryAttr="ipaallowedtoperform_read_keys_user"
        />
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
