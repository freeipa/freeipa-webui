import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { OtpToken } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// RPC
import {
  useGetOtpTokensFullDataQuery,
  useSearchOtpTokensEntriesMutation,
} from "src/services/rpcOtpTokens";
// Utils
import { isOtpTokenSelectable } from "src/utils/utils";
import { apiToOtpToken } from "src/utils/otpTokensUtils";
// Components
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import GlobalErrors from "src/components/errors/GlobalErrors";
import MainTable from "src/components/tables/MainTable";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import AddOtpToken from "src/components/modals/UserModals/AddOtpToken";
import DeleteOtpTokensModal from "./DeleteOtpTokensModal";
import EnableDisableOtpTokensModal from "./EnableDisableOtpTokensModal";

const OtpTokens = () => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "otp-tokens",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // States
  const [otpTokens, setOtpTokens] = React.useState<OtpToken[]>([]);
  const [isSearchDisabled, setIsSearchDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const otpTokensResponse = useGetOtpTokensFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isLoading, error } = otpTokensResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (otpTokensResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Error
    if (otpTokensResponse.isError) {
      globalErrors.addError(
        error,
        "Error when fetching OTP tokens",
        "otp-tokens-fetch-error"
      );
      return;
    }

    // API response: Success
    if (
      otpTokensResponse.isSuccess &&
      otpTokensResponse.data &&
      data !== undefined
    ) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: OtpToken[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToOtpToken(listResult[i].result));
      }

      setOtpTokens(elementsList);
      setTotalCount(otpTokensResponse.data.result.totalCount);
      // Show table elements
      setShowTableRows(true);
    }
  }, [otpTokensResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<OtpToken[]>(
    []
  );
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    otpTokensResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // 'Enable' button state
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    React.useState<boolean>(true);

  // 'Disable' button state
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    React.useState<boolean>(true);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableOtpTokensTable = otpTokens.filter(isOtpTokenSelectable);

  // - Manage the selected elements in the table (add/remove)
  const updateSelectedOtpTokens = (
    otpTokens: OtpToken[],
    isSelected: boolean
  ) => {
    let newSelectedOtpTokens: OtpToken[] = [];
    if (isSelected) {
      newSelectedOtpTokens = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < otpTokens.length; i++) {
        if (
          selectedElements.find(
            (selectedOtpToken) =>
              selectedOtpToken.ipatokenuniqueid ===
              otpTokens[i].ipatokenuniqueid
          )
        ) {
          continue;
        }
        newSelectedOtpTokens.push(otpTokens[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < otpTokens.length; ii++) {
          if (
            selectedElements[i].ipatokenuniqueid ===
            otpTokens[ii].ipatokenuniqueid
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedOtpTokens.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedOtpTokens);
    setIsDeleteButtonDisabled(newSelectedOtpTokens.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setOtpTokensSelected = (otpToken: OtpToken, isSelecting = true) => {
    if (isOtpTokenSelectable(otpToken)) {
      updateSelectedOtpTokens([otpToken], isSelecting);
    }
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState<boolean>(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    setShowTableRows(!isLoading);
  }, [isLoading]);

  // Search API call
  const [searchEntry] = useSearchOtpTokensEntriesMutation();

  const submitSearchValue = () => {
    setPage(1);
    setSearchValue(searchValue);
    setIsSearchDisabled(true);
    searchEntry({
      searchValue: searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 100, // Search will consider a max. of elements
    }).then((result) => {
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
              title: error || "Error when searching for OTP tokens",
              variant: "danger",
            })
          );
        } else {
          // Success
          const otpTokens = result.data?.result || [];
          setTotalCount(result.data?.totalCount || otpTokens.length);
          setOtpTokens(otpTokens);
          setShowTableRows(true);
        }
        setIsSearchDisabled(false);
      }
    });
  };

  // Data wrappers
  // TODO: Better separation of concerts
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    updateShownElementsList: setOtpTokens,
    totalCount,
  };

  // - 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedOtpTokens,
    selectableTable: selectableOtpTokensTable,
    nameAttr: "ipatokenuniqueid",
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showEnableDisableModal, setShowEnableDisableModal] =
    React.useState<boolean>(false);
  const [operation, setOperation] = React.useState<"enable" | "disable">(
    "disable"
  );

  const onEnableOperation = () => {
    setOperation("enable");
    setShowEnableDisableModal(true);
  };

  const onDisableOperation = () => {
    setOperation("disable");
    setShowEnableDisableModal(true);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={otpTokens}
          shownElementsList={otpTokens}
          elementData={bulkSelectorData}
          buttonsData={{
            updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
          }}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search OTP tokens"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={isSearchDisabled}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          dataCy="otp-tokens-button-refresh"
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          dataCy="otp-tokens-button-delete"
          onClickHandler={() => setShowDeleteModal(true)}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows}
          dataCy="otp-tokens-button-add"
          onClickHandler={() => setShowAddModal(true)}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={isEnableButtonDisabled || !showTableRows}
          dataCy="otp-tokens-button-enable"
          onClickHandler={onEnableOperation}
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          isDisabled={isDisableButtonDisabled || !showTableRows}
          dataCy="otp-tokens-button-disable"
          onClickHandler={onDisableOperation}
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 8,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 9,
      element: (
        <PaginationLayout
          list={otpTokens}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout id="otp-tokens page" headingLevel="h1" text="OTP tokens" />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto" }}>
            <OuterScrollContainer>
              <InnerScrollContainer
                style={{ height: "55vh", overflow: "auto" }}
              >
                {error !== undefined && error ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    tableTitle="OTP tokens table"
                    shownElementsList={otpTokens}
                    pk="ipatokenuniqueid"
                    keyNames={[
                      "ipatokenuniqueid",
                      "ipatokenowner",
                      "ipatokendisabled",
                      "description",
                    ]}
                    columnNames={[
                      "Token unique ID",
                      "Owner",
                      "Status",
                      "Description",
                    ]}
                    hasCheckboxes={true}
                    pathname="otp-tokens"
                    showTableRows={showTableRows}
                    showLink={false}
                    elementsData={{
                      isElementSelectable: isOtpTokenSelectable,
                      selectedElements,
                      selectableElementsTable: selectableOtpTokensTable,
                      setElementsSelected: setOtpTokensSelected,
                      clearSelectedElements: () => setSelectedElements([]),
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: (value) =>
                        setIsDeleteButtonDisabled(value),
                      isDeletion,
                      updateIsDeletion: (value) => setIsDeletion(value),
                      updateIsEnableButtonDisabled: (value) =>
                        setIsEnableButtonDisabled(value),
                      updateIsDisableButtonDisabled: (value) =>
                        setIsDisableButtonDisabled(value),
                      isDisableEnableOp: true,
                    }}
                    paginationData={{
                      selectedPerPage,
                      updateSelectedPerPage: setSelectedPerPage,
                    }}
                    statusElementName="ipatokendisabled"
                    invertStatusValue={true}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={otpTokens}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddOtpToken
        uid={undefined}
        isOpen={showAddModal}
        setIsOpen={setShowAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={refreshData}
      />
      <DeleteOtpTokensModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        columnNames={["Unique ID", "Owner", "Description"]}
        keyNames={["ipatokenuniqueid", "ipatokenowner", "description"]}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <EnableDisableOtpTokensModal
        isOpen={showEnableDisableModal}
        onClose={() => setShowEnableDisableModal(false)}
        elementsList={selectedElements.map(
          (element) => element.ipatokenuniqueid
        )}
        setElementsList={setSelectedElements}
        operation={operation}
        setShowTableRows={setShowTableRows}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default OtpTokens;
