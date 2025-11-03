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
import {
  DnsPermissionType,
  DNSZone,
  Metadata,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
// Utils
import { dnsZoneAsRecord } from "src/utils/dnsZonesUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import { KwError } from "src/services/rpc";
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
import EnableDisableDnsZonesModal from "src/components/modals/DnsZones/EnableDisableDnsZonesModal";
import DeleteDnsZonesModal from "src/components/modals/DnsZones/DeleteDnsZonesModal";
import AddRemovePermission from "src/components/modals/DnsZones/AddRemovePermission";

interface DnsZonesSettingsProps {
  dnsZone: Partial<DNSZone>;
  originalDnsZone: Partial<DNSZone>;
  permissionsData: DnsPermissionType | KwError | null;
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
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // Infer the status of the DNS zone from the 'idnszoneactive' property
  const inferStatus = () => {
    if (props.dnsZone.idnszoneactive !== undefined) {
      let isActive = !!props.dnsZone.idnszoneactive;
      if (typeof props.dnsZone.idnszoneactive === "string") {
        // Convert string to boolean
        if (props.dnsZone.idnszoneactive === "true") {
          isActive = true;
        } else {
          isActive = false;
        }
      }
      return isActive;
    }
    return false; // Default to false if not defined
  };

  // Infer permission operation from the permissions data
  const inferPermissionOperation = () => {
    if (props.permissionsData?.type === "error") {
      return "add";
    } else if (props.permissionsData?.type === "dns_permission") {
      return "remove";
    }
    return null;
  };

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [isDnsZoneEnabled, setIsDnsZoneEnabled] =
    React.useState<boolean>(inferStatus);
  const [operation, setOperation] = React.useState<"add" | "remove" | null>(
    inferPermissionOperation
  );

  // Keep the status updated
  React.useEffect(() => {
    setIsDnsZoneEnabled(inferStatus());
  }, [props.dnsZone.idnszoneactive]);

  // Keep the operation updated
  React.useEffect(() => {
    setOperation(inferPermissionOperation());
  }, [props.permissionsData]);

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
    dispatch(
      addAlert({
        name: "revert-success",
        title: "DNS zone data reverted",
        variant: "success",
      })
    );
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
      "idnssoamname",
      "idnssoarname",
      "idnssoarefresh",
      "idnssoaretry",
      "idnssoaexpire",
      "idnssoaminimum",
      "dnsdefaultttl",
      "dnsttl",
      "idnsallowdynupdate",
      "idnsupdatepolicy",
      "idnsallowquery",
      "idnsallowtransfer",
      "idnsforwarders",
      "idnsforwardpolicy",
      "idnsallowsyncptr",
      "idnssecinlinesigning",
      "nsec3paramrecord",
    ]);

    saveDnsZone(payload).then((response) => {
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
          props.onDnsZoneChange(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "DNS zone data updated",
              variant: "success",
            })
          );
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
    <DropdownItem
      data-cy="dns-zones-tab-settings-kebab-enable"
      key="enable"
      isDisabled={isDnsZoneEnabled}
      onClick={() => setIsEnableDisableOpen(true)}
    >
      Enable
    </DropdownItem>,
    <DropdownItem
      data-cy="dns-zones-tab-settings-kebab-disable"
      key="disable"
      isDisabled={!isDnsZoneEnabled}
      onClick={() => setIsEnableDisableOpen(true)}
    >
      Disable
    </DropdownItem>,
    <DropdownItem
      data-cy="dns-zones-tab-settings-kebab-delete"
      key="delete"
      onClick={() => setIsDeleteOpen(true)}
    >
      Delete
    </DropdownItem>,
    <DropdownItem
      data-cy="dns-zones-tab-settings-kebab-add-permission"
      key="add-permission"
      isDisabled={operation !== "add"}
      onClick={() => {
        setOperation("add");
        setIsAddRemovePermissionOpen(true);
      }}
    >
      Add permission
    </DropdownItem>,
    <DropdownItem
      data-cy="dns-zones-tab-settings-kebab-remove-permission"
      key="remove-permission"
      isDisabled={operation !== "remove"}
      onClick={() => {
        setOperation("remove");
        setIsAddRemovePermissionOpen(true);
      }}
    >
      Remove permission
    </DropdownItem>,
  ];

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="dns-zones-tab-settings-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="dns-zones-tab-settings-button-revert"
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
          dataCy="dns-zones-tab-settings-button-save"
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
          dataCy="dns-zones-tab-settings-kebab"
          direction={"up"}
          onDropdownSelect={() => setIsKebabOpen(!isKebabOpen)}
          onKebabToggle={() => setIsKebabOpen(!isKebabOpen)}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={kebabItems}
          isDisabled={isDataLoading}
        />
      ),
    },
  ];

  // Modals
  const [isEnableDisableOpen, setIsEnableDisableOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isAddRemovePermissionOpen, setIsAddRemovePermissionOpen] =
    React.useState(false);

  // Render component
  return (
    <>
      <TabLayout
        id="settings-page"
        toolbarItems={toolbarFields}
        dataCy="dns-zones-settings"
      >
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
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup label="Zone name" role="idnsname">
                    <IpaTextInput
                      dataCy="dns-zones-tab-settings-textbox-idnsname"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoamname"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoarname"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoaserial"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoarefresh"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoaretry"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoaexpire"
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
                      dataCy="dns-zones-tab-settings-textbox-idnssoaminimum"
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
                      dataCy="dns-zones-tab-settings-textbox-dnsdefaultttl"
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
                      dataCy="dns-zones-tab-settings-textbox-dnsttl"
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
                      dataCy="dns-zones-tab-settings-checkbox-idnsallowdynupdate"
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
                      dataCy="dns-zones-tab-settings-textbox-idnsupdatepolicy"
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
                      dataCy="dns-zones-tab-settings-textbox-idnsallowquery"
                      name={"idnsallowquery"}
                      ariaLabel={"Allow query textbox list"}
                      ipaObject={ipaObject}
                      setIpaObject={recordOnChange}
                    />
                  </FormGroup>
                  <FormGroup label="Allow transfer" role="idnsallowtransfer">
                    <IpaTextboxList
                      dataCy="dns-zones-tab-settings-textbox-idnsallowtransfer"
                      name={"idnsallowtransfer"}
                      ariaLabel={"Allow transfer textbox list"}
                      ipaObject={ipaObject}
                      setIpaObject={recordOnChange}
                    />
                  </FormGroup>
                  <FormGroup label="Zone forwarders" role="idnsforwarders">
                    <IpaTextboxList
                      dataCy="dns-zones-tab-settings-textbox-idnsforwarders"
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
                      dataCy="dns-zones-tab-settings-checkbox-idnsallowsyncptr"
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
                      dataCy="dns-zones-tab-settings-checkbox-idnssecinlinesigning"
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
                      dataCy="dns-zones-tab-settings-textbox-nsec3paramrecord"
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
      <EnableDisableDnsZonesModal
        isOpen={isEnableDisableOpen}
        onClose={() => setIsEnableDisableOpen(false)}
        elementsList={[props.dnsZone.idnsname || ""]}
        setElementsList={() => {}} // No need to unselect elements in this case
        operation={isDnsZoneEnabled ? "disable" : "enable"}
        setShowTableRows={setIsDataLoading}
        onRefresh={props.onRefresh}
      />
      <DeleteDnsZonesModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        elementsToDelete={[props.dnsZone] as DNSZone[]}
        clearSelectedElements={() => {}} // No need to unselect elements in this case
        columnNames={["DNS zone name"]}
        keyNames={["idnsname"]}
        onRefresh={props.onRefresh}
        updateIsDeleteButtonDisabled={() => {}} // No need to disable delete button in this case
        updateIsDeletion={() => {}} // No need to update deletion state in this case
        fromSettings={true}
      />
      <AddRemovePermission
        isOpen={isAddRemovePermissionOpen}
        onClose={() => setIsAddRemovePermissionOpen(false)}
        dnsZoneId={props.dnsZone.idnsname || ""}
        operation={operation}
        changeOperation={setOperation}
        onRefresh={props.onRefresh}
      />
    </>
  );
};

export default DnsZonesSettings;
