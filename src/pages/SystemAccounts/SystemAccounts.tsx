import React, { useState } from "react";
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
import { SysAccount } from "src/utils/datatypes/globalDataTypes";
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
import AddSystemAccountModal from "src/components/modals/SystemAccountModals/AddSystemAccountModal";
import DeleteSystemAccountsModal from "src/components/modals/SystemAccountModals/DeleteSystemAccountsModal";
import EnableDisableSystemAccountsModal from "src/components/modals/SystemAccountModals/EnableDisableSystemAccountsModal";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, isSysAccountSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// RPC client
import { useGetSysAccountsFullDataQuery } from "src/services/rpcSystemAccounts";
// Errors
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";

const columnNames = [
  "System account ID",
  "Description",
  "Change passwords without reset",
  "Status",
];
const keyNames = ["uid", "description", "privileged", "nsaccountlock"];

const deleteColumnNames = ["System account ID", "Description"];
const deleteKeyNames = ["uid", "description"];

const SystemAccounts = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "system-accounts" });
  useContextualHelpTopic("system-accounts");

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, perPage, searchValue } = useListPageSearchParams();

  const globalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const sysAccountsDataResponse = useGetSysAccountsFullDataQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const {
    data: fullDataResponse,
    isFetching: isBatchFetching,
    error: batchError,
  } = sysAccountsDataResponse;

  const elementsList = fullDataResponse?.sysAccounts ?? [];
  const totalCount = fullDataResponse?.totalCount ?? 0;

  // Clear errors when fetching starts
  React.useEffect(() => {
    if (isBatchFetching) {
      globalErrors.clear();
    }
  }, [isBatchFetching]);

  // Handle query errors
  React.useEffect(() => {
    if (
      !isBatchFetching &&
      sysAccountsDataResponse.isError &&
      sysAccountsDataResponse.error !== undefined
    ) {
      globalErrors.addError(
        sysAccountsDataResponse.error,
        "Error loading system accounts",
        "sysaccounts-fetch-error"
      );
    }
  }, [sysAccountsDataResponse.isError, isBatchFetching]);

  const refreshData = () => {
    clearSelectedSysAccounts();
    sysAccountsDataResponse.refetch();
  };

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  // 'Enable' button state
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    useState<boolean>(true);

  // 'Disable' button state
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    useState<boolean>(true);

  const [selectedSysAccounts, setSelectedSysAccounts] = useState<SysAccount[]>(
    []
  );

  const clearSelectedSysAccounts = () => {
    setSelectedSysAccounts([]);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEnableDisableModal, setShowEnableDisableModal] = useState(false);
  const [operation, setOperation] = useState<"enable" | "disable">("disable");

  // Open modal and set operation to 'enable' or 'disable'
  const onEnableOperation = () => {
    setOperation("enable");
    setShowEnableDisableModal(true);
  };

  const onDisableOperation = () => {
    setOperation("disable");
    setShowEnableDisableModal(true);
  };

  const selectableSysAccountsTable = React.useMemo(
    () => elementsList.filter(isSysAccountSelectable),
    [elementsList]
  );

  const updateSelectedSysAccounts = (
    sysAccounts: SysAccount[],
    isSelected: boolean
  ) => {
    let newSelectedSysAccounts: SysAccount[] = [];
    if (isSelected) {
      newSelectedSysAccounts = JSON.parse(JSON.stringify(selectedSysAccounts));
      for (let i = 0; i < sysAccounts.length; i++) {
        if (selectedSysAccounts.find((s) => s.uid === sysAccounts[i].uid)) {
          continue;
        }
        newSelectedSysAccounts.push(sysAccounts[i]);
      }
    } else {
      for (let i = 0; i < selectedSysAccounts.length; i++) {
        let found = false;
        for (let ii = 0; ii < sysAccounts.length; ii++) {
          if (selectedSysAccounts[i].uid === sysAccounts[ii].uid) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelectedSysAccounts.push(selectedSysAccounts[i]);
        }
      }
    }
    setSelectedSysAccounts(newSelectedSysAccounts);
    setIsDeleteButtonDisabled(newSelectedSysAccounts.length === 0);
  };

  const setSysAccountSelected = (
    sysAccount: SysAccount,
    isSelecting = true
  ) => {
    if (isSysAccountSelectable(sysAccount)) {
      updateSelectedSysAccounts([sysAccount], isSelecting);
    }
  };

  const selectedPerPageData = getSelectedPerPageData(
    elementsList,
    selectedSysAccounts.map((item) => ipaPrimaryKey(item.uid)),
    (item) => ipaPrimaryKey(item.uid)
  );

  const bulkSelectorData = {
    selected: selectedSysAccounts,
    updateSelected: updateSelectedSysAccounts,
    selectableTable: selectableSysAccountsTable,
    nameAttr: "uid",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
    updateIsEnableButtonDisabled: setIsEnableButtonDisabled,
    updateIsDisableButtonDisabled: setIsDisableButtonDisabled,
    isDisableEnableOp: true,
  };

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
          ariaLabel="Search system accounts"
          placeholder="Search"
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
          isDisabled={isBatchFetching}
          dataCy="system-accounts-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || isBatchFetching}
          onClickHandler={() => setShowDeleteModal(true)}
          dataCy="system-accounts-button-delete"
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
          isDisabled={isBatchFetching}
          dataCy="system-accounts-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={isDisableButtonDisabled || isBatchFetching}
          onClickHandler={onDisableOperation}
          dataCy="system-accounts-button-disable"
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          isDisabled={isEnableButtonDisabled || isBatchFetching}
          onClickHandler={onEnableOperation}
          dataCy="system-accounts-button-enable"
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 8,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 9,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 10,
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
          id="system-accounts-title"
          headingLevel="h1"
          text="System accounts"
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
                    tableTitle="System accounts table"
                    shownElementsList={elementsList}
                    pk="uid"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="system-accounts"
                    showTableRows={!isBatchFetching}
                    showLink={false}
                    elementsData={{
                      isElementSelectable: isSysAccountSelectable,
                      selectedElements: selectedSysAccounts,
                      selectableElementsTable: selectableSysAccountsTable,
                      setElementsSelected: setSysAccountSelected,
                      clearSelectedElements: clearSelectedSysAccounts,
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
                      isDeletion,
                      updateIsDeletion: setIsDeletion,
                      updateIsEnableButtonDisabled: setIsEnableButtonDisabled,
                      updateIsDisableButtonDisabled: setIsDisableButtonDisabled,
                      isDisableEnableOp: true,
                    }}
                    paginationData={selectedPerPageData}
                    statusElementName="nsaccountlock"
                    invertStatusValue={true}
                    booleanColumns={[{ column: "privileged" }]}
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
      <AddSystemAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add system account"
        onRefresh={refreshData}
      />
      <DeleteSystemAccountsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedSysAccounts}
        clearSelectedElements={clearSelectedSysAccounts}
        columnNames={deleteColumnNames}
        keyNames={deleteKeyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <EnableDisableSystemAccountsModal
        isOpen={showEnableDisableModal}
        onClose={() => setShowEnableDisableModal(false)}
        elementsList={selectedSysAccounts.map((account) => account.uid)}
        setElementsList={(newElementsList: SysAccount[]) =>
          setSelectedSysAccounts(newElementsList)
        }
        operation={operation}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default SystemAccounts;
