import React from "react";
// PatternFly
import { Label, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// Tables
import KeytabTableWithFilter, {
  TableEntry,
} from "../tables/KeytabTableWithFilter";
// Data types
import { Host } from "../../utils/datatypes/globalDataTypes";
// RPC
import {
  KeyTabPayload,
  useUpdateKeyTabMutation,
} from "src/services/rpcSettings";
import { useAlerts } from "src/hooks/useAlerts";

type EntryType = "user" | "group" | "host" | "hostgroup";

interface PropsToAllowCreateKeytab {
  host: Partial<Host>;
  onRefresh: () => void;
}

const AllowedCreateKeytab = (props: PropsToAllowCreateKeytab) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [modalSpinning, setModalSpinning] = React.useState<boolean>(false);
  const [executeUpdate] = useUpdateKeyTabMutation({});
  const alerts = useAlerts();

  // Helpers to build table entries
  const toTableEntries = (values: string[] | undefined): TableEntry[] => {
    const sortedValues = values ? values.slice().sort() : [];
    return sortedValues.map((v) => ({ entry: v, showLink: true }));
  };

  const usersList = toTableEntries(
    props.host.ipaallowedtoperform_write_keys_user ?? undefined
  );
  const userGroupsList = toTableEntries(
    props.host.ipaallowedtoperform_write_keys_group ?? undefined
  );
  const hostsList = toTableEntries(
    props.host.ipaallowedtoperform_write_keys_host ?? undefined
  );
  const hostGroupsList = toTableEntries(
    props.host.ipaallowedtoperform_write_keys_hostgroup ?? undefined
  );

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
  let attr = "ipaallowedtoperform_write_keys_user";
  const user_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;
  attr = "ipaallowedtoperform_write_keys_group";
  const group_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;
  attr = "ipaallowedtoperform_write_keys_host";
  const host_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;
  attr = "ipaallowedtoperform_write_keys_hostgroup";
  const hostgroup_count =
    props.host[attr] !== undefined ? props.host[attr].length : 0;

  const allowMethod = "host_allow_create_keytab";
  const disallowMethod = "host_disallow_create_keytab";

  const removeEntries =
    (entryType: EntryType) => (entriesToDelete: string[]) => {
      setModalSpinning(true);
      executeUpdate({
        id: fqdn,
        entryType,
        entries: entriesToDelete,
        method: disallowMethod,
      } as KeyTabPayload)
        .then(() => {
          props.onRefresh();
          alerts.addAlert(
            `keytab-disallow-success-${entryType}`,
            `Removed ${entryType}s that are allowed to create keytabs`,
            "success"
          );
        })
        .catch((err) =>
          alerts.addAlert(
            "keytab-disallow-error",
            err?.data?.error || err?.message || "Operation failed",
            "danger"
          )
        )
        .finally(() => setModalSpinning(false));
    };

  const addEntries = (entryType: EntryType) => (newEntries: string[]) => {
    setModalSpinning(true);
    executeUpdate({
      id: fqdn,
      entryType,
      entries: newEntries,
      method: allowMethod,
    } as KeyTabPayload)
      .then(() => {
        props.onRefresh();
        alerts.addAlert(
          `keytab-allow-success-${entryType}`,
          `Successfully added  ${entryType}s that are allowed to create keytabs`,
          "success"
        );
      })
      .catch((err) =>
        alerts.addAlert(
          "keytab-allow-error",
          err?.data?.error || err?.message || "Operation failed",
          "danger"
        )
      )
      .finally(() => setModalSpinning(false));
  };

  return (
    <>
      <alerts.ManagedAlerts />
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
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={fqdn}
            from="Hosts"
            name="ipaallowedtoperform_write_keys_user"
            isSpinning={modalSpinning}
            entityType="user"
            operationTitle={"Allow users to create keytab for " + fqdn}
            tableEntryList={usersList}
            columnNames={["User"]}
            onRefresh={props.onRefresh}
            onAdd={addEntries("user")}
            onDelete={removeEntries("user")}
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
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={fqdn}
            from="Hosts"
            name="ipaallowedtoperform_write_keys_group"
            isSpinning={modalSpinning}
            entityType="group"
            operationTitle={"Allow groups to create keytab for " + fqdn}
            tableEntryList={userGroupsList}
            columnNames={["Group"]}
            onRefresh={props.onRefresh}
            onAdd={addEntries("group")}
            onDelete={removeEntries("group")}
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
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={fqdn}
            from="Hosts"
            name="ipaallowedtoperform_write_keys_host"
            isSpinning={modalSpinning}
            entityType="host"
            operationTitle={"Allow hosts to create keytab for " + fqdn}
            tableEntryList={hostsList}
            columnNames={["Host"]}
            onRefresh={props.onRefresh}
            onAdd={addEntries("host")}
            onDelete={removeEntries("host")}
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
          <KeytabTableWithFilter
            className="pf-v6-u-ml-md pf-v6-u-mt-sm"
            id={fqdn}
            from="Hosts"
            name="ipaallowedtoperform_write_keys_hostgroup"
            isSpinning={modalSpinning}
            entityType="hostgroup"
            operationTitle={"Allow host groups to create keytab for " + fqdn}
            tableEntryList={hostGroupsList}
            columnNames={["Host group"]}
            onRefresh={props.onRefresh}
            onAdd={addEntries("hostgroup")}
            onDelete={removeEntries("hostgroup")}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default AllowedCreateKeytab;
