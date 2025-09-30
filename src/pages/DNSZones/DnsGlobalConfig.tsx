import React from "react";
// PatternFly
import {
  Button,
  Content,
  DropdownItem,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { useDnsConfigData } from "src/hooks/useDnsConfigData";
// RPC
import {
  DnsGlobalConfigPayload,
  useDnsGlobalConfigModMutation,
  useDnsGlobalConfigUpdateSystemDnsRecordsMutation,
} from "src/services/rpcDnsGlobalConfig";
// Utils
import { dnsConfigAsRecord } from "src/utils/dnsConfigUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import DataSpinner from "src/components/layouts/DataSpinner";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PageWithGrayBorderLayout from "src/components/layouts/PageWithGrayBorderLayout";
import IpaCheckbox from "src/components/Form/IpaCheckbox";
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaTextboxList from "src/components/Form/IpaTextboxList";
import IpaForwardPolicy from "src/components/Form/IpaForwardPolicy";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";

const DnsGlobalConfig = () => {
  const alerts = useAlerts();

  // API calls
  const dnsConfigData = useDnsConfigData();
  const [saveConfigInfo] = useDnsGlobalConfigModMutation();
  const [updateSystemDnsRecords] =
    useDnsGlobalConfigUpdateSystemDnsRecordsMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "dns-global-config",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = dnsConfigAsRecord(
    dnsConfigData.dnsConfig,
    dnsConfigData.setDnsConfig
  );

  // 'Revert' handler method
  const onRevert = () => {
    dnsConfigData.setDnsConfig(dnsConfigData.originalDnsConfig);
    dnsConfigData.refetch();
    alerts.addAlert(
      "revert-success",
      "DNS global configuration data reverted",
      "success"
    );
  };

  // on Save handler method
  const onSave = (event: React.FormEvent) => {
    event.preventDefault();
    setIsDataLoading(true);
    const modifiedValues = dnsConfigData.modifiedValues();

    const payload: DnsGlobalConfigPayload = {
      idnsforwarders: modifiedValues.idnsforwarders,
      idnsforwardpolicy: modifiedValues.idnsforwardpolicy,
      idnsallowsyncptr: modifiedValues.idnsallowsyncptr,
    };

    saveConfigInfo(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          dnsConfigData.setDnsConfig(data.result.result);
          alerts.addAlert(
            "success",
            "DNS global configuration updated",
            "success"
          );
        }
        // Reset values. Disable 'revert' and 'save' buttons
        dnsConfigData.refetch();
      }
      setIsDataLoading(false);
    });
  };

  // Modal to update system DNS records
  const [showUpdateSystemDnsRecordsModal, setShowUpdateSystemDnsRecordsModal] =
    React.useState(false);

  const onUpdateSystemDnsRecords = () => {
    updateSystemDnsRecords().then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data && "error" in data && data.error !== null) {
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data && "result" in data) {
          alerts.addAlert("success", "System DNS records updated", "success");
        }
      }
      setShowUpdateSystemDnsRecordsModal(false);
    });
  };

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);
  const onKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };

  const dropdownItems = [
    <DropdownItem
      data-cy="dns-global-config-kebab-update-system-dns-records"
      key="update-system-dns-records"
      onClick={() => setShowUpdateSystemDnsRecordsModal(true)}
      isDisabled={isDataLoading}
    >
      Update system DNS records
    </DropdownItem>,
  ];

  // Toolbar
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="dns-global-config-button-refresh"
          onClick={dnsConfigData.refetch}
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
          data-cy="dns-global-config-button-revert"
          onClick={onRevert}
          isDisabled={!dnsConfigData.modified || isDataLoading}
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
          data-cy="dns-global-config-button-save"
          onClick={onSave}
          isDisabled={!dnsConfigData.modified || isDataLoading}
          form="dns-global-config-form"
          type="submit"
        >
          Save
        </Button>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          dataCy="dns-global-config-kebab"
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={dropdownItems}
          isDisabled={isDataLoading}
        />
      ),
    },
  ];

  // Handling of the API data
  if (
    dnsConfigData.isLoading ||
    !dnsConfigData.dnsConfig ||
    !dnsConfigData.metadata
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the page is not found
  if (
    !dnsConfigData.isLoading &&
    Object.keys(dnsConfigData.dnsConfig).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <PageWithGrayBorderLayout
      id="dns-global-config-page"
      pageTitle="DNS Global Configuration"
      toolbarItems={toolbarItems}
    >
      <>
        <alerts.ManagedAlerts />
        <Sidebar isPanelRight className="pf-v6-u-mb-0">
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
              }
            />
          </SidebarPanel>
          <SidebarContent className="pf-v6-u-mr-xl">
            <Flex>
              <FlexItem>
                <Form id="dns-global-config-form">
                  <FormGroup label="Allow PTR sync" fieldId="idnsallowsyncptr">
                    <IpaCheckbox
                      ipaObject={ipaObject}
                      objectName="dnsconfig"
                      onChange={recordOnChange}
                      text=""
                      name="idnsallowsyncptr"
                      value={String(ipaObject.dnsforwarders)}
                      metadata={dnsConfigData.metadata}
                      dataCy="dns-global-config-checkbox-allow-ptr-sync"
                    />
                  </FormGroup>
                  <FormGroup label="Global forwarders" fieldId="idnsforwarders">
                    <IpaTextboxList
                      dataCy="dns-global-config-textbox-forwarders"
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
                      metadata={dnsConfigData.metadata}
                      objectName="dnsconfig"
                    />
                  </FormGroup>
                  <FormGroup
                    label="IPA DNSSec key master"
                    role="dnssec_key_master_server"
                  >
                    <IpaTextInput
                      dataCy="dns-global-config-textbox-dnssec-key-master"
                      ipaObject={ipaObject}
                      metadata={dnsConfigData.metadata}
                      objectName="dnsconfig"
                      onChange={recordOnChange}
                      name="dnssec_key_master_server"
                      ariaLabel={"IPA DNSSec key master text input"}
                    />
                  </FormGroup>
                  <FormGroup label="IPA DNS servers" role="dns_server_server">
                    <IpaTextInput
                      dataCy="dns-global-config-textbox-dns-servers"
                      ipaObject={ipaObject}
                      metadata={dnsConfigData.metadata}
                      objectName="dnsconfig"
                      onChange={recordOnChange}
                      name="dns_server_server"
                      ariaLabel={"IPA DNS servers text input"}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
        <ModalWithFormLayout
          dataCy="dns-global-config-modal-update-system-dns-records"
          variantType="medium"
          modalPosition="top"
          offPosition="76px"
          title="Confirmation"
          formId="dns-global-config-modal-update-system-dns-records"
          fields={[
            {
              id: "question-text",
              pfComponent: (
                <Content component="p">
                  Are you sure you want to update the system DNS records?
                </Content>
              ),
            },
          ]}
          show={showUpdateSystemDnsRecordsModal}
          onClose={() => setShowUpdateSystemDnsRecordsModal(false)}
          actions={[
            <Button
              variant="primary"
              onClick={onUpdateSystemDnsRecords}
              data-cy="dns-global-config-modal-update-system-dns-records-update"
              key="update"
            >
              Update
            </Button>,
            <Button
              variant="secondary"
              onClick={() => setShowUpdateSystemDnsRecordsModal(false)}
              data-cy="dns-global-config-modal-update-system-dns-records-cancel"
              key="cancel"
            >
              Cancel
            </Button>,
          ]}
        />
      </>
    </PageWithGrayBorderLayout>
  );
};

export default DnsGlobalConfig;
