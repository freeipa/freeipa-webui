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
  Role,
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
import AddRoleModal from "src/components/modals/RoleModals/AddRoleModal";
import DeleteRolesModal from "src/components/modals/RoleModals/DeleteRolesModal";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Utils
import { API_VERSION_BACKUP, isRoleSelectable } from "src/utils/utils";
// RPC client
import { GenericPayload } from "src/services/rpc";
import {
  useGettingRolesQuery,
  useSearchRolesEntriesMutation,
} from "src/services/rpcRoles";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const Roles = () => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("roles");

  const { browserTitle } = useUpdateRoute({ pathname: "roles" });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const rolesDataResponse = useGettingRolesQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    isFetching,
    error: batchError,
  } = rolesDataResponse;

  // Search state - overrides query data when active
  const [searchRoles, searchResult] = useSearchRolesEntriesMutation({});
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchData, setSearchData] =
    useState<SearchDataResultType<Role> | null>(null);

  // Derive rolesList and totalCount from query response or search results
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
      const rolesListResult = batchResponse.result.results;
      const rolesListSize = batchResponse.result.count;
      const roles: Role[] = [];

      for (let i = 0; i < rolesListSize; i++) {
        roles.push(rolesListResult[i].result);
      }

      return {
        elementsList: roles,
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

  // Handle query errors
  React.useEffect(() => {
    if (
      !isBatchLoading &&
      !isFetching &&
      rolesDataResponse.isError &&
      rolesDataResponse.error !== undefined
    ) {
      window.location.reload();
    }
  }, [rolesDataResponse.isError, isBatchLoading, isFetching]);

  const refreshData = () => {
    setIsSearchActive(false);
    setSearchData(null);
    clearSelectedRoles();
    rolesDataResponse.refetch();
  };

  React.useEffect(() => {
    if (!isSearchActive) {
      rolesDataResponse.refetch();
    }
  }, [page, perPage]);

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const clearSelectedRoles = () => {
    setSelectedRoles([]);
  };

  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  const submitSearchValue = () => {
    setSearchIsDisabled(true);
    setIsSearchActive(true);

    searchRoles({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstIdx,
      stopIdx: lastIdx,
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
              title: error || "Error when searching for roles",
              variant: "danger",
            })
          );
          setIsSearchActive(false);
          setSearchData(null);
        } else {
          const rolesListResult = result.data?.result.results || [];
          const rolesListSize = result.data?.result.count || 0;
          const searchTotalCount = result.data?.result.totalCount || 0;
          const roles: Role[] = [];

          for (let i = 0; i < rolesListSize; i++) {
            roles.push(rolesListResult[i].result);
          }

          setSearchData({
            elementsList: roles,
            totalCount: searchTotalCount,
          });
        }
        setSearchIsDisabled(false);
      }
    });
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectableRolesTable = elementsList.filter(isRoleSelectable);

  const updateSelectedRoles = (roles: Role[], isSelected: boolean) => {
    let newSelectedRoles: Role[] = [];
    if (isSelected) {
      newSelectedRoles = JSON.parse(JSON.stringify(selectedRoles));
      for (let i = 0; i < roles.length; i++) {
        if (selectedRoles.find((s) => s.cn[0] === roles[i].cn[0])) {
          continue;
        }
        newSelectedRoles.push(roles[i]);
      }
    } else {
      for (let i = 0; i < selectedRoles.length; i++) {
        let found = false;
        for (let ii = 0; ii < roles.length; ii++) {
          if (selectedRoles[i].cn[0] === roles[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelectedRoles.push(selectedRoles[i]);
        }
      }
    }
    setSelectedRoles(newSelectedRoles);
    setIsDeleteButtonDisabled(newSelectedRoles.length === 0);
  };

  const setRoleSelected = (role: Role, isSelecting = true) => {
    if (isRoleSelectable(role)) {
      updateSelectedRoles([role], isSelecting);
    }
  };

  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    updateShownElementsList: (roles: Role[]) => {
      if (isSearchActive) {
        setSearchData((prev) =>
          prev
            ? { ...prev, elementsList: roles }
            : { elementsList: roles, totalCount: 0 }
        );
      }
    },
    totalCount,
  };

  const bulkSelectorData = {
    selected: selectedRoles,
    updateSelected: updateSelectedRoles,
    selectableTable: selectableRolesTable,
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

  const columnNames = ["Role name", "Description"];
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
          ariaLabel="Search roles"
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
          dataCy="roles-button-refresh"
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
          dataCy="roles-button-delete"
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
          dataCy="roles-button-add"
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
        <TitleLayout id="roles-title" headingLevel="h1" text="Roles" />
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
                    tableTitle="Roles table"
                    shownElementsList={elementsList}
                    pk="cn"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="roles"
                    showTableRows={showTableRows}
                    showLink={true}
                    elementsData={{
                      isElementSelectable: isRoleSelectable,
                      selectedElements: selectedRoles,
                      selectableElementsTable: selectableRolesTable,
                      setElementsSelected: setRoleSelected,
                      clearSelectedElements: clearSelectedRoles,
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
      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add role"
        onRefresh={refreshData}
      />
      <DeleteRolesModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedRoles}
        clearSelectedElements={clearSelectedRoles}
        columnNames={columnNames}
        keyNames={keyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <ModalErrors errors={modalErrors.getAll()} dataCy="roles-modal-error" />
    </div>
  );
};

export default Roles;
