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
import { IDPServer } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// RPC
import { useGetIdpEntriesQuery } from "src/services/rpcIdp";
// Utils
import { isIdpServerSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// Components
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
  const dispatch = useAppDispatch();
  useContextualHelpTopic("idp-references");

  // Contextual help panel

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({
    pathname: "identity-provider-references",
  });

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // States
  const [idpReferences, setIdpReferences] = React.useState<IDPServer[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  // API calls
  const idpsResponse = useGetIdpEntriesQuery({
    searchValue: searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isFetching, error } = idpsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (idpsResponse.isFetching) {
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

  const clearSelectedElements = () => {
    const emptyList: IDPServer[] = [];
    setSelectedElements(emptyList);
  };

  // Refresh button handling
  const refreshData = () => {
    // Reset selected elements on refresh
    setTotalCount(0);

    idpsResponse.refetch();
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

  const selectedPerPageData = getSelectedPerPageData(
    idpReferences,
    selectedElements.map((item) => ipaPrimaryKey(item.cn)),
    (item) => ipaPrimaryKey(item.cn)
  );

  // Show table rows
  // Data wrappers
  // - 'BulkSelectorrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedIdpRefs,
    selectableTable: selectableIdpRefsTable,
    nameAttr: "cn",
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
          ariaLabel="Search IdP references"
          placeholder="Search IdP references"
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
          isDisabled={isFetching}
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
          isDisabled={isDeleteButtonDisabled || isFetching}
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
          isDisabled={isFetching}
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
          list={idpReferences}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Render component
  return (
    <>
      <div>
        <PageSection hasBodyWrapper={false}>
          <TitleLayout
            id="Identity Provider references page"
            headingLevel="h1"
            text="Identity Provider references"
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
                      showTableRows={!isFetching}
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
                      paginationData={selectedPerPageData}
                    />
                  )}
                </InnerScrollContainer>
              </OuterScrollContainer>
            </FlexItem>
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={idpReferences}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
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
    </>
  );
};

export default IdpReferences;
