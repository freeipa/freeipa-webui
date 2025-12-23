import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Sidebar,
  SidebarPanel,
  SidebarContent,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import DataSpinner from "src/components/layouts/DataSpinner";
// Components
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { useConfigSettings } from "src/hooks/useConfigSettingsData";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";
import { asRecord } from "../../utils/hostUtils";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
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
  const dispatch = useAppDispatch();

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
        const searchError = result.data?.error as
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
          dispatch(
            addAlert({
              name: "submit-search-value-error",
              title: error || "Error when searching for user groups",
              variant: "danger",
            })
          );
        } else {
          // Success
          const groupsListResult = result.data?.result.results || [];
          const groupsListSize = result.data?.result.count || 0;
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
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "Configuration updated",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "save-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
        onRefresh();
      }
      setSaving(false);
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    configData.setConfig(configData.originalConfig);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Configuration data reverted",
        variant: "success",
      })
    );
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
        <SecondaryButton
          dataCy="configuration-button-refresh"
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
          dataCy="configuration-button-revert"
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
          dataCy="configuration-button-save"
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
    height: "64.6vh",
  };

  // Get 'ipaObject' and 'recordOnChange'
  const { ipaObject, recordOnChange } = asRecord(
    configData.config,
    configData.setConfig
  );

  return (
    <>
      <PageSection hasBodyWrapper={false} isFilled>
        <TitleLayout id="config title" headingLevel="h1" text="Configuration" />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        id="settings-page"
        style={style}
        isFilled
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
          <SidebarContent className="pf-v6-u-mr-xl">
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
              className="pf-v6-u-mt-lg"
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
              className="pf-v6-u-mt-lg"
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
                      className="pf-v6-u-mt-lg"
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
      <ToolbarLayout
        isSticky
        toolbarItems={toolbarFields}
        className="pf-v6-u-ml-lg"
      />
    </>
  );
};

export default Configuration;
