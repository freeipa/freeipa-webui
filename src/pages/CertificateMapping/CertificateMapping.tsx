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
import { CertificateMapping } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// RPC
import { useGetCertMapRuleEntriesQuery } from "src/services/rpcCertMapping";
// Utils
import { isCertMapSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
import { apiToCertificateMapping } from "src/utils/certMappingUtils";
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
import AddRuleModal from "src/components/modals/CertificateMapping/AddRuleModal";
import DeleteMultipleRulesModal from "src/components/modals/CertificateMapping/DeleteMultipleRulesModal";
import EnableDisableMultipleRulesModal from "src/components/modals/CertificateMapping/EnableDisableMultipleRules";

const CertificateMappingPage = () => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("certificate-mapping");

  // Contextual help panel

  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({
    pathname: "cert-id-mapping-rules",
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
  const [certMapRules, setCertMapRules] = React.useState<CertificateMapping[]>(
    []
  );
  const [totalCount, setTotalCount] = React.useState(0);

  // API calls
  const certMapsResponse = useGetCertMapRuleEntriesQuery({
    searchValue,
    apiVersion,
    sizelimit: 100,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  });

  const { data, isFetching, error } = certMapsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (certMapsResponse.isFetching) {
      // Reset selected elements on refresh
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      certMapsResponse.isSuccess &&
      certMapsResponse.data &&
      data !== undefined
    ) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: CertificateMapping[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToCertificateMapping(listResult[i].result));
      }

      setTotalCount(certMapsResponse.data.result.totalCount);
      // Update the list of elements
      setCertMapRules(elementsList);
    }

    // API response: Error
    if (
      !certMapsResponse.isLoading &&
      certMapsResponse.isError &&
      certMapsResponse.error !== undefined
    ) {
      // This normally happens when the user is not authorized to view the data
      // So instead of adding an error, refresh page
      navigate("/login");
      window.location.reload();
    }
  }, [certMapsResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<
    CertificateMapping[]
  >([]);

  // Refresh button handling
  const refreshData = () => {
    // Reset selected elements on refresh
    setTotalCount(0);

    certMapsResponse.refetch();
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState(false);

  // 'Enable' button state
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    React.useState<boolean>(true);

  // 'Disable' button state
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    React.useState<boolean>(true);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableCertMapRulesTable = certMapRules.filter(isCertMapSelectable); // elements per Table

  const updateSelectedCertMapRules = (
    certMapRule: CertificateMapping[],
    isSelected: boolean
  ) => {
    let newSelectedCertMapRules: CertificateMapping[] = [];
    if (isSelected) {
      newSelectedCertMapRules = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < certMapRule.length; i++) {
        if (
          selectedElements.find(
            (selectedCertMapRule) =>
              selectedCertMapRule.cn === certMapRule[i].cn
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedCertMapRules.push(certMapRule[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < certMapRule.length; ii++) {
          if (selectedElements[i].cn === certMapRule[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedCertMapRules.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedCertMapRules);
    setIsDeleteButtonDisabled(newSelectedCertMapRules.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setCertMapRulesSelected = (
    certMapRule: CertificateMapping,
    isSelecting = true
  ) => {
    if (isCertMapSelectable(certMapRule)) {
      updateSelectedCertMapRules([certMapRule], isSelecting);
    }
  };

  const selectedPerPageData = getSelectedPerPageData(
    certMapRules,
    selectedElements.map((item) => ipaPrimaryKey(item.cn)),
    (item) => ipaPrimaryKey(item.cn)
  );

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    certMapsResponse.refetch();
  }, []);

  // Show table rows
  // Data wrappers
  // TODO: Better separation of concerts
  // - 'BulkSelectorrep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedCertMapRules,
    selectableTable: selectableCertMapRulesTable,
    nameAttr: "cn",
  };

  // Modals functionality
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEnableDisableModal, setShowEnableDisableModal] =
    React.useState(false);
  const [operation, setOperation] = React.useState<"enable" | "disable">(
    "disable"
  );

  // Open modal and set operation to 'disable' or "enable"
  const onEnableOperation = () => {
    setOperation("enable");
    setShowEnableDisableModal(true);
  };

  const onDisableOperation = () => {
    setOperation("disable");
    setShowEnableDisableModal(true);
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={certMapRules}
          shownElementsList={certMapRules}
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
          ariaLabel="Search certificate mapping rules"
          placeholder="Search certificate mapping rules"
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
          dataCy="certificate-mapping-button-refresh"
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
          dataCy="certificate-mapping-button-delete"
          isDisabled={isDeleteButtonDisabled || isFetching}
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
          dataCy="certificate-mapping-button-add"
          isDisabled={isFetching}
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
          dataCy="certificate-mapping-button-disable"
          isDisabled={isDisableButtonDisabled || isFetching}
          onClickHandler={onDisableOperation}
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          dataCy="certificate-mapping-button-enable"
          isDisabled={isEnableButtonDisabled || isFetching}
          onClickHandler={onEnableOperation}
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
          list={certMapRules}
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
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="Certificate Identity mapping rules page"
          headingLevel="h1"
          text="Certificate Identity mapping rules"
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
                    tableTitle="Certificate Identity mapping table"
                    shownElementsList={certMapRules}
                    pk="cn"
                    keyNames={["cn", "ipaenabledflag", "description"]}
                    columnNames={["Rule name", "Status", "Description"]}
                    hasCheckboxes={true}
                    pathname="cert-id-mapping-rules"
                    showTableRows={!isFetching}
                    showLink={true}
                    elementsData={{
                      isElementSelectable: isCertMapSelectable,
                      selectedElements,
                      selectableElementsTable: selectableCertMapRulesTable,
                      setElementsSelected: setCertMapRulesSelected,
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
                    paginationData={selectedPerPageData}
                    statusElementName="ipaenabledflag"
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={certMapRules}
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddRuleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={"Add certificate identity mapping rule"}
        onRefresh={refreshData}
      />
      <DeleteMultipleRulesModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedElements}
        clearSelectedElements={() => setSelectedElements([])}
        columnNames={["Rule name", "Description"]}
        keyNames={["cn", "description"]}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <EnableDisableMultipleRulesModal
        isOpen={showEnableDisableModal}
        onClose={() => setShowEnableDisableModal(false)}
        elementsList={selectedElements.map((rule) => rule.cn)}
        setElementsList={(value) =>
          setSelectedElements(value.map((cn) => ({ cn }) as CertificateMapping))
        }
        operation={operation}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default CertificateMappingPage;
