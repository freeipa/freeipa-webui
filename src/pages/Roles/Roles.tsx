import React, { useEffect, useState } from "react";
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
import { Role } from "src/utils/datatypes/globalDataTypes";
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
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const Roles = () => {
  const dispatch = useAppDispatch();

  const { browserTitle } = useUpdateRoute({ pathname: "roles" });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const [rolesList, setRolesList] = useState<Role[]>([]);

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

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
    error: batchError,
  } = rolesDataResponse;

  useEffect(() => {
    if (rolesDataResponse.isFetching) {
      setShowTableRows(false);
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    if (
      rolesDataResponse.isSuccess &&
      rolesDataResponse.data &&
      batchResponse !== undefined
    ) {
      const rolesListResult = batchResponse.result.results;
      const totalCount = batchResponse.result.totalCount;
      const rolesListSize = batchResponse.result.count;
      const roles: Role[] = [];

      for (let i = 0; i < rolesListSize; i++) {
        roles.push(rolesListResult[i].result);
      }

      setTotalCount(totalCount);
      setRolesList(roles);
      setShowTableRows(true);
    }

    if (
      !rolesDataResponse.isLoading &&
      rolesDataResponse.isError &&
      rolesDataResponse.error !== undefined
    ) {
      window.location.reload();
    }
  }, [rolesDataResponse]);

  const refreshData = () => {
    setShowTableRows(false);
    setTotalCount(0);
    clearSelectedRoles();
    rolesDataResponse.refetch();
  };

  React.useEffect(() => {
    rolesDataResponse.refetch();
  }, [page, perPage]);

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const clearSelectedRoles = () => {
    setSelectedRoles([]);
  };

  const [searchRoles] = useSearchRolesEntriesMutation({});

  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    setTotalCount(0);
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
        } else {
          const rolesListResult = result.data?.result.results || [];
          const rolesListSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const roles: Role[] = [];

          for (let i = 0; i < rolesListSize; i++) {
            roles.push(rolesListResult[i].result);
          }
          setTotalCount(totalCount);
          setRolesList(roles);
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectableRolesTable = rolesList.filter(isRoleSelectable);

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
    updateShownElementsList: setRolesList,
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
          list={rolesList}
          shownElementsList={rolesList}
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
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={rolesList}
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
                    shownElementsList={rolesList}
                    pk="cn"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="roles"
                    showTableRows={showTableRows}
                    showLink={false}
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
              list={rolesList}
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
        show={showDeleteModal}
        handleModalToggle={() => setShowDeleteModal(!showDeleteModal)}
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
