import React from "react";
// PatternFly
import { Label, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// Tables
import KeytabUsersTable from "../tables/HostsSettings/KeytabUsersTable";
import RetrieveKeytabUserGroupsTable from "../tables/HostsSettings/RetrieveKeytabUserGroupsTable";
import RetrieveKeytabHostsTable from "../tables/HostsSettings/RetrieveKeytabHostsTable";
import RetrieveKeytabHostGroupsTable from "../tables/HostsSettings/RetrieveKeytabHostGroupTable";
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
    <Tabs
      activeKey={activeTabKey}
      onSelect={handleTabClick}
      aria-label="Tabs for types of entries that can create keytabs"
    >
      <Tab
        key={0}
        eventKey={0}
        title={
          <TabTitleText>
            Users <Label isCompact>{user_count}</Label>
          </TabTitleText>
        }
        aria-label="user groups for create keytabs"
      >
        <KeytabUsersTable
          from="host"
          id={fqdn}
          entry={props.host}
          onRefresh={props.onRefresh}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
          opType="retrieve"
          entryAttr="ipaallowedtoperform_read_keys_user"
        />
      </Tab>
      <Tab
        key={1}
        eventKey={1}
        title={
          <TabTitleText>
            User Groups <Label isCompact>{group_count}</Label>
          </TabTitleText>
        }
        aria-label="user groups for create keytabs"
      >
        <RetrieveKeytabUserGroupsTable
          host={fqdn}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
        />
      </Tab>
      <Tab
        key={2}
        eventKey={2}
        title={
          <TabTitleText>
            Hosts <Label isCompact>{host_count}</Label>
          </TabTitleText>
        }
        aria-label="hosts for create keytabs"
      >
        <RetrieveKeytabHostsTable
          host={fqdn}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
        />
      </Tab>
      <Tab
        key={3}
        eventKey={3}
        title={
          <TabTitleText>
            Host Groups <Label isCompact>{hostgroup_count}</Label>
          </TabTitleText>
        }
        aria-label="hostser groups for create keytabs"
      >
        <RetrieveKeytabHostGroupsTable
          host={fqdn}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
        />
      </Tab>
    </Tabs>
  );
};

export default AllowedRetrieveKeytab;
