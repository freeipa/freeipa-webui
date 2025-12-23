import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { Trust, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Utils
import { asRecord } from "src/utils/trustsUtils";
// RPC
import { TrustModPayload, useTrustModMutation } from "src/services/rpcTrusts";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaTextboxList from "src/components/Form/IpaTextboxList";
import TitleLayout from "src/components/layouts/TitleLayout";
// Redux
import { addAlert } from "src/store/Global/alerts-slice";
import { useAppDispatch } from "src/store/hooks";

interface TrustsSettingsProps {
  trust: Partial<Trust>;
  originalTrust: Partial<Trust>;
  metadata: Metadata;
  onTrustChange: (trust: Partial<Trust>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading: boolean;
  modifiedValues: () => Partial<Trust>;
  onResetValues: () => void;
  pathname: string;
}

const TrustsSettings = (props: TrustsSettingsProps) => {
  // Alerts to show in the UI
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // API calls
  const [saveTrust] = useTrustModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onTrustChange(props.originalTrust);
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Trust data reverted",
        variant: "success",
      })
    );
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<Trust>,
    keyArray: string[]
  ): TrustModPayload => {
    const payload: TrustModPayload = { cn: props.trust.cn || "" };

    keyArray.forEach((key) => {
      payload[key] = modifiedValues[key];
    });
    return payload;
  };

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.trust,
    props.onTrustChange
  );

  // 'Save' handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    const payload = buildPayload(modifiedValues, [
      "ipantadditionalsuffixes",
      "ipantsidblacklistincoming",
      "ipantsidblacklistoutgoing",
    ]);

    saveTrust(payload)
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
            props.onTrustChange(data.result.result);
            dispatch(
              addAlert({
                name: "save-success",
                title: "Trust data updated",
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
        <SecondaryButton
          dataCy="trusts-tab-settings-button-refresh"
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
          dataCy="trusts-tab-settings-button-revert"
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
          dataCy="trusts-tab-settings-button-save"
          isDisabled={!props.isModified || isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
  ];

  // Return component
  return (
    <TabLayout
      id="settings-page"
      toolbarItems={toolbarFields}
      dataCy="trusts-settings"
    >
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout textContent="Help" />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            expandable={{ default: "expandable", md: "nonExpandable" }}
          >
            <JumpLinksItem key={0} href="#trusts-settings">
              Trusts settings
            </JumpLinksItem>
            <JumpLinksItem key={1} href="#alternative-upn-suffixes">
              Alternative UPN suffixes
            </JumpLinksItem>
            <JumpLinksItem key={2} href="#sid-blocklists">
              SID blocklists
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <FlexItem flex={{ default: "flex_1" }}>
              <TitleLayout
                key={0}
                headingLevel="h2"
                id="trusts-settings"
                text="Trusts settings"
              />
              <Form isHorizontal>
                <FormGroup label="Realm Name" fieldId="cn" role="group">
                  <IpaTextInput
                    dataCy="trusts-tab-settings-input-realm-name"
                    name="cn"
                    objectName="trust"
                    metadata={props.metadata}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                  />
                </FormGroup>
                <FormGroup
                  label="Domain NetBIOS name"
                  fieldId="ipandomainnetbiosname"
                  role="group"
                >
                  <IpaTextInput
                    dataCy="trusts-tab-settings-input-domain-netbios-name"
                    name="ipandomainnetbiosname"
                    objectName="trust"
                    metadata={props.metadata}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                  />
                </FormGroup>
                <FormGroup label="Trust Type" fieldId="trusttype" role="group">
                  <IpaTextInput
                    dataCy="trusts-tab-settings-input-trust-type"
                    name="trusttype"
                    objectName="trust"
                    metadata={props.metadata}
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                  />
                </FormGroup>
              </Form>
            </FlexItem>
            <FlexItem flex={{ default: "flex_1" }}>
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="alternative-upn-suffixes"
                text="Alternative UPN suffixes"
              />
              <Form isHorizontal>
                <FormGroup
                  label="Alternative UPN suffixes"
                  fieldId="ipantadditionalsuffixes"
                  role="group"
                >
                  <IpaTextboxList
                    dataCy="trusts-tab-settings-textbox-alternative-upn-suffixes"
                    name="ipantadditionalsuffixes"
                    ipaObject={ipaObject}
                    setIpaObject={recordOnChange}
                    ariaLabel="Alternative UPN suffixes list"
                  />
                </FormGroup>
                <TitleLayout
                  key={2}
                  headingLevel="h2"
                  id="sid-blocklists"
                  text="SID blocklists"
                />
                <FormGroup
                  label="SID blocklists incoming"
                  fieldId="ipantsidblocklistincoming"
                  role="group"
                >
                  <IpaTextboxList
                    dataCy="trusts-tab-settings-textbox-sid-blocklists"
                    name="ipantsidblocklistincoming"
                    ipaObject={ipaObject}
                    setIpaObject={recordOnChange}
                    ariaLabel="SID blocklists incoming list"
                  />
                </FormGroup>
                <FormGroup
                  label="SID blocklists outgoing"
                  fieldId="ipantsidblocklistoutgoing"
                  role="group"
                >
                  <IpaTextboxList
                    dataCy="trusts-tab-settings-textbox-sid-blocklists-outgoing"
                    name="ipantsidblocklistoutgoing"
                    ipaObject={ipaObject}
                    setIpaObject={recordOnChange}
                    ariaLabel="SID blocklists outgoing list"
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

export default TrustsSettings;
