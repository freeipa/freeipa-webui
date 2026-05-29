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
import { AutomountLocation } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import { useGetAutomountLocationsFullDataQuery } from "src/services/rpcAutomountLocations";
// Utils
import { apiToAutomountLocation } from "src/utils/automountLocationUtils";
import { isAutomountLocationSelectable } from "src/utils/utils";
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
import AddAutomountLocationModal from "./AddAutomountLocationModal";
import DeleteAutomountLocationsModal from "./DeleteAutomountLocationsModal";

const AutomountLocations = () => {
  const navigate = useNavigate();

  const { browserTitle } = useUpdateRoute({
    pathname: "automount-locations",
  });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  // API calls
  const locationsResponse = useGetAutomountLocationsFullDataQuery(
    {
      searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: firstIdx,
      stopIdx: lastIdx,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data, isLoading, error } = locationsResponse;

  // Handle auth errors
  React.useEffect(() => {
    if (locationsResponse.isFetching) {
      globalErrors.clear();
      return;
    }

    if (
      !locationsResponse.isLoading &&
      locationsResponse.isError &&
      locationsResponse.error !== undefined
    ) {
      navigate("/login");
      window.location.reload();
    }
  }, [locationsResponse, navigate, globalErrors]);

  // Derive locations from API response
  const locations = React.useMemo(() => {
    if (locationsResponse.isSuccess && data) {
      const elementsList: AutomountLocation[] = [];
      for (let i = 0; i < data.result.count; i++) {
        elementsList.push(
          apiToAutomountLocation(data.result.results[i].result)
        );
      }
      return elementsList;
    }
    return [];
  }, [locationsResponse.isSuccess, data]);

  const totalCount =
    locationsResponse.isSuccess && data ? data.result.totalCount : 0;

  const showTableRows = !locationsResponse.isFetching && !isLoading;

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<
    AutomountLocation[]
  >([]);
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  // Refresh button handling
  const refreshData = () => {
    setSelectedElements([]);
    locationsResponse.refetch();
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // Table-related shared functionality
  const selectableLocationsTable = locations.filter(
    isAutomountLocationSelectable
  );

  const updateSelectedLocations = (
    items: AutomountLocation[],
    isSelected: boolean
  ) => {
    let newSelectedLocations: AutomountLocation[] = [];
    if (isSelected) {
      newSelectedLocations = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < items.length; i++) {
        if (
          selectedElements.find(
            (selectedLocation) => selectedLocation.cn === items[i].cn
          )
        ) {
          continue;
        }
        newSelectedLocations.push(items[i]);
      }
    } else {
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < items.length; ii++) {
          if (selectedElements[i].cn === items[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelectedLocations.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedLocations);
    setIsDeleteButtonDisabled(newSelectedLocations.length === 0);
  };

  const setLocationSelected = (
    location: AutomountLocation,
    isSelecting = true
  ) => {
    if (isAutomountLocationSelectable(location)) {
      updateSelectedLocations([location], isSelecting);
    }
  };

  // Data wrappers
  const paginationData = {
    page,
    perPage,
    updatePage: setPage,
    updatePerPage: setPerPage,
    updateSelectedPerPage: setSelectedPerPage,
    totalCount,
  };

  const searchValueData = {
    searchValue,
    updateSearchValue: setSearchValue,
  };

  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedLocations,
    selectableTable: selectableLocationsTable,
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
          list={locations}
          shownElementsList={locations}
          elementData={bulkSelectorData}
          buttonsData={{
            updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
          }}
          selectedPerPageData={{
            selectedPerPage,
            updateSelectedPerPage: setSelectedPerPage,
          }}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search automount locations"
          placeholder="Search automount locations"
          searchValueData={searchValueData}
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
          dataCy="automount-locations-button-refresh"
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
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          dataCy="automount-locations-button-delete"
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
          isDisabled={!showTableRows}
          dataCy="automount-locations-button-add"
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
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={locations}
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
          id="Automount locations title"
          headingLevel="h1"
          text="Automount locations"
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
                style={{ height: "55vh", overflow: "auto" }}
              >
                {error !== undefined && error ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    tableTitle="Automount locations table"
                    shownElementsList={locations}
                    pk="cn"
                    keyNames={["cn"]}
                    columnNames={["Location name"]}
                    hasCheckboxes={true}
                    pathname="automount-locations"
                    showTableRows={showTableRows}
                    showLink={false}
                    elementsData={{
                      isElementSelectable: isAutomountLocationSelectable,
                      selectedElements,
                      selectableElementsTable: selectableLocationsTable,
                      setElementsSelected: setLocationSelected,
                      clearSelectedElements: () => setSelectedElements([]),
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: (value) =>
                        setIsDeleteButtonDisabled(value),
                      isDeletion,
                      updateIsDeletion: (value) => setIsDeletion(value),
                      isDisableEnableOp: false,
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
              list={locations}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddAutomountLocationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={refreshData}
      />
      <DeleteAutomountLocationsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
    </div>
  );
};

export default AutomountLocations;
