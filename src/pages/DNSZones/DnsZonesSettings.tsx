import React from "react";
// PatternFly
import {
  DropdownItem,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { DNSZone, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useAlerts from "src/hooks/useAlerts";
// Utils
import { dnsZoneAsRecord } from "src/utils/dnsZonesUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  DnsZoneModPayload,
  useDnsZoneModMutation,
} from "src/services/rpcDnsZones";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import IpaTextArea from "src/components/Form/IpaTextArea";
import IpaTextboxList from "src/components/Form/IpaTextboxList";
import IpaNumberInput from "src/components/Form/IpaNumberInput";
import IpaCheckbox from "src/components/Form/IpaCheckbox";
import IpaForwardPolicy from "src/components/Form/IpaForwardPolicy";

interface DnsZonesSettingsProps {
  dnsZone: Partial<DNSZone>;
  originalDnsZone: Partial<DNSZone>;
  metadata: Metadata;
  onDnsZoneChange: (dnsZone: Partial<DNSZone>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading: boolean;
  modifiedValues: () => Partial<DNSZone>;
  onResetValues: () => void;
  pathname: string;
}

const DnsZonesSettings = (props: DnsZonesSettingsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = dnsZoneAsRecord(
    props.dnsZone,
    props.onDnsZoneChange
  );

  // API calls
  const [saveDnsZone] = useDnsZoneModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onDnsZoneChange(props.originalDnsZone);
    props.onRefresh();
    alerts.addAlert("revert-success", "Dns zone data reverted", "success");
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<DNSZone>,
    keyArray: string[]
  ): DnsZoneModPayload => {
    const payload: DnsZoneModPayload = {
      idnsname: props.dnsZone.idnsname?.toString() as string,
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
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    // Generate payload
    const payload = buildPayload(modifiedValues, [
      "idnszone",
      "idnszoneid",
      "idnsforwarders",
      "idnsforwardpolicy",
      "idnsallowquery",
      "idnsupdatepolicy",
      "idnssoaemail",
      "idnssoaserver",
      "idnssoarefresh",
      "idnssoaretry",
      "idnssoaminimum",
      "idnssoadefaultttl",
    ]);

    saveDnsZone(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          props.onDnsZoneChange(data.result.result);
          alerts.addAlert("success", "DNS zone data updated", "success");
          // Disable 'revert' and 'save' buttons
          props.onRefresh();
        }
      }
      setIsDataLoading(false);
    });
  };

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = React.useState<boolean>(false);

  const kebabItems = [
    <DropdownItem key="enable" isDisabled={true}>
      Enable
    </DropdownItem>,
    <DropdownItem key="disable" isDisabled={false}>
      Disable
    </DropdownItem>,
    <DropdownItem key="delete">Delete</DropdownItem>,
    <DropdownItem key="add-permission" isDisabled={false}>
      Add permission
    </DropdownItem>,
    <DropdownItem key="remove-permission" isDisabled={true}>
      Remove permission
    </DropdownItem>,
  ];

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={props.onRefresh}>
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified || isDataLoading}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified || isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          direction={"up"}
          onDropdownSelect={() => setIsKebabOpen(!isKebabOpen)}
          onKebabToggle={() => setIsKebabOpen(!isKebabOpen)}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={kebabItems}
        />
      ),
    },
  ];

  // Render component
  return (
    <>
      <TabLayout id="settings-page" toolbarItems={toolbarFields}>
        <alerts.ManagedAlerts />
        <Sidebar isPanelRight>
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
              }
            />
          </SidebarPanel>
          <SidebarContent className="pf-v5-u-mr-xl">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v5-u-mb-lg">
                  <FormGroup label="Zone name" role="idnsname">
                    <IpaTextInput
                      name={"idnsname"}
                      ariaLabel={"Zone name text input"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Authoritative nameserver"
                    role="idnssoamname"
                    isRequired
                  >
                    <IpaTextInput
                      name={"idnssoamname"}
                      ariaLabel={"Authoritative nameserver text input"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Administrator e-mail address"
                    role="idnssoarname"
                    isRequired
                  >
                    <IpaTextInput
                      name={"idnssoarname"}
                      ariaLabel={"Administrator e-mail address text input"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="SOA serial" role="idnssoaserial">
                    <IpaNumberInput
                      name={"idnssoaserial"}
                      ariaLabel={"SOA serial number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      metadata={props.metadata}
                      numCharsShown={10}
                      minValue={1}
                      maxValue={4294967295}
                      isDisabled={true} // Force to Read-only
                    />
                  </FormGroup>
                  <FormGroup
                    label="SOA refresh (seconds)"
                    role="idnssoarefresh"
                    isRequired
                  >
                    <IpaNumberInput
                      name={"idnssoarefresh"}
                      ariaLabel={"SOA refresh in seconds number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      onChange={props.onDnsZoneChange}
                      metadata={props.metadata}
                      numCharsShown={10}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                  <FormGroup
                    label="SOA retry (seconds)"
                    role="idnssoaretry"
                    isRequired
                  >
                    <IpaNumberInput
                      name={"idnssoaretry"}
                      ariaLabel={"SOA retry  in seconds number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      onChange={props.onDnsZoneChange}
                      metadata={props.metadata}
                      numCharsShown={10}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                  <FormGroup label="SOA expire (seconds)" role="idnssoaexpire">
                    <IpaNumberInput
                      name={"idnssoaexpire"}
                      ariaLabel={"SOA expire in seconds number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      onChange={props.onDnsZoneChange}
                      metadata={props.metadata}
                      numCharsShown={10}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                  <FormGroup
                    label="SOA minimum (seconds)"
                    role="idnssoaminimum"
                    isRequired
                  >
                    <IpaNumberInput
                      name={"idnssoaminimum"}
                      ariaLabel={"SOA minimum in seconds number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      onChange={props.onDnsZoneChange}
                      metadata={props.metadata}
                      numCharsShown={10}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Default time to live (seconds)"
                    role="dnsdefaultttl"
                  >
                    <IpaNumberInput
                      name={"dnsdefaultttl"}
                      ariaLabel={"Default time to live in seconds number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      onChange={props.onDnsZoneChange}
                      metadata={props.metadata}
                      numCharsShown={10}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                  <FormGroup label="Time to live (seconds)" role="dnsttl">
                    <IpaNumberInput
                      name={"dnsttl"}
                      ariaLabel={"Time to live in seconds number input"}
                      ipaObject={ipaObject}
                      objectName="dnszone"
                      onChange={props.onDnsZoneChange}
                      metadata={props.metadata}
                      numCharsShown={10}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                  <FormGroup label="Dynamic update" role="idnsallowdynupdate">
                    <IpaCheckbox
                      name={"idnsallowdynupdate"}
                      value={"dynamic-update"}
                      text={"Dynamic update"}
                      ariaLabel={"Dynamic update checkbox"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="BIND update policy" role="idnsupdatepolicy">
                    <IpaTextArea
                      name={"idnsupdatepolicy"}
                      ariaLabel={"BIND update policy"}
                      ipaObject={ipaObject}
                      onChange={props.onDnsZoneChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Allow query" role="idnsallowquery">
                    <IpaTextboxList
                      name={"idnsallowquery"}
                      ariaLabel={"Allow query textbox list"}
                      ipaObject={ipaObject}
                      setIpaObject={recordOnChange}
                    />
                  </FormGroup>
                  <FormGroup label="Allow transfer" role="idnsallowtransfer">
                    <IpaTextboxList
                      name={"idnsallowtransfer"}
                      ariaLabel={"Allow transfer textbox list"}
                      ipaObject={ipaObject}
                      setIpaObject={recordOnChange}
                    />
                  </FormGroup>
                  <FormGroup label="Zone forwarders" role="idnsforwarders">
                    <IpaTextboxList
                      name={"idnsforwarders"}
                      ariaLabel={"Zone forwarders textbox list"}
                      ipaObject={ipaObject}
                      setIpaObject={recordOnChange}
                    />
                  </FormGroup>
                  <FormGroup label="Forward policy" role="idnsforwardpolicy">
                    <IpaForwardPolicy
                      name={"idnsforwardpolicy"}
                      ariaLabel={"Forward policy radio group"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      metadata={props.metadata}
                      objectName="dnszone"
                    />
                  </FormGroup>
                  <FormGroup label="Allow PTR sync" role="idnsallowsyncptr">
                    <IpaCheckbox
                      name={"idnsallowsyncptr"}
                      value={"allow-sync-ptr"}
                      text={"Allow PTR sync"}
                      ariaLabel={"Allow PTR sync checkbox"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Allow in-line DNSSEC signing"
                    role="idnssecinlinesigning"
                  >
                    <IpaCheckbox
                      name={"idnssecinlinesigning"}
                      value={"inline-signing"}
                      text={"Allow in-line DNSSEC signing"}
                      ariaLabel={"Allow in-line DNSSEC signing checkbox"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="NSEC3PARAM record" role="nsec3paramrecord">
                    <IpaTextInput
                      name={"nsec3paramrecord"}
                      ariaLabel={"NSEC3PARAM record text input"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="dnszone"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
      </TabLayout>
    </>
  );
};

export default DnsZonesSettings;
