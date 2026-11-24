import React from "react";
// PatternFly
import {
  Content,
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  Spinner,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { TopologySegment } from "src/utils/datatypes/globalDataTypes";
// RPC
import { useGetTopologySegmentsQuery } from "src/services/rpcTopology";
// Utils
import { getSelectedPerPageData } from "src/utils/selectedPerPage";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import GlobalErrors from "src/components/errors/GlobalErrors";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import MainTable from "src/components/tables/MainTable";
import AddTopologySegmentModal from "src/components/modals/Topology/AddTopologySegmentModal";
import DeleteTopologySegmentsModal from "src/components/modals/Topology/DeleteTopologySegmentsModal";

interface TopologySegmentsProps {
  topologySuffixId: string;
}

const TopologySegments = (props: TopologySegmentsProps) => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("topology-segments");

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "topology-suffixes", noBreadcrumb: true });

  // URL parameters: page number, page size, search value
  const { page, perPage, searchValue } = useListPageSearchParams();

  const startIdx = (page - 1) * perPage;
  const stopIdx = startIdx + perPage;

  // API call
  const segmentsResponse = useGetTopologySegmentsQuery({
    suffix: props.topologySuffixId,
    searchValue,
  });

  const { data, isFetching, error } = segmentsResponse;

  const segments = data?.segments ?? [];
  const totalCount = data?.totalCount ?? 0;
  const shownSegments = segments.slice(startIdx, stopIdx);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<
    TopologySegment[]
  >([]);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);
  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  const updateSelectedSegments = (
    elements: TopologySegment[],
    isSelected: boolean
  ) => {
    let newSelected: TopologySegment[] = [];
    if (isSelected) {
      newSelected = [...selectedElements];
      elements.forEach((element) => {
        if (!newSelected.some((selected) => selected.cn === element.cn)) {
          newSelected.push(element);
        }
      });
    } else {
      newSelected = selectedElements.filter(
        (selected) => !elements.some((element) => element.cn === selected.cn)
      );
    }
    setSelectedElements(newSelected);
    setIsDeleteButtonDisabled(newSelected.length === 0);
  };

  const setSegmentSelected = (segment: TopologySegment, isSelecting = true) => {
    updateSelectedSegments([segment], isSelecting);
  };

  const clearSelectedElements = () => {
    setSelectedElements([]);
    setIsDeleteButtonDisabled(true);
  };

  // Refresh button handling
  const refreshData = () => {
    clearSelectedElements();
    segmentsResponse.refetch();
  };

  // Table-related shared functionality
  const selectedPerPageData = getSelectedPerPageData(
    shownSegments,
    selectedElements.map((segment) => segment.cn),
    (segment) => segment.cn
  );

  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedSegments,
    selectableTable: shownSegments,
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
          list={segments}
          shownElementsList={shownSegments}
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
          name="search"
          ariaLabel="Search topology segments"
          placeholder="Search topology segments"
          dataCy="search"
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
          dataCy="refresh-topology-segments"
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
          dataCy="delete-topology-segments"
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
          onClickHandler={() => setShowAddModal(true)}
          dataCy="add-topology-segment"
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
          list={shownSegments}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  const spinner = (
    <Content className="pf-v6-u-m-xl">
      <Content component="h3">
        <i>Loading data</i>
        <Spinner isInline size="xl" className="pf-v6-u-ml-md" />
      </Content>
    </Content>
  );

  return (
    <>
      <div
        style={{ height: `var(--subsettings-calc)` }}
        data-cy={"topology-suffixes-topology-segments"}
      >
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
                    <GlobalErrors
                      errors={[
                        {
                          error,
                          context: "Error loading topology segments",
                          key: "topology-segments",
                        },
                      ]}
                    />
                  ) : isFetching ? (
                    spinner
                  ) : (
                    <MainTable
                      tableTitle="Topology segments table"
                      shownElementsList={shownSegments}
                      pk="cn"
                      keyNames={[
                        "cn",
                        "iparepltoposegmentleftnode",
                        "iparepltoposegmentrightnode",
                        "iparepltoposegmentdirection",
                      ]}
                      columnNames={[
                        "Segment name",
                        "Left node",
                        "Right node",
                        "Connectivity",
                      ]}
                      hasCheckboxes={true}
                      pathname="topology-suffixes"
                      showTableRows={!isFetching}
                      showLink={false}
                      elementsData={{
                        isElementSelectable: () => true,
                        selectedElements,
                        selectableElementsTable: shownSegments,
                        setElementsSelected: setSegmentSelected,
                        clearSelectedElements,
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
                list={shownSegments}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
                className="pf-v6-u-pb-0 pf-v6-u-pr-md"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        {showAddModal && (
          <AddTopologySegmentModal
            suffix={props.topologySuffixId}
            onClose={() => setShowAddModal(false)}
            onRefresh={refreshData}
          />
        )}
        <DeleteTopologySegmentsModal
          suffix={props.topologySuffixId}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onRefresh={refreshData}
          elementsToDelete={selectedElements}
          clearSelectedElements={clearSelectedElements}
          columnNames={["Segment name", "Left node", "Right node"]}
          keyNames={[
            "cn",
            "iparepltoposegmentleftnode",
            "iparepltoposegmentrightnode",
          ]}
          updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
          updateIsDeletion={setIsDeletion}
        />
      </div>
    </>
  );
};

export default TopologySegments;
