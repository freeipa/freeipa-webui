import React from "react";
// PatternFly
import {
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { IDPServer } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import {
  useGetIdpEntriesQuery,
  useSearchIdpEntriesMutation,
} from "src/services/rpcIdp";
// Utils
import { isIdpServerSelectable } from "src/utils/utils";
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
// Modals
import AddModal from "src/components/modals/IdpReferences/AddModal";
import DeleteModal from "src/components/modals/IdpReferences/DeleteModal";

const IdpReferences = () => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "identity-provider-references",
  });

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

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // States
  const [idpReferences, setIdpReferences] = React.useState<IDPServer[]>([]);
  const [isSearchDisabled, setIsSearchDisabled] =
    React.useState<boolean>(false);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const idpsResponse = useGetIdpEntriesQuery({
    searchValue: searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isLoading, error } = idpsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (idpsResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (idpsResponse.isSuccess && idpsResponse.data && data !== undefined) {
      const listResult = data.result.results;
      const totalCount = data.result.totalCount;
      const listSize = data.result.count;
      const elementsList: IDPServer[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(listResult[i].result);
      }

      setTotalCount(totalCount);
      // Update the list of elements
      setIdpReferences(elementsList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !idpsResponse.isLoading &&
      idpsResponse.isError &&
      idpsResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      window.location.reload();
    }
  }, [idpsResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<IDPServer[]>(
    []
  );
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  const clearSelectedElements = () => {
    const emptyList: IDPServer[] = [];
    setSelectedElements(emptyList);
  };

  // Refresh button handling
  const refreshData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected elements on refresh
    setTotalCount(0);

    idpsResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState(false);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableIdpRefsTable = idpReferences.filter(isIdpServerSelectable); // elements per Table

  const updateSelectedIdpRefs = (idpRef: IDPServer[], isSelected: boolean) => {
    let newSelectedIdpRefs: IDPServer[] = [];
    if (isSelected) {
      newSelectedIdpRefs = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < idpRef.length; i++) {
        if (
          selectedElements.find(
            (selectedIdpRef) => selectedIdpRef.cn[0] === idpRef[i].cn[0]
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedIdpRefs.push(idpRef[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < idpRef.length; ii++) {
          if (selectedElements[i].cn[0] === idpRef[ii].cn[0]) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedIdpRefs.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedIdpRefs);
    setIsDeleteButtonDisabled(newSelectedIdpRefs.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setIdpRefsSelected = (idpRef: IDPServer, isSelecting = true) => {
    if (isIdpServerSelectable(idpRef)) {
      updateSelectedIdpRefs([idpRef], isSelecting);
    }
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    idpsResponse.refetch();
  }, []);

  // Show table rows
  const [showTableRows, setShowTableRows] = React.useState(!isLoading);

  // Show table rows only when data is fully retrieved
  React.useEffect(() => {
    if (showTableRows !== !isLoading) {
      setShowTableRows(!isLoading);
    }
  }, [isLoading]);

  // Search API call
  const [searchEntry] = useSearchIdpEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue: searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 200, // Search will consider a max. of elements
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
          alerts.addAlert(
            "submit-search-value-error",
            error || "Error when searching for IdPs",
            "danger"
          );
        } else {
          // Success
          const listResult = result.data?.result.results || [];
          const listSize = result.data?.result.count || 0;
          const totalCount = result.data?.result.totalCount || 0;
          const elementsList: IDPServer[] = [];

          for (let i = 0; i < listSize; i++) {
            elementsList.push(listResult[i].result);
          }

          setTotalCount(totalCount);
          setIdpReferences(elementsList);
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
    updateShownElementsList: setIdpReferences,
    totalCount,
  };

  // SearchInputLayout
  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
    submitSearchValue,
  };

  // - 'BulkSelectorrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedIdpRefs,
    selectableTable: selectableIdpRefsTable,
    nameAttr: "cn",
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const onOpenAddModal = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={idpReferences}
          shownElementsList={idpReferences}
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
          ariaLabel="Search subIds"
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
          dataCy="idp-references-button-refresh"
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
          dataCy="idp-references-button-delete"
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={onOpenDeleteModal}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          dataCy="idp-references-button-add"
          isDisabled={!showTableRows}
          onClickHandler={onOpenAddModal}
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
          list={idpReferences}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Render component
  return (
    <div>
      <alerts.ManagedAlerts />
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="Identity Provider references page"
          headingLevel="h1"
          text="Identity Provider references"
        />
      </PageSection>
      <PageSection
        hasBodyWrapper={false}
        isFilled={false}
        className="pf-v5-u-m-lg pf-v5-u-pb-md pf-v5-u-pl-0 pf-v5-u-pr-0"
      >
        <ToolbarLayout
          className="pf-v5-u-pt-0 pf-v5-u-pl-lg pf-v5-u-pr-md"
          contentClassName="pf-v5-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div style={{ height: `calc(100vh - 352.2px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              {error !== undefined && error ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <MainTable
                  tableTitle="Identity Provider references table"
                  shownElementsList={idpReferences}
                  pk="cn"
                  keyNames={["cn", "ipaidpclientid", "ipaidpscope"]}
                  columnNames={[
                    "Identity Provider reference name",
                    "Client identifier",
                    "Scope",
                  ]}
                  hasCheckboxes={true}
                  pathname="identity-provider-references"
                  showTableRows={showTableRows}
                  showLink={true}
                  elementsData={{
                    isElementSelectable: isIdpServerSelectable,
                    selectedElements,
                    selectableElementsTable: selectableIdpRefsTable,
                    setElementsSelected: setIdpRefsSelected,
                    clearSelectedElements,
                  }}
                  buttonsData={{
                    updateIsDeleteButtonDisabled: (value) =>
                      setIsDeleteButtonDisabled(value),
                    isDeletion,
                    updateIsDeletion: (value) => setIsDeletion(value),
                  }}
                  paginationData={{
                    selectedPerPage,
                    updateSelectedPerPage: setSelectedPerPage,
                  }}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationLayout
          list={idpReferences}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        />
      </PageSection>
      <AddModal
        isOpen={showAddModal}
        onCloseModal={onCloseAddModal}
        onRefresh={refreshData}
        title="Add Identity Provider reference"
      />
      <DeleteModal
        show={showDeleteModal}
        onClose={onCloseDeleteModal}
        selectedData={{
          selectedElements,
          clearSelectedElements,
        }}
        buttonsData={{
          updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
          updateIsDeletion: setIsDeletion,
        }}
        columnNames={[
          "Identity Provider reference name",
          "Client identifier",
          "Scope",
        ]}
        keyNames={["cn", "ipaidpclientid", "ipaidpscope"]}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default IdpReferences;
