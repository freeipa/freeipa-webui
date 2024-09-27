import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  PageSectionVariants,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  TextVariants,
} from "@patternfly/react-core";
// Redux
import { useAppSelector } from "src/store/hooks";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import DataSpinner from "src/components/layouts/DataSpinner";
// Components
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { useConfigSettings } from "src/hooks/useConfigSettingsData";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";
import { asRecord } from "../../utils/hostUtils";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Option components
import ConfigSearchOptions from "./ConfigSearchOptions";
import ConfigServerOptions from "./ConfigServerOptions";
import ConfigUserOptions from "./ConfigUserOptions";
import ConfigGroupOptions from "./ConfigGroupOptions";
import ConfigSELinuxOptions from "./ConfigSELinuxOptions";
import ConfigServiceOptions from "./ConfigServiceOptions";
// RPC
import {
  ErrorResult,
  GenericPayload,
  useSearchEntriesMutation,
} from "src/services/rpc";
import { useSaveConfigMutation } from "src/services/rpcConfig";
import { useGettingGroupsQuery } from "src/services/rpcUserGroups";

const Configuration = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({ pathname: "configuration" });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Data loaded from DB
  const configData = useConfigSettings();

  const [groups, setGroups] = React.useState<string[]>([]);

  // Get User groups
  const groupDataResponse = useGettingGroupsQuery({
    searchValue: "",
    sizeLimit: 1000,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: 0,
    stopIdx: 1000,
  } as GenericPayload);

  const { data: batchResponse } = groupDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (groupDataResponse.isFetching) {
      return;
    }

    // API response: Success
    if (
      groupDataResponse.isSuccess &&
      groupDataResponse.data &&
      batchResponse !== undefined
    ) {
      const groupsListResult = batchResponse.result.results;
      const groupsListSize = batchResponse.result.count;
      const groupsList: string[] = [];

      for (let i = 0; i < groupsListSize; i++) {
        groupsList.push(groupsListResult[i].result.cn[0]);
      }
      setGroups(groupsList);
    }
  }, [groupDataResponse]);

  // Issue a search using a specific search value
  const [retrieveGroups] = useSearchEntriesMutation({});

  const submitSearchValue = (value: string) => {
    retrieveGroups({
      searchValue: value,
      sizeLimit: 1000,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: 0,
      stopIdx: 1000,
      entryType: "usergroup",
    } as GenericPayload).then((result) => {
      if ("data" in result) {
        const searchError = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          alerts.addAlert(
            "submit-search-value-error",
            error || "Error when searching for user groups",
            "danger"
          );
        } else {
          // Success
          const groupsListResult = result.data.result.results;
          const groupsListSize = result.data.result.count;
          const groupsList: string[] = [];
          for (let i = 0; i < groupsListSize; i++) {
            groupsList.push(groupsListResult[i].result.cn[0]);
          }
          setGroups(groupsList);
        }
      }
    });
  };

  const [isSaving, setSaving] = useState(false);

  // 'Save' handler method
  const [saveConfig] = useSaveConfigMutation();
  const onSave = () => {
    const modifiedValues = configData.modifiedValues();
    setSaving(true);
    saveConfig(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Configuration updated", "success");
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        onRefresh();
      }
      setSaving(false);
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    configData.setConfig(configData.originalConfig);
    alerts.addAlert("revert-success", "Configuration data reverted", "success");
  };

  const onRefresh = () => {
    configData.refetch();
  };

  if (!configData || configData.isLoading) {
    return <DataSpinner />;
  }

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={onRefresh}>Refresh</SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          isDisabled={!configData.modified}
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
          isDisabled={!configData.modified || isSaving}
          onClickHandler={onSave}
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </SecondaryButton>
      ),
    },
  ];

  const style: React.CSSProperties = {
    overflowY: "auto",
    height: `calc(100vh - 250px)`,
  };

  // Get 'ipaObject' and 'recordOnChange'
  const { ipaObject, recordOnChange } = asRecord(
    configData.config,
    configData.setConfig
  );

  return (
    <>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        <TitleLayout id="config title" headingLevel="h1" text="Configuration" />
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        className="pf-v5-u-m-lg pf-v5-u-p-0"
      >
        <PageSection
          id="settings-page"
          variant={PageSectionVariants.light}
          style={style}
          className="pf-v5-u-mt-0 pf-v5-u-ml-lg pf-v5-u-mr-lg pf-v5-u-pl-0 pf-v5-u-pr-0"
        >
          <Sidebar isPanelRight>
            <SidebarPanel variant="sticky">
              <HelpTextWithIconLayout
                textComponent={TextVariants.p}
                textClassName="pf-v5-u-mb-md"
                subTextComponent={TextVariants.a}
                subTextIsVisitedLink={true}
                textContent="Help"
                icon={
                  <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
                }
              />
              <JumpLinks
                isVertical
                label="Jump to section"
                scrollableSelector="#settings-page"
                offset={220} // for masthead
                expandable={{ default: "expandable", md: "nonExpandable" }}
              >
                <JumpLinksItem key={0} href="#search-options">
                  Search options
                </JumpLinksItem>
                <JumpLinksItem key={1} href="#server-options">
                  Server options
                </JumpLinksItem>
                <JumpLinksItem key={2} href="#user-options">
                  User options
                </JumpLinksItem>
                <JumpLinksItem key={3} href="#group-options">
                  Group options
                </JumpLinksItem>
                <JumpLinksItem key={4} href="#selinux-options">
                  Selinux options
                </JumpLinksItem>
                <JumpLinksItem key={5} href="#service-options">
                  Service options
                </JumpLinksItem>
              </JumpLinks>
            </SidebarPanel>
            <SidebarContent className="pf-v5-u-mr-xl">
              <Flex
                direction={{ default: "column", lg: "row" }}
                flex={{ default: "flex_1" }}
              >
                <FlexItem flex={{ default: "flex_1" }}>
                  <TitleLayout
                    key={0}
                    headingLevel="h2"
                    id="search-options"
                    text="Search options"
                  />
                  <ConfigSearchOptions
                    ipaObject={ipaObject}
                    recordOnChange={recordOnChange}
                    metadata={configData.metadata}
                  />
                </FlexItem>
                <FlexItem flex={{ default: "flex_1" }}>
                  <TitleLayout
                    key={1}
                    headingLevel="h2"
                    id="server-options"
                    text="Server options"
                  />
                  <ConfigServerOptions
                    config={configData.config}
                    ipaObject={ipaObject}
                    recordOnChange={recordOnChange}
                    metadata={configData.metadata}
                  />
                </FlexItem>
              </Flex>
              <Flex
                direction={{ default: "column", lg: "row" }}
                flex={{ default: "flex_1" }}
                className="pf-v5-u-mt-lg"
              >
                <FlexItem flex={{ default: "flex_1" }}>
                  <TitleLayout
                    key={2}
                    headingLevel="h2"
                    id="user-options"
                    text="User options"
                  />
                  <ConfigUserOptions
                    ipaObject={ipaObject}
                    recordOnChange={recordOnChange}
                    metadata={configData.metadata}
                    groups={groups}
                    onSearch={submitSearchValue}
                  />
                </FlexItem>
              </Flex>
              <Flex
                direction={{ default: "column", lg: "row" }}
                flex={{ default: "flex_1" }}
                className="pf-v5-u-mt-lg"
              >
                <FlexItem flex={{ default: "flex_1" }}>
                  <TitleLayout
                    key={3}
                    headingLevel="h2"
                    id="group-options"
                    text="Group options"
                  />
                  <ConfigGroupOptions
                    ipaObject={ipaObject}
                    recordOnChange={recordOnChange}
                    metadata={configData.metadata}
                  />
                </FlexItem>
                <FlexItem flex={{ default: "flex_1" }}>
                  <Flex
                    direction={{ default: "column" }}
                    flex={{ default: "flex_1" }}
                  >
                    <FlexItem flex={{ default: "flex_1" }}>
                      <TitleLayout
                        key={4}
                        headingLevel="h2"
                        id="selinux-options"
                        text="SELinux options"
                      />
                      <ConfigSELinuxOptions
                        ipaObject={ipaObject}
                        recordOnChange={recordOnChange}
                        metadata={configData.metadata}
                      />
                    </FlexItem>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <TitleLayout
                        key={5}
                        headingLevel="h2"
                        id="service-options"
                        text="Service options"
                        className="pf-v5-u-mt-lg"
                      />
                      <ConfigServiceOptions
                        ipaObject={ipaObject}
                        recordOnChange={recordOnChange}
                        metadata={configData.metadata}
                      />
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </SidebarContent>
          </Sidebar>
        </PageSection>
        <ToolbarLayout isSticky toolbarItems={toolbarFields} />
      </PageSection>
    </>
  );
};

export default Configuration;
