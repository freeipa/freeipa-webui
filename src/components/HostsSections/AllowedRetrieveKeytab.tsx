import React from "react";
// PatternFly
import { Label, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// Tables
import KeytabTable from "../tables/KeytabTable";
// Data types
import { Host } from "../../utils/datatypes/globalDataTypes";

interface PropsToAllowRetrieveKeytab {
  host: Partial<Host>;
  onRefresh: () => void;
}

const AllowedRetrieveKeytab = (props: PropsToAllowRetrieveKeytab) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  let fqdn = "";
  if (props.host.fqdn !== undefined) {
    fqdn = props.host.fqdn;
  }
  const handleTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Get the item count for the label
  let attr = "ipaallowedtoperform_read_keys_user";
  const user_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;
  attr = "ipaallowedtoperform_read_keys_group";
  const group_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;
  attr = "ipaallowedtoperform_read_keys_host";
  const host_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;
  attr = "ipaallowedtoperform_read_keys_hostgroup";
  const hostgroup_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;

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
