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
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
// Utils
import { dnsForwardZoneAsRecord } from "src/utils/dnsForwardZonesUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  DnsForwardZoneModPayload,
  IPAddressWithPort,
  useSaveDnsForwardZoneMutation,
} from "src/services/rpcDnsForwardZones";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaForwardPolicy from "src/components/Form/IpaForwardPolicy";
import IPAddressWithPortInputList from "src/components/Form/IPAddressWithPortInputList";

interface DnsForwardZonesSettingsProps {
  dnsForwardZone: Partial<DnsForwardZoneModPayload>;
  originalDnsForwardZone: Partial<DnsForwardZoneModPayload>;
  metadata: Metadata;
  onDnsForwardZoneChange: (
    dnsForwardZone: Partial<DnsForwardZoneModPayload>
  ) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading: boolean;
  modifiedValues: () => Partial<DnsForwardZoneModPayload>;
  onResetValues: () => void;
  pathname: string;
}

const DnsForwardZonesSettings = (props: DnsForwardZonesSettingsProps) => {
  // Alerts to show in the UI
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = dnsForwardZoneAsRecord(
    props.dnsForwardZone,
    props.onDnsForwardZoneChange
  );

  // API calls
  const [saveDnsForwardZone] = useSaveDnsForwardZoneMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onDnsForwardZoneChange(props.originalDnsForwardZone);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "DNS forward zone data reverted",
        variant: "success",
      })
    );
  };

  // on Save handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDataLoading(true);

    const modifiedValues = props.modifiedValues();
    const payload: DnsForwardZoneModPayload = {
      idnsname: ipaObject.idnsname,
      ...(modifiedValues.idnsforwarders && {
        idnsforwarders: modifiedValues.idnsforwarders,
      }),
      ...(modifiedValues.idnsforwardpolicy && {
        idnsforwardpolicy: modifiedValues.idnsforwardpolicy,
      }),
    };

    saveDnsForwardZone(payload)
      .then((response) => {
        if ("data" in response) {
          const data = response.data;
          if (data?.error) {
            dispatch(
              addAlert({
                name: "error",
                title: (data.error as Error).message,
                variant: "danger",
              })
            );
          }
          if (data?.result) {
            props.onDnsForwardZoneChange({
              ...props.dnsForwardZone,
              ...modifiedValues,
            });
            dispatch(
              addAlert({
                name: "success",
                title: "DNS forward zone data updated",
                variant: "success",
              })
            );
            props.onRefresh();
          }
        }
      })
      .finally(() => {
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
          data-cy="dns-forward-zones-tab-settings-button-refresh"
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
          data-cy="dns-forward-zones-tab-settings-button-revert"
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
          data-cy="dns-forward-zones-tab-settings-button-save"
          isDisabled={!props.isModified || isDataLoading}
          type="submit"
          form="dns-forward-zones-tab-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
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
                id="dns-forward-zones-tab-settings-form"
                onSubmit={onSave}
              >
                <FormGroup label="Zone name" role="idnsname">
                  <IpaTextInput
                    dataCy="dns-zones-tab-settings-textbox-idnsname"
                    name={"idnsname"}
                    ariaLabel={"Zone name text input"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="dnsforwardzone"
                    metadata={props.metadata}
                  />
                </FormGroup>
                <FormGroup label="Forwarders" role="idnsforwarders">
                  <IPAddressWithPortInputList
                    dataCy="modal-textbox-forwarders"
                    name="idnsforwarders"
                    ariaLabel="Forwarders text input"
                    list={ipaObject.idnsforwarders}
                    setList={(values: IPAddressWithPort[]) =>
                      recordOnChange({ ...ipaObject, idnsforwarders: values })
                    }
                  />
                </FormGroup>
                <FormGroup label="Forward policy" role="idnsforwardpolicy">
                  <IpaForwardPolicy
                    name={"idnsforwardpolicy"}
                    ariaLabel={"Forward policy radio group"}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    metadata={props.metadata}
                    objectName="dnsforwardzone"
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

export default DnsForwardZonesSettings;
