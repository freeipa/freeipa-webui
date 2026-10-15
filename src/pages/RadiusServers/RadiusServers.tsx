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
import { RadiusServer } from "src/utils/datatypes/globalDataTypes";
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
import AddRadiusServerModal from "src/components/modals/RadiusServerModals/AddRadiusServerModal";
import DeleteRadiusServersModal from "src/components/modals/RadiusServerModals/DeleteRadiusServersModal";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { API_VERSION_BACKUP, isRadiusServerSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// RPC client
import { useGetRadiusServersFullDataQuery } from "src/services/rpcRadiusServers";
// Errors
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const COLUMN_NAMES = [
  "RADIUS proxy server name",
  "Server",
  "User attribute",
  "Description",
];

const KEY_NAMES = [
  "cn",
  "ipatokenradiusserver",
  "ipatokenusermapattribute",
  "description",
];

const RadiusServers = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "radius-servers" });
  useContextualHelpTopic("radius-servers");

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, perPage, searchValue } = useListPageSearchParams();

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const radiusServersDataResponse = useGetRadiusServersFullDataQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const {
    data: radiusServersData,
    isLoading: isBatchLoading,
    isFetching,
    error: batchError,
  } = radiusServersDataResponse;

  const elementsList = radiusServersData?.servers ?? [];
  const totalCount = radiusServersData?.totalCount ?? 0;

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
      radiusServersDataResponse.isError &&
      radiusServersDataResponse.error !== undefined
    ) {
      globalErrors.addError(
        radiusServersDataResponse.error,
        "Error loading RADIUS servers",
        "radius-servers-fetch-error"
      );
    }
  }, [radiusServersDataResponse.isError, isBatchLoading, isFetching]);

  const refreshData = () => {
    clearSelectedRadiusServers();
    radiusServersDataResponse.refetch();
  };

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  const [selectedRadiusServers, setSelectedRadiusServers] = useState<
    RadiusServer[]
  >([]);

  const clearSelectedRadiusServers = () => {
    setSelectedRadiusServers([]);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectableRadiusServersTable = elementsList.filter(
    isRadiusServerSelectable
  );

  const updateSelectedRadiusServers = (
    servers: RadiusServer[],
    isSelected: boolean
  ) => {
    let newSelected: RadiusServer[] = [];
    if (isSelected) {
      newSelected = JSON.parse(JSON.stringify(selectedRadiusServers));
      for (let i = 0; i < servers.length; i++) {
        if (selectedRadiusServers.find((s) => s.cn[0] === servers[i].cn[0])) {
          continue;
        }
        newSelected.push(servers[i]);
      }
    } else {
      for (let i = 0; i < selectedRadiusServers.length; i++) {
        let found = false;
        for (let ii = 0; ii < servers.length; ii++) {
          if (selectedRadiusServers[i].cn[0] === servers[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelected.push(selectedRadiusServers[i]);
        }
      }
    }
    setSelectedRadiusServers(newSelected);
    setIsDeleteButtonDisabled(newSelected.length === 0);
  };

  const setRadiusServerSelected = (
    server: RadiusServer,
    isSelecting = true
  ) => {
    if (isRadiusServerSelectable(server)) {
      updateSelectedRadiusServers([server], isSelecting);
    }
  };

  const selectedPerPageData = getSelectedPerPageData(
    elementsList,
    selectedRadiusServers.map((item) => ipaPrimaryKey(item.cn)),
    (item) => ipaPrimaryKey(item.cn)
  );

  const bulkSelectorData = {
    selected: selectedRadiusServers,
    updateSelected: updateSelectedRadiusServers,
    selectableTable: selectableRadiusServersTable,
    nameAttr: "cn",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
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
          ariaLabel="Search RADIUS servers"
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
          isDisabled={isFetching}
          dataCy="radius-servers-button-refresh"
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
          dataCy="radius-servers-button-delete"
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
          dataCy="radius-servers-button-add"
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
          id="radius-servers-title"
          headingLevel="h1"
          text="RADIUS servers"
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
                    tableTitle="RADIUS servers table"
                    shownElementsList={elementsList}
                    pk="cn"
                    keyNames={KEY_NAMES}
                    columnNames={COLUMN_NAMES}
                    hasCheckboxes={true}
                    pathname="radius-servers"
                    showTableRows={!isFetching}
                    showLink={true}
                    elementsData={{
                      isElementSelectable: isRadiusServerSelectable,
                      selectedElements: selectedRadiusServers,
                      selectableElementsTable: selectableRadiusServersTable,
                      setElementsSelected: setRadiusServerSelected,
                      clearSelectedElements: clearSelectedRadiusServers,
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
                      isDeletion,
                      updateIsDeletion: setIsDeletion,
                    }}
                    paginationData={selectedPerPageData}
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
      <AddRadiusServerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add RADIUS server"
        onRefresh={refreshData}
      />
      <DeleteRadiusServersModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedRadiusServers}
        clearSelectedElements={clearSelectedRadiusServers}
        columnNames={COLUMN_NAMES}
        keyNames={KEY_NAMES}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="radius-servers-modal-error"
      />
    </div>
  );
};

export default RadiusServers;
