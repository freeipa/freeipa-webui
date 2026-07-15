import React, { useMemo, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import {
  Privilege,
  SearchDataResultType,
} from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import MainTable from "src/components/tables/MainTable";
// Components
import PaginationLayout from "src/components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddPrivilegeModal from "src/components/modals/PrivilegeModals/AddPrivilegeModal";
import DeletePrivilegesModal from "src/components/modals/PrivilegeModals/DeletePrivilegesModal";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, isPrivilegeSelectable } from "src/utils/utils";
// RPC client
import {
  useGetPrivilegesFullDataQuery,
  useSearchPrivilegesEntriesMutation,
} from "src/services/rpcPrivileges";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const Privileges = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "privileges" });
  useContextualHelpTopic("privileges");

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const privilegesDataResponse = useGetPrivilegesFullDataQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    isFetching,
    error: batchError,
  } = privilegesDataResponse;

  // Search state - overrides query data when active
  const [searchPrivileges, searchResult] = useSearchPrivilegesEntriesMutation(
    {}
  );
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchData, setSearchData] =
    useState<SearchDataResultType<Privilege> | null>(null);

  // Derive privilegesList and totalCount from query response or search results
  const { elementsList, totalCount } = useMemo(() => {
    // If search is active and has results, use search data
    if (isSearchActive && searchData) {
      return {
        elementsList: searchData.elementsList,
        totalCount: searchData.totalCount,
      };
    }

    // Otherwise derive from query response
    if (batchResponse?.result) {
      const privilegesListResult = batchResponse.result.results;
      const privilegesListSize = batchResponse.result.count;
      const privileges: Privilege[] = [];

      for (let i = 0; i < privilegesListSize; i++) {
        privileges.push(privilegesListResult[i].result);
      }

      return {
        elementsList: privileges,
        totalCount: batchResponse.result.totalCount,
      };
    }

    return { elementsList: [], totalCount: 0 };
  }, [batchResponse, isSearchActive, searchData]);

  // Derive showTableRows from loading states
  const showTableRows = useMemo(() => {
    if (isSearchActive) {
      return !searchResult.isLoading;
    }
    return !isFetching && !isBatchLoading;
  }, [isFetching, isBatchLoading, isSearchActive, searchResult.isLoading]);

  // Clear errors when fetching starts
  React.useEffect(() => {
    if (isFetching) {
      globalErrors.clear();
    }
  }, [isFetching]);

  // Handle query errors - add to global errors instead of reloading
  React.useEffect(() => {
    if (
      !isBatchLoading &&
      !isFetching &&
      privilegesDataResponse.isError &&
      privilegesDataResponse.error !== undefined
    ) {
      globalErrors.addError(
        privilegesDataResponse.error,
        "Error loading privileges",
        "privileges-fetch-error"
      );
    }
  }, [privilegesDataResponse.isError, isBatchLoading, isFetching]);

  const refreshData = () => {
    setIsSearchActive(false);
    setSearchData(null);
    clearSelectedPrivileges();
    privilegesDataResponse.refetch();
  };

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const [selectedPrivileges, setSelectedPrivileges] = useState<Privilege[]>([]);

  const clearSelectedPrivileges = () => {
    setSelectedPrivileges([]);
  };

  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const submitSearchValue = () => {
    setPage(1);
    setSearchIsDisabled(true);
    setIsSearchActive(true);

    searchPrivileges({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: 0,
      stopIdx: perPage,
    }).then((result) => {
      if ("data" in result) {
        const searchError = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          dispatch(
            addAlert({
              name: "submit-search-value-error",
              title: error || "Error when searching for privileges",
              variant: "danger",
            })
          );
          setIsSearchActive(false);
          setSearchData(null);
        } else {
          const privilegesListResult = result.data?.result.results || [];
          const privilegesListSize = result.data?.result.count || 0;
          const searchTotalCount = result.data?.result.totalCount || 0;
          const privileges: Privilege[] = [];

          for (let i = 0; i < privilegesListSize; i++) {
            privileges.push(privilegesListResult[i].result);
          }

          setSearchData({
            elementsList: privileges,
            totalCount: searchTotalCount,
          });
        }
        setSearchIsDisabled(false);
      }
    });
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectablePrivilegesTable = elementsList.filter(isPrivilegeSelectable);

  const updateSelectedPrivileges = (
    privileges: Privilege[],
    isSelected: boolean
  ) => {
    let newSelectedPrivileges: Privilege[] = [];
    if (isSelected) {
      newSelectedPrivileges = JSON.parse(JSON.stringify(selectedPrivileges));
      for (let i = 0; i < privileges.length; i++) {
        if (selectedPrivileges.find((s) => s.cn[0] === privileges[i].cn[0])) {
          continue;
        }
        newSelectedPrivileges.push(privileges[i]);
      }
    } else {
      for (let i = 0; i < selectedPrivileges.length; i++) {
        let found = false;
        for (let ii = 0; ii < privileges.length; ii++) {
          if (selectedPrivileges[i].cn[0] === privileges[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelectedPrivileges.push(selectedPrivileges[i]);
        }
      }
    }
    setSelectedPrivileges(newSelectedPrivileges);
    setIsDeleteButtonDisabled(newSelectedPrivileges.length === 0);
  };

  const setPrivilegeSelected = (privilege: Privilege, isSelecting = true) => {
    if (isPrivilegeSelectable(privilege)) {
      updateSelectedPrivileges([privilege], isSelecting);
    }
  };

  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    updateShownElementsList: (privileges: Privilege[]) => {
      if (isSearchActive) {
        setSearchData((prev) =>
          prev
            ? { ...prev, elementsList: privileges }
            : { elementsList: privileges, totalCount: 0 }
        );
      }
    },
    totalCount,
  };

  const bulkSelectorData = {
    selected: selectedPrivileges,
    updateSelected: updateSelectedPrivileges,
    selectableTable: selectablePrivilegesTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  const columnNames = ["Privilege name", "Description"];
  const keyNames = ["cn", "description"];

  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={elementsList}
          shownElementsList={elementsList}
          elementData={bulkSelectorData}
          buttonsData={buttonsData}
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
          ariaLabel="Search privileges"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
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
          onClickHandler={refreshData}
          isDisabled={!showTableRows}
          dataCy="privileges-button-refresh"
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
          onClickHandler={() => setShowDeleteModal(true)}
          dataCy="privileges-button-delete"
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          onClickHandler={() => setShowAddModal(true)}
          isDisabled={!showTableRows}
          dataCy="privileges-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 7,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={elementsList}
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
        <TitleLayout
          id="privileges-title"
          headingLevel="h1"
          text="Privileges"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto" }}>
            <OuterScrollContainer>
              <InnerScrollContainer
                style={{ height: "60vh", overflow: "auto" }}
              >
                {batchError !== undefined && batchError ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    tableTitle="Privileges table"
                    shownElementsList={elementsList}
                    pk="cn"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="privileges"
                    showTableRows={showTableRows}
                    showLink={true}
                    elementsData={{
                      isElementSelectable: isPrivilegeSelectable,
                      selectedElements: selectedPrivileges,
                      selectableElementsTable: selectablePrivilegesTable,
                      setElementsSelected: setPrivilegeSelected,
                      clearSelectedElements: clearSelectedPrivileges,
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
                      isDeletion,
                      updateIsDeletion: setIsDeletion,
                    }}
                    paginationData={{
                      selectedPerPage,
                      updateSelectedPerPage: setSelectedPerPage,
                    }}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={elementsList}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddPrivilegeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add privilege"
        onRefresh={refreshData}
      />
      <DeletePrivilegesModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedPrivileges}
        clearSelectedElements={clearSelectedPrivileges}
        columnNames={columnNames}
        keyNames={keyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="privileges-modal-error"
      />
    </div>
  );
};

export default Privileges;
