import React from "react";
// PatternFly
import { Label, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// Tables
import KeytabTable from "../tables/KeytabTable";
// Data types
import { Service } from "../../utils/datatypes/globalDataTypes";

interface PropsToAllowCreateKeytab {
  service: Service;
  onRefresh: () => void;
}

const AllowedCreateKeytab = (props: PropsToAllowCreateKeytab) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Get the item count for the label
  let attr = "ipaallowedtoperform_write_keys_user";
  const user_count =
    props.service[attr] !== undefined ? props.service[attr].length : 0;
  attr = "ipaallowedtoperform_write_keys_group";
  const group_count =
    props.service[attr] !== undefined ? props.service[attr].length : 0;
  attr = "ipaallowedtoperform_write_keys_host";
  const host_count =
    props.service[attr] !== undefined ? props.service[attr].length : 0;
  attr = "ipaallowedtoperform_write_keys_hostgroup";
  const hostgroup_count =
    props.service[attr] !== undefined ? props.service[attr].length : 0;

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
        <KeytabTable
          from="service"
          id={props.service.krbcanonicalname}
          entry={props.service}
          onRefresh={props.onRefresh}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
          opType="create"
          entryAttr="ipaallowedtoperform_write_keys_user"
          entryType="user"
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
        <KeytabTable
          from="service"
          id={props.service.krbcanonicalname}
          entry={props.service}
          onRefresh={props.onRefresh}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
          opType="create"
          entryAttr="ipaallowedtoperform_write_keys_group"
          entryType="group"
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
        <KeytabTable
          from="service"
          id={props.service.krbcanonicalname}
          entry={props.service}
          onRefresh={props.onRefresh}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
          opType="create"
          entryAttr="ipaallowedtoperform_write_keys_host"
          entryType="host"
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
        <KeytabTable
          from="service"
          id={props.service.krbcanonicalname}
          entry={props.service}
          onRefresh={props.onRefresh}
          className="pf-v5-u-ml-md pf-v5-u-mt-sm"
          opType="create"
          entryAttr="ipaallowedtoperform_write_keys_hostgroup"
          entryType="hostgroup"
        />
      </Tab>
    </Tabs>
  );
};

export default AllowedCreateKeytab;
