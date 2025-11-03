import React from "react";
// PatternFly
import {
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { DNSRecord, Host, Metadata } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  useModDnsRecordMutation,
  ModDnsRecordPayload,
} from "src/services/rpcDnsZones";
// Utils
import { dnsRecordAsRecord } from "src/utils/dnsRecordUtils";
// Components
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import PageWithGrayBorderLayout from "src/components/layouts/PageWithGrayBorderLayout";
import IpaNumberInput from "src/components/Form/IpaNumberInput/IpaNumberInput";
import StandardRecordTypes from "src/components/DnsRecordsSections/StandardRecordTypes";
import OtherRecordTypes from "src/components/DnsRecordsSections/OtherRecordTypes";

interface DnsResourceRecordsSettingsProps {
  idnsname: string;
  recordName: string;
  dnsRecord: Partial<DNSRecord>;
  originalDnsRecord: Partial<DNSRecord>;
  host: Partial<Host>;
  originalHost: Partial<Host>;
  metadata: Metadata;
  onDnsRecordChange: (dnsRecord: Partial<DNSRecord>) => void;
  onHostChange: (host: Partial<Host>) => void;
  isModified: boolean;
  isDataLoading: boolean;
  modifiedValues: () => Partial<DNSRecord>;
  onResetValues: () => void;
  pathname: string;
  onRefresh: () => void;
  breadcrumbItems: BreadCrumbItem[];
}

const DnsResourceRecordsSettings = (props: DnsResourceRecordsSettingsProps) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // RPC calls
  const [saveDnsRecord] = useModDnsRecordMutation();

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = dnsRecordAsRecord(
    props.dnsRecord,
    props.onDnsRecordChange
  );

  // 'Revert' handler method
  const onRevert = () => {
    props.onDnsRecordChange(props.originalDnsRecord);
    props.onHostChange(props.originalHost);
    props.onResetValues();
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "DNS record data reverted",
        variant: "success",
      })
    );
  };

  // Refresh handler - let parent handle the loading state
  const onRefresh = () => {
    props.onRefresh();
  };

  // on save handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();

    const payload: ModDnsRecordPayload = {
      dnsZoneId: props.idnsname as string,
      recordName: props.recordName as string,
      dnsttl: modifiedValues.dnsttl as number,
    };
    saveDnsRecord(payload).then((response) => {
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
          dispatch(
            addAlert({
              name: "success",
              title: "DNS record data saved",
              variant: "success",
            })
          );
          // Update local state and trigger parent refresh to get latest data
          props.onDnsRecordChange(data.result.result);
          props.onRefresh();
        }
      }
    });
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="dns-zones-tab-settings-button-refresh"
          onClickHandler={onRefresh}
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
          isDisabled={!props.isModified || props.isDataLoading}
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
          isDisabled={!props.isModified || props.isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
  ];

  // Render component
  return (
    <>
      <PageWithGrayBorderLayout
        id="dns-resource-records-settings-page"
        pageTitle="DNS Resource Record Settings"
        toolbarItems={toolbarFields}
        breadcrumbItems={props.breadcrumbItems}
      >
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
            <TitleLayout
              id="identity-settings"
              text="Identity Settings"
              headingLevel="h1"
              className="pf-v5-u-mb-lg"
            />
            <Form className="pf-v5-u-mb-lg" isHorizontal>
              <FormGroup label="Record name" role="idnsname">
                <TextInput
                  data-cy="dns-zones-tab-settings-textbox-idnsname"
                  name={"idnsname"}
                  aria-label={"Record name text input"}
                  value={props.recordName}
                  readOnlyVariant="plain"
                />
              </FormGroup>
            </Form>
            <TitleLayout
              id="record-settings"
              text="Record Settings"
              headingLevel="h1"
              className="pf-v5-u-mb-lg"
            />
            <Form className="pf-v5-u-mb-xl" isHorizontal>
              <FormGroup label="Time to live (seconds)" role="dnsttl">
                <IpaNumberInput
                  dataCy="dns-zones-tab-settings-textbox-dnsttl"
                  name={"dnsttl"}
                  aria-label={"Time to live in seconds text input"}
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="dnsrecord"
                  metadata={props.metadata}
                  numCharsShown={10}
                  maxValue={2147483647}
                />
              </FormGroup>
            </Form>
            <TitleLayout
              id="standard-record-types"
              text="Standard Record Types"
              headingLevel="h1"
              className="pf-v5-u-mb-lg"
            />
            <StandardRecordTypes
              idnsname={props.idnsname}
              recordName={props.recordName}
              isDataLoading={props.isDataLoading}
              onRefresh={onRefresh}
              dnsRecords={props.dnsRecord.dnsrecords || []}
            />
            <TitleLayout
              id="other-record-types"
              text="Other Record Types"
              headingLevel="h1"
              className="pf-v5-u-mb-lg pf-v5-u-mt-xl"
            />
            <OtherRecordTypes
              idnsname={props.idnsname}
              recordName={props.recordName}
              isDataLoading={props.isDataLoading}
              onRefresh={onRefresh}
              dnsRecords={props.dnsRecord.dnsrecords || []}
            />
          </SidebarContent>
        </Sidebar>
      </PageWithGrayBorderLayout>
    </>
  );
};

export default DnsResourceRecordsSettings;
