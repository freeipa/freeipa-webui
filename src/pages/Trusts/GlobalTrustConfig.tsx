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
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { useTrustsConfigData } from "src/hooks/useTrustsConfigData";
// RPC
import {
  GlobalTrustConfigPayload,
  useGlobalTrustConfigModMutation,
} from "src/services/rpcTrusts";
// Utils
import { globalTrustConfigAsRecord } from "src/utils/trustsConfigUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import DataSpinner from "src/components/layouts/DataSpinner";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PageWithGrayBorderLayout from "src/components/layouts/PageWithGrayBorderLayout";
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaSelect from "src/components/Form/IpaSelect";

const GlobalTrustConfig = () => {
  const dispatch = useAppDispatch();

  // API calls
  const trustsConfigData = useTrustsConfigData();
  const [saveConfigInfo] = useGlobalTrustConfigModMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "trusts-config",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = globalTrustConfigAsRecord(
    trustsConfigData.globalTrustConfig,
    trustsConfigData.setGlobalTrustConfig
  );

  // Get 'userGroups' options for 'IpaSelect'
  const userGroupsOptions = trustsConfigData.userGroups.map((group) =>
    group.cn.toString()
  );

  // 'Revert' handler method
  const onRevert = () => {
    trustsConfigData.setGlobalTrustConfig(
      trustsConfigData.originalGlobalTrustConfig
    );
    trustsConfigData.refetch();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Global trust configuration data reverted",
        variant: "success",
      })
    );
  };

  // on Save handler method
  const onSave = (event: React.FormEvent) => {
    event.preventDefault();
    setIsDataLoading(true);
    const modifiedValues = trustsConfigData.modifiedValues();

    if (modifiedValues.ipantfallbackprimarygroup !== undefined) {
      const payload: GlobalTrustConfigPayload = {
        ipantfallbackprimarygroup: modifiedValues.ipantfallbackprimarygroup,
      };

      saveConfigInfo(payload)
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
              trustsConfigData.setGlobalTrustConfig(data.result.result);
              dispatch(
                addAlert({
                  name: "success",
                  title: "Global trust configuration updated",
                  variant: "success",
                })
              );
            }
            // Reset values. Disable 'revert' and 'save' buttons
            trustsConfigData.refetch();
          }
        })
        .finally(() => {
          setIsDataLoading(false);
        });
    }
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="trusts-global-config-button-refresh"
          onClick={trustsConfigData.refetch}
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
          data-cy="trusts-global-config-button-revert"
          onClick={onRevert}
          isDisabled={!trustsConfigData.modified || isDataLoading}
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
          data-cy="trusts-global-config-button-save"
          onClick={onSave}
          isDisabled={!trustsConfigData.modified || isDataLoading}
          form="trusts-global-config-form"
          type="submit"
        >
          Save
        </Button>
      ),
    },
  ];

  // Handling of the API data
  if (
    trustsConfigData.isLoading ||
    !trustsConfigData.globalTrustConfig ||
    !trustsConfigData.metadata
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the page is not found
  if (
    !trustsConfigData.isLoading &&
    Object.keys(trustsConfigData.globalTrustConfig).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <PageWithGrayBorderLayout
      id="trusts-global-config-page"
      pageTitle="Global Trust Configuration"
      toolbarItems={toolbarFields}
    >
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
          <Flex direction={{ default: "column", lg: "row" }}>
            <FlexItem flex={{ default: "flex_1" }}>
              <Form id="trusts-global-config-form">
                <FormGroup label="Domain" fieldId="cn">
                  <IpaTextInput
                    dataCy="trusts-global-config-textbox-domain"
                    ariaLabel="Domain text input"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="cn"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                  />
                </FormGroup>
                <FormGroup
                  label="Security Identifier"
                  fieldId="ipantsecurityidentifier"
                >
                  <IpaTextInput
                    dataCy="trusts-global-config-textbox-security-identifier"
                    ariaLabel="Security Identifier text input"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="ipantsecurityidentifier"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                  />
                </FormGroup>
                <FormGroup label="NetBIOS name" fieldId="ipantflatname">
                  <IpaTextInput
                    dataCy="trusts-global-config-textbox-netbios-name"
                    ariaLabel="NetBIOS name text input"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="ipantflatname"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                  />
                </FormGroup>
                <FormGroup label="Domain GUID" fieldId="ipantdomainguid">
                  <IpaTextInput
                    dataCy="trusts-global-config-textbox-domain-guid"
                    ariaLabel="Domain GUID text input"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="ipantdomainguid"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                  />
                </FormGroup>
              </Form>
            </FlexItem>
            <FlexItem flex={{ default: "flex_1" }}>
              <Form>
                <FormGroup
                  label="Fallback primary group"
                  fieldId="ipantfallbackprimarygroup"
                  isRequired
                >
                  <IpaSelect
                    dataCy="trusts-global-config-select-fallback-primary-group"
                    ariaLabel="Fallback primary group select"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="ipantfallbackprimarygroup"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                    options={userGroupsOptions}
                    defaultValue={"Default SMB Group"}
                  />
                </FormGroup>
                <FormGroup
                  label="IPA AD trust agents"
                  fieldId="ad_trust_agent_server"
                >
                  <IpaTextInput
                    dataCy="trusts-global-config-textbox-list-ipa-ad-trust-agents"
                    ariaLabel="IPA AD trust agents text input"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="ad_trust_agent_server"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                  />
                </FormGroup>
                <FormGroup
                  label="IPA AD trust controllers"
                  fieldId="ad_trust_controller_server"
                >
                  <IpaTextInput
                    dataCy="trusts-global-config-textbox-list-ipa-ad-trust-controllers"
                    ariaLabel="IPA AD trust controllers text input"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    name="ad_trust_controller_server"
                    metadata={trustsConfigData.metadata}
                    objectName="trustconfig"
                  />
                </FormGroup>
              </Form>
            </FlexItem>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </PageWithGrayBorderLayout>
  );
};

export default GlobalTrustConfig;
