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
import { Permission } from "src/utils/datatypes/globalDataTypes";
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
import AddPermissionModal from "src/components/modals/PermissionModals/AddPermissionModal";
import DeletePermissionsModal from "src/components/modals/PermissionModals/DeletePermissionsModal";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, isPermissionSelectable } from "src/utils/utils";
// RPC client
import { useGetPermissionsFullDataQuery } from "src/services/rpcPermissions";
// Errors
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
import { apiToPermission } from "src/utils/permissionsUtils";

const Permissions = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "permissions" });
  useContextualHelpTopic("permissions");

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, perPage, searchValue } = useListPageSearchParams();

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const permissionsDataResponse = useGetPermissionsFullDataQuery({
    searchValue,
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
  } = permissionsDataResponse;

  // Derive elementsList and totalCount from query response or search results
  const { elementsList, totalCount } = useMemo(() => {
    // Otherwise derive from query response
    if (batchResponse?.result) {
      const permissionsListResult = batchResponse.result.results;
      const permissionsListSize = batchResponse.result.count;
      const permissions: Permission[] = [];

      for (let i = 0; i < permissionsListSize; i++) {
        permissions.push(apiToPermission(permissionsListResult[i].result));
      }

      return {
        elementsList: permissions,
        totalCount: batchResponse.result.totalCount,
      };
    }

    return { elementsList: [], totalCount: 0 };
  }, [batchResponse]);

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
      permissionsDataResponse.isError &&
      permissionsDataResponse.error !== undefined
    ) {
      globalErrors.addError(
        permissionsDataResponse.error,
        "Error loading permissions",
        "permissions-fetch-error"
      );
    }
  }, [permissionsDataResponse.isError, isBatchLoading, isFetching]);

  const refreshData = () => {
    clearSelectedPermissions();
    permissionsDataResponse.refetch();
  };

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );

  const clearSelectedPermissions = () => {
    setSelectedPermissions([]);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectablePermissionsTable = elementsList.filter(
    isPermissionSelectable
  );

  const updateSelectedPermissions = (
    permissions: Permission[],
    isSelected: boolean
  ) => {
    let newSelectedPermissions: Permission[] = [];
    if (isSelected) {
      newSelectedPermissions = JSON.parse(JSON.stringify(selectedPermissions));
      for (let i = 0; i < permissions.length; i++) {
        if (selectedPermissions.find((s) => s.cn === permissions[i].cn)) {
          continue;
        }
        newSelectedPermissions.push(permissions[i]);
      }
    } else {
      for (let i = 0; i < selectedPermissions.length; i++) {
        let found = false;
        for (let ii = 0; ii < permissions.length; ii++) {
          if (selectedPermissions[i].cn === permissions[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelectedPermissions.push(selectedPermissions[i]);
        }
      }
    }
    setSelectedPermissions(newSelectedPermissions);
    setIsDeleteButtonDisabled(newSelectedPermissions.length === 0);
  };

  const setPermissionSelected = (
    permission: Permission,
    isSelecting = true
  ) => {
    if (isPermissionSelectable(permission)) {
      updateSelectedPermissions([permission], isSelecting);
    }
  };

  const bulkSelectorData = {
    selected: selectedPermissions,
    updateSelected: updateSelectedPermissions,
    selectableTable: selectablePermissionsTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  const columnNames = ["Permission name", "Granted rights"];
  const keyNames = ["cn", "ipapermright"];

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
          ariaLabel="Search permissions"
          placeholder="Search"
          isDisabled={isFetching}
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
          isDisabled={isFetching}
          dataCy="permissions-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || isFetching}
          onClickHandler={() => setShowDeleteModal(true)}
          dataCy="permissions-button-delete"
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
          isDisabled={isFetching}
          dataCy="permissions-button-add"
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
          totalCount={totalCount}
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
          id="permissions-title"
          headingLevel="h1"
          text="Permissions"
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
                    tableTitle="Permissions table"
                    shownElementsList={elementsList}
                    pk="cn"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="permissions"
                    showTableRows={!isFetching}
                    showLink={true}
                    elementsData={{
                      isElementSelectable: isPermissionSelectable,
                      selectedElements: selectedPermissions,
                      selectableElementsTable: selectablePermissionsTable,
                      setElementsSelected: setPermissionSelected,
                      clearSelectedElements: clearSelectedPermissions,
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
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddPermissionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add permission"
        onRefresh={refreshData}
      />
      <DeletePermissionsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedPermissions}
        clearSelectedElements={clearSelectedPermissions}
        columnNames={columnNames}
        keyNames={keyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="permissions-modal-error"
      />
    </div>
  );
};

export default Permissions;
