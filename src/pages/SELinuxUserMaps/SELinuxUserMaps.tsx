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
import { SELinuxUserMap } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// RPC
import {
  useGetSelinuxUserMapsFullDataQuery,
  useSearchSelinuxUserMapsEntriesMutation,
} from "src/services/rpcSelinuxUserMaps";
// Utils
import { apiToSelinuxUserMap } from "src/utils/selinuxUserMapUtils";
import { isSelinuxUserMapSelectable } from "src/utils/utils";
// React router
import { useNavigate } from "react-router";
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
import AddSelinuxUserMapModal from "src/components/modals/SelinuxUserMapModals/AddSelinuxUserMapModal";
import DeleteSelinuxUserMapsModal from "src/components/modals/SelinuxUserMapModals/DeleteSelinuxUserMapsModal";
import EnableDisableSelinuxUserMapsModal from "src/components/modals/SelinuxUserMapModals/EnableDisableSelinuxUserMapsModal";

const SELinuxUserMaps = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { browserTitle } = useUpdateRoute({
    pathname: "selinux-user-maps",
  });

  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  const globalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const [isSearchDisabled, setIsSearchDisabled] = React.useState(false);

  const mapsResponse = useGetSelinuxUserMapsFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const { data, isLoading, error } = mapsResponse;

  React.useEffect(() => {
    if (mapsResponse.isFetching) {
      globalErrors.clear();
      return;
    }

    if (
      !mapsResponse.isLoading &&
      mapsResponse.isError &&
      mapsResponse.error !== undefined
    ) {
      navigate("/login");
      window.location.reload();
    }
  }, [mapsResponse, navigate, globalErrors]);

  const selinuxUserMaps = React.useMemo(() => {
    if (mapsResponse.isSuccess && mapsResponse.data && data !== undefined) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: SELinuxUserMap[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToSelinuxUserMap(listResult[i].result));
      }

      return elementsList;
    }
    return [];
  }, [data, mapsResponse.isSuccess, mapsResponse.data]);

  const totalCount = React.useMemo(() => {
    if (mapsResponse.isSuccess && mapsResponse.data) {
      return mapsResponse.data.result.totalCount;
    }
    return 0;
  }, [mapsResponse.isSuccess, mapsResponse.data]);

  const showTableRows = React.useMemo(() => {
    if (mapsResponse.isFetching) {
      return false;
    }
    return !isLoading;
  }, [mapsResponse.isFetching, isLoading]);

  const [selectedElements, setSelectedElements] = React.useState<
    SELinuxUserMap[]
  >([]);
  const [selectedPerPage, setSelectedPerPage] = React.useState<number>(0);

  const refreshData = () => {
    setSelectedElements([]);
    mapsResponse.refetch();
  };

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);
  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    React.useState<boolean>(true);
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    React.useState<boolean>(true);

  const selectableMapsTable = selinuxUserMaps.filter(
    isSelinuxUserMapSelectable
  );

  const updateSelectedMaps = (maps: SELinuxUserMap[], isSelected: boolean) => {
    let newSelectedMaps: SELinuxUserMap[] = [];
    if (isSelected) {
      newSelectedMaps = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < maps.length; i++) {
        if (selectedElements.find((selected) => selected.cn === maps[i].cn)) {
          continue;
        }
        newSelectedMaps.push(maps[i]);
      }
    } else {
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < maps.length; ii++) {
          if (selectedElements[i].cn === maps[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelectedMaps.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedMaps);
    setIsDeleteButtonDisabled(newSelectedMaps.length === 0);
  };

  const setMapSelected = (map: SELinuxUserMap, isSelecting = true) => {
    if (isSelinuxUserMapSelectable(map)) {
      updateSelectedMaps([map], isSelecting);
    }
  };

  React.useEffect(() => {
    mapsResponse.refetch();
  }, []);

  const [searchEntry] = useSearchSelinuxUserMapsEntriesMutation();

  const submitSearchValue = () => {
    searchEntry({
      searchValue,
      apiVersion,
      sizelimit: 100,
      startIdx: 0,
      stopIdx: 100,
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
              title: error || "Error when searching for SELinux user maps",
              variant: "danger",
            })
          );
        }
        setIsSearchDisabled(false);
      }
    });
  };

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
    submitSearchValue,
  };

  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedMaps,
    selectableTable: selectableMapsTable,
    nameAttr: "cn",
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage: setSelectedPerPage,
  };

  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showEnableDisableModal, setShowEnableDisableModal] =
    React.useState<boolean>(false);
  const [operation, setOperation] = React.useState<"enable" | "disable">(
    "disable"
  );

  const onEnableOperation = () => {
    setOperation("enable");
    setShowEnableDisableModal(true);
  };

  const onDisableOperation = () => {
    setOperation("disable");
    setShowEnableDisableModal(true);
  };

  const columnNames = ["Rule name", "SELinux User", "Status", "Description"];
  const keyNames = ["cn", "ipaselinuxuser", "ipaenabledflag", "description"];

  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={selinuxUserMaps}
          shownElementsList={selinuxUserMaps}
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
          ariaLabel="Search SELinux user maps"
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
          dataCy="selinux-user-maps-button-refresh"
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
          dataCy="selinux-user-maps-button-delete"
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
          dataCy="selinux-user-maps-button-add"
          onClickHandler={() => setShowAddModal(true)}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={isDisableButtonDisabled || !showTableRows}
          onClickHandler={onDisableOperation}
          dataCy="selinux-user-maps-button-disable"
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          isDisabled={isEnableButtonDisabled || !showTableRows}
          onClickHandler={onEnableOperation}
          dataCy="selinux-user-maps-button-enable"
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
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 10,
      element: (
        <PaginationLayout
          list={selinuxUserMaps}
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
          id="SELinux user maps title"
          headingLevel="h1"
          text="SELinux user maps"
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
                    tableTitle="SELinux user maps table"
                    shownElementsList={selinuxUserMaps}
                    pk="cn"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="selinux-user-maps"
                    showTableRows={showTableRows}
                    showLink={false}
                    elementsData={{
                      isElementSelectable: isSelinuxUserMapSelectable,
                      selectedElements,
                      selectableElementsTable: selectableMapsTable,
                      setElementsSelected: setMapSelected,
                      clearSelectedElements: () => setSelectedElements([]),
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: (value) =>
                        setIsDeleteButtonDisabled(value),
                      isDeletion,
                      updateIsDeletion: (value) => setIsDeletion(value),
                      updateIsEnableButtonDisabled: (value) =>
                        setIsEnableButtonDisabled(value),
                      updateIsDisableButtonDisabled: (value) =>
                        setIsDisableButtonDisabled(value),
                      isDisableEnableOp: true,
                    }}
                    paginationData={{
                      selectedPerPage,
                      updateSelectedPerPage: setSelectedPerPage,
                    }}
                    statusElementName="ipaenabledflag"
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={selinuxUserMaps}
              paginationData={paginationData}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddSelinuxUserMapModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={refreshData}
      />
      <DeleteSelinuxUserMapsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        columnNames={columnNames}
        keyNames={keyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <EnableDisableSelinuxUserMapsModal
        isOpen={showEnableDisableModal}
        onClose={() => setShowEnableDisableModal(false)}
        elementsList={selectedElements.map((map) => map.cn)}
        setElementsList={(newElementsList: SELinuxUserMap[]) =>
          setSelectedElements(newElementsList)
        }
        operation={operation}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default SELinuxUserMaps;
