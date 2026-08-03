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
import { Trust } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// RPC
import { useGetTrustsFullDataQuery } from "src/services/rpcTrusts";
// Utils
import { apiToTrust } from "src/utils/trustsUtils";
import { isTrustSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
// React router
import { useNavigate } from "react-router";
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
import AddTrustModal from "./AddTrustModal";
import DeleteTrustModal from "./DeleteTrustModal";

const Trusts = () => {
  const navigate = useNavigate();

  // Contextual help panel

  const dispatch = useAppDispatch();
  useContextualHelpTopic("trusts");

  useUpdateRoute({
    pathname: "trusts",
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

  // API calls
  const trustsResponse = useGetTrustsFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isFetching, error } = trustsResponse;

  // Process data and update state when response changes
  React.useEffect(() => {
    if (trustsResponse.isFetching) {
      globalErrors.clear();
      return;
    }

    // API response: Error
    if (
      !trustsResponse.isLoading &&
      trustsResponse.isError &&
      trustsResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [trustsResponse, navigate, globalErrors]);

  // Compute trusts data from API response
  const trusts = React.useMemo(() => {
    if (trustsResponse.isSuccess && trustsResponse.data && data !== undefined) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: Trust[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToTrust(listResult[i].result));
      }

      return elementsList;
    }
    return [];
  }, [data, trustsResponse.isSuccess, trustsResponse.data]);

  // Compute total count from API response
  const totalCount = React.useMemo(() => {
    if (trustsResponse.isSuccess && trustsResponse.data) {
      return trustsResponse.data.result.totalCount;
    }
    return 0;
  }, [trustsResponse.isSuccess, trustsResponse.data]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<Trust[]>([]);

  // Refresh button handling
  const refreshData = () => {
    // Reset selected elements on refresh
    setSelectedElements([]);

    trustsResponse.refetch();
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableTrustsTable = trusts.filter(isTrustSelectable);

  const updateSelectedTrusts = (trusts: Trust[], isSelected: boolean) => {
    let newSelectedTrusts: Trust[] = [];
    if (isSelected) {
      newSelectedTrusts = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < trusts.length; i++) {
        if (
          selectedElements.find(
            (selectedTrust) => selectedTrust.cn === trusts[i].cn
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedTrusts.push(trusts[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < trusts.length; ii++) {
          if (selectedElements[i].cn === trusts[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedTrusts.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedTrusts);
    setIsDeleteButtonDisabled(newSelectedTrusts.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setTrustsSelected = (trust: Trust, isSelecting = true) => {
    if (isTrustSelectable(trust)) {
      updateSelectedTrusts([trust], isSelecting);
    }
  };

  const selectedPerPageData = getSelectedPerPageData(
    trusts,
    selectedElements.map((trust) => ipaPrimaryKey(trust.cn)),
    (trust) => ipaPrimaryKey(trust.cn)
  );

  // Data wrappers
  // - 'BulkSelectorprep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedTrusts,
    selectableTable: selectableTrustsTable,
    nameAttr: "cn",
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={trusts}
          shownElementsList={trusts}
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
          ariaLabel="Search trusts"
          placeholder="Search trusts"
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
          dataCy="trusts-button-refresh"
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
          isDisabled={isDeleteButtonDisabled || isFetching}
          dataCy="trusts-button-delete"
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
          isDisabled={isFetching}
          dataCy="trusts-button-add"
          onClickHandler={() => setShowAddModal(true)}
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
          list={trusts}
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
          <TitleLayout id="Trusts page" headingLevel="h1" text="Trusts" />
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
                      tableTitle="Trusts table"
                      shownElementsList={trusts}
                      pk="cn"
                      keyNames={["cn"]}
                      columnNames={["Realm name"]}
                      hasCheckboxes={true}
                      pathname="trusts"
                      showTableRows={!isFetching}
                      showLink={true}
                      elementsData={{
                        isElementSelectable: isTrustSelectable,
                        selectedElements,
                        selectableElementsTable: selectableTrustsTable,
                        setElementsSelected: setTrustsSelected,
                        clearSelectedElements: () => setSelectedElements([]),
                      }}
                      buttonsData={{
                        updateIsDeleteButtonDisabled: (value) =>
                          setIsDeleteButtonDisabled(value),
                        isDeletion,
                        updateIsDeletion: (value) => setIsDeletion(value),
                        isDisableEnableOp: true,
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
                list={trusts}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        <AddTrustModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add trust"
          onRefresh={refreshData}
        />
        <DeleteTrustModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          elementsToDelete={selectedElements}
          clearSelectedElements={() => setSelectedElements([])}
          columnNames={["Realm name"]}
          keyNames={["cn"]}
          onRefresh={refreshData}
          updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
          updateIsDeletion={setIsDeletion}
        />
      </div>
    </>
  );
};

export default Trusts;
