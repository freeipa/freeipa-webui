import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { DnsServer, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useAlerts from "src/hooks/useAlerts";
// Utils
import { dnsServerAsRecord } from "src/utils/dnsServersUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  DnsServerModPayload,
  useDnsServersModMutation,
} from "src/services/rpcDnsServers";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaTextboxList from "src/components/Form/IpaTextboxList/IpaTextboxList";
import IpaForwardPolicy from "src/components/Form/IpaForwardPolicy";

interface DnsServersSettingsProps {
  dnsServer: Partial<DnsServer>;
  originalDnsServer: Partial<DnsServer>;
  metadata: Metadata;
  onDnsServerChange: (dnsServer: Partial<DnsServer>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading: boolean;
  modifiedValues: () => Partial<DnsServer>;
  onResetValues: () => void;
  pathname: string;
}

const DnsServersSettings = (props: DnsServersSettingsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Computed state
  const dnsServerId: string = props.dnsServer.idnsserverid || "";

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = dnsServerAsRecord(
    props.dnsServer,
    props.onDnsServerChange
  );

  // API calls
  const [saveDnsServer] = useDnsServersModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onDnsServerChange(props.originalDnsServer);
    props.onRefresh();
    alerts.addAlert("revert-success", "DNS server data reverted", "success");
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<DnsServer>,
    keyArray: string[]
  ): DnsServerModPayload => {
    const payload: DnsServerModPayload = {
      idnsserverid: dnsServerId,
    };

    keyArray.forEach((key) => {
      // Modified values are either the value (in string) or an array ([]) when set to empty string
      if (modifiedValues[key] !== undefined) {
        if (modifiedValues[key] === "") {
          payload[key] = [];
        } else {
          payload[key] = modifiedValues[key];
        }
      }
    });
    return payload;
  };

  // on Save handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    const payload = buildPayload(modifiedValues, [
      "idnssoamname",
      "idnsforwarders",
      "idnsforwardpolicy",
    ]);

    saveDnsServer(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          props.onDnsServerChange(data.result.result);
          alerts.addAlert("success", "DNS server data updated", "success");
          props.onRefresh();
        }
      }
      setIsDataLoading(false);
    });
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="dns-servers-tab-settings-button-refresh"
          onClick={props.onRefresh}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          variant="secondary"
          data-cy="dns-servers-tab-settings-button-revert"
          isDisabled={!props.isModified || isDataLoading}
          onClick={onRevert}
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          variant="primary"
          data-cy="dns-servers-tab-settings-button-save"
          isDisabled={!props.isModified || isDataLoading}
          type="submit"
          form="dns-servers-tab-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
            }
          />
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column", lg: "row" }}>
            <FlexItem flex={{ default: "flex_1" }}>
              <Form
                className="pf-v6-u-mb-lg"
                id="dns-servers-tab-settings-form"
                onSubmit={onSave}
              >
                <FormGroup label="SOA name" role="idnssoamname">
                  <IpaTextInput
                    dataCy="dns-servers-tab-settings-textbox-idnssoamname"
                    name={"idnssoamname"}
                    ariaLabel={"SOA name text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="dnsserver"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup label="Server name" role="idnsserverid">
                  <IpaTextInput
                    dataCy="dns-servers-tab-settings-textbox-idnsserverid"
                    name={"idnsserverid"}
                    ariaLabel={"Server name text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="dnsserver"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup label="Forwarders" role="idnsforwarders">
                  <IpaTextboxList
                    dataCy="dns-servers-tab-settings-textbox-idnsforwarders"
                    ipaObject={ipaObject}
                    setIpaObject={recordOnChange}
                    name="idnsforwarders"
                    ariaLabel={"Forwarders text input"}
                  />
                </FormGroup>
                <FormGroup label="Forward policy" role="idnsforwardpolicy">
                  <IpaForwardPolicy
                    name={"idnsforwardpolicy"}
                    ariaLabel={"Forward policy radio group"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    metadata={props.metadata}
                    objectName="dnsserver"
                  />
                </FormGroup>
              </Form>
            </FlexItem>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default DnsServersSettings;
