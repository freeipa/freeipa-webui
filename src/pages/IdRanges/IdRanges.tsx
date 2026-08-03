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
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useApiError from "src/hooks/useApiError";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// RPC
import { useGetIdRangeEntriesQuery } from "src/services/rpcIdRanges";
import { IdRange } from "src/utils/datatypes/globalDataTypes";
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
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import { isIdRangeSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
import AddIdRangeModal from "src/components/modals/IdRanges/AddIdRangeModal";
import DeleteModal from "src/components/modals/IdRanges/DeleteModal";

const IdRanges = () => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("id-ranges");

  // Contextual help panel

  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "id-ranges" });

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // Handle API calls errors
  const [selectedElements, setSelectedElements] = React.useState<IdRange[]>([]);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);
  const [isDeletion, setIsDeletion] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const updateSelectedIdRanges = (idRange: IdRange[], isSelected: boolean) => {
    let newSelectedIdRanges: IdRange[] = [...selectedElements];

    if (isSelected) {
      for (let i = 0; i < idRange.length; i++) {
        const isAlreadySelected = newSelectedIdRanges.some(
          (selectedIdRange) => selectedIdRange.cn === idRange[i].cn
        );
        if (!isAlreadySelected) {
          newSelectedIdRanges.push(idRange[i]);
        }
      }
    } else {
      const idsToRemove = new Set(idRange.map((r) => r.cn));
      newSelectedIdRanges = newSelectedIdRanges.filter(
        (selectedIdRange) => !idsToRemove.has(selectedIdRange.cn)
      );
    }

    setSelectedElements(newSelectedIdRanges);
    setIsDeleteButtonDisabled(newSelectedIdRanges.length === 0);
  };

  // API calls (batch detailed list)
  const idRangesDataResponse = useGetIdRangeEntriesQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const {
    data: batchResponse,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error: batchError,
  } = idRangesDataResponse;

  // Derived data from query
  const queryDerived = React.useMemo(() => {
    if (!isSuccess || !batchResponse) {
      return { list: [] as IdRange[], total: 0, ready: false };
    }
    const listResult = batchResponse.result.results;
    const total = batchResponse.result.totalCount;
    const listSize = batchResponse.result.count;
    const elementsList: IdRange[] = [];
    for (let i = 0; i < listSize; i++) {
      elementsList.push(listResult[i].result as IdRange);
    }
    return { list: elementsList, total, ready: true };
  }, [isSuccess, batchResponse]);

  // Clear alerts while fetching
  React.useEffect(() => {
    if (isFetching) {
      globalErrors.clear();
    }
  }, [isFetching]);

  // Redirect on auth errors
  React.useEffect(() => {
    if (!isLoading && isError && batchError !== undefined) {
      navigate("/login");
      window.location.reload();
    }
  }, [isLoading, isError, batchError]);

  // Refresh button handling
  const refreshData = () => {
    idRangesDataResponse.refetch();
  };

  // Compute shown list and total
  const shownElementsList = queryDerived.list;
  const totalCount = queryDerived.total;

  // Selection helpers
  const selectableIdRangesTable = shownElementsList.filter(isIdRangeSelectable);
  const setIdRangesSelected = (idRange: IdRange, isSelecting = true) => {
    if (isIdRangeSelectable(idRange)) {
      updateSelectedIdRanges([idRange], isSelecting);
    }
  };

  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedIdRanges,
    selectableTable: selectableIdRangesTable,
    nameAttr: "cn",
  };

  const selectedPerPageData = getSelectedPerPageData(
    shownElementsList,
    selectedElements.map((item) => ipaPrimaryKey(item.cn)),
    (item) => ipaPrimaryKey(item.cn)
  );

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={shownElementsList}
          shownElementsList={shownElementsList}
          elementData={bulkSelectorData}
          buttonsData={{
            updateIsDeleteButtonDisabled: (disabled: boolean) => {
              void disabled;
            },
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
          ariaLabel="Search ID ranges"
          placeholder="Search ID ranges"
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
          dataCy="id-ranges-button-refresh"
          onClickHandler={refreshData}
          isDisabled={isFetching || !queryDerived.ready}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={
            isDeleteButtonDisabled || isFetching || !queryDerived.ready
          }
          dataCy="id-ranges-button-delete"
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
          isDisabled={isFetching || !queryDerived.ready}
          dataCy="id-ranges-button-add"
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
          list={shownElementsList}
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
          <TitleLayout id="ID ranges page" headingLevel="h1" text="ID ranges" />
        </PageSection>
        <PageSection hasBodyWrapper={false} isFilled={false}>
          <Flex direction={{ default: "column" }}>
            <FlexItem>
              <ToolbarLayout toolbarItems={toolbarItems} />
            </FlexItem>
            <FlexItem style={{ flex: "1 1 auto", overflow: "hidden" }}>
              <OuterScrollContainer
                style={{ height: "100%", overflow: "hidden" }}
              >
                <InnerScrollContainer
                  style={{ height: "100%", overflow: "auto" }}
                >
                  {batchError !== undefined && batchError ? (
                    <GlobalErrors errors={globalErrors.getAll()} />
                  ) : (
                    <MainTable
                      tableTitle="ID ranges table"
                      shownElementsList={shownElementsList}
                      pk="cn"
                      keyNames={[
                        "cn",
                        "ipabaseid",
                        "ipaidrangesize",
                        "iparangetype",
                      ]}
                      columnNames={[
                        "Range name",
                        "First Posix ID of the range",
                        "Number of IDs in the range",
                        "Range type",
                      ]}
                      hasCheckboxes={true}
                      pathname="id-ranges"
                      showTableRows={!isFetching && queryDerived.ready}
                      showLink={true}
                      elementsData={{
                        isElementSelectable: isIdRangeSelectable,
                        selectedElements,
                        selectableElementsTable:
                          shownElementsList.filter(isIdRangeSelectable),
                        setElementsSelected: setIdRangesSelected,
                        clearSelectedElements: () => setSelectedElements([]),
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
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={shownElementsList}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        <AddIdRangeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add ID range"
          onRefresh={refreshData}
        />
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          selectedData={{
            selectedElements,
            clearSelectedElements: () => setSelectedElements([]),
          }}
          buttonsData={{
            updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
            updateIsDeletion: setIsDeletion,
          }}
          columnNames={[
            "Range name",
            "First Posix ID of the range",
            "Number of IDs in the range",
            "Range type",
          ]}
          keyNames={["cn", "ipabaseid", "ipaidrangesize", "iparangetype"]}
          onRefresh={refreshData}
        />
      </div>
    </>
  );
};

export default IdRanges;
