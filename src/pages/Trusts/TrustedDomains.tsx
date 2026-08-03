import React from "react";
// PatternFly
import {
  PageSection,
  PaginationVariant,
  Content,
  Spinner,
  ToolbarItemVariant,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Data types
import { TrustDomain } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  useTrustDomainsFindQuery,
  useFetchTrustDomainsMutation,
} from "src/services/rpcTrusts";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Utils
import { isTrustDomainSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
import { apiToTrustDomain } from "src/utils/trustsUtils";
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
import EnableDisableTrustedDomainsModal from "./EnableDisableTrustedDomainsModal";
import DeleteTrustedDomainsModal from "./DeleteTrustedDomainsModal";

interface TrustedDomainsProps {
  trustId: string;
}

const TrustedDomains = (props: TrustedDomainsProps) => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("trusted-domains");

  // Contextual help panel

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "trusted-domains" });

  // URL parameters: page number, page size, search value
  const { page, perPage } = useListPageSearchParams();

  // Calculate pagination parameters for server-side pagination
  const startIdx = (page - 1) * perPage;
  const stopIdx = startIdx + perPage;

  // Handle API calls errors
  const globalErrors = useApiError([]);

  // States
  const [trustDomains, setTrustDomains] = React.useState<TrustDomain[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);

  // API calls
  const [fetchTrustDomains] = useFetchTrustDomainsMutation();
  const trustDomainsResponse = useTrustDomainsFindQuery({
    trustId: props.trustId,
    sizelimit: perPage,
  });

  const { data, isFetching, error } = trustDomainsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    if (trustDomainsResponse.isFetching) {
      setTotalCount(0);
      globalErrors.clear();
      return;
    }

    if (
      trustDomainsResponse.isSuccess &&
      trustDomainsResponse.data &&
      data !== undefined
    ) {
      // First, paginate the data
      const paginatedData = (
        data.result.result as unknown as Record<string, unknown>[]
      ).slice(startIdx, stopIdx);
      setTrustDomains(paginatedData.map((item) => apiToTrustDomain(item)));
      setTotalCount(paginatedData.length);
    }
  }, [trustDomainsResponse]);

  // Selected elements
  const [selectedElements, setSelectedElements] = React.useState<TrustDomain[]>(
    []
  );

  // Refresh button handling
  const refreshData = () => {
    // Reset selected elements on refresh
    setSelectedElements([]);

    trustDomainsResponse.refetch().catch(() => {
      dispatch(
        addAlert({
          name: "refresh-trusted-domains-error",
          title: "Error refreshing trusted domains",
          variant: "danger",
        })
      );
    });
  };

  // Toolbar buttons states
  // - 'Delete'
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    React.useState<boolean>(true);

  const [isDeletion, setIsDeletion] = React.useState<boolean>(false);

  // - 'Enable'
  const [isEnableButtonDisabled, setIsEnableButtonDisabled] =
    React.useState<boolean>(true);

  // 'Disable'
  const [isDisableButtonDisabled, setIsDisableButtonDisabled] =
    React.useState<boolean>(true);

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableTrustDomainsTable = trustDomains.filter(
    isTrustDomainSelectable
  );

  // - Manage the selected elements in the table (add/remove)
  const updateSelectedTrustDomains = (
    trustDomains: TrustDomain[],
    isSelected: boolean
  ) => {
    let newSelectedTrustDomains: TrustDomain[] = [];
    if (isSelected) {
      newSelectedTrustDomains = JSON.parse(JSON.stringify(selectedElements));
      for (let i = 0; i < trustDomains.length; i++) {
        if (
          selectedElements.find(
            (selectedTrustDomain) =>
              selectedTrustDomain.cn === trustDomains[i].cn
          )
        ) {
          // Already in the list
          continue;
        }
        // Add element to list
        newSelectedTrustDomains.push(trustDomains[i]);
      }
    } else {
      // Remove element
      for (let i = 0; i < selectedElements.length; i++) {
        let found = false;
        for (let ii = 0; ii < trustDomains.length; ii++) {
          if (selectedElements[i].cn === trustDomains[ii].cn) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Keep this valid selected entry
          newSelectedTrustDomains.push(selectedElements[i]);
        }
      }
    }
    setSelectedElements(newSelectedTrustDomains);
    setIsDeleteButtonDisabled(newSelectedTrustDomains.length === 0);
  };

  // - Helper method to set the selected entries from the table
  const setTrustedDomainsSelected = (
    trustDomain: TrustDomain,
    isSelecting = true
  ) => {
    if (isTrustDomainSelectable(trustDomain)) {
      updateSelectedTrustDomains([trustDomain], isSelecting);
    }
  };

  // Fetch trusted domains
  const [isFetchingDomains, setIsFetchingDomains] =
    React.useState<boolean>(false);

  const fetchTrustedDomains = () => {
    setIsFetchingDomains(true);

    fetchTrustDomains(props.trustId)
      .then((result) => {
        if ("data" in result) {
          const summary = result.data?.result.summary;
          dispatch(
            addAlert({
              name: "fetch-trusted-domains-success",
              title: summary,
              variant: "success",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "fetch-trusted-domains-error",
              title: "Error fetching trusted domains",
              variant: "danger",
            })
          );
        }
      })
      .finally(() => {
        setIsFetchingDomains(false);
      });
  };

  const isTableLoading = isFetching || isFetchingDomains;

  const selectedPerPageData = getSelectedPerPageData(
    trustDomains,
    selectedElements.map((trustDomain) => ipaPrimaryKey(trustDomain.cn)),
    (trustDomain) => ipaPrimaryKey(trustDomain.cn)
  );

  // Data wrappers
  // - 'BulkSelectorprep'
  const bulkSelectorData = {
    selected: selectedElements,
    updateSelected: updateSelectedTrustDomains,
    selectableTable: selectableTrustDomainsTable,
    nameAttr: "cn",
  };

  // Modals functionality
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showEnableDisableModal, setShowEnableDisableModal] =
    React.useState<boolean>(false);
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
          list={trustDomains}
          shownElementsList={trustDomains}
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
          ariaLabel="Search trusted domains"
          placeholder="Search trusted domains"
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
          dataCy="trusted-domains-button-refresh"
          onClickHandler={refreshData}
          isDisabled={isTableLoading}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || isTableLoading}
          dataCy="trusted-domains-button-delete"
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
          isDisabled={isTableLoading || isDisableButtonDisabled}
          dataCy="trusted-domains-button-disable"
          onClickHandler={onDisableOperation}
        >
          Disable
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={isTableLoading || isEnableButtonDisabled}
          dataCy="trusted-domains-button-enable"
          onClickHandler={onEnableOperation}
        >
          Enable
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      element: (
        <SecondaryButton
          isDisabled={isTableLoading || isFetchingDomains}
          dataCy="trusted-domains-button-fetch-domains"
          onClickHandler={fetchTrustedDomains}
        >
          Fetch domains
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
          list={trustDomains}
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

  // Render component
  return (
    <>
      <div
        style={{
          height: `var(--subsettings-calc)`,
        }}
        data-cy={"trusted-domains"}
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
                    <GlobalErrors errors={globalErrors.getAll()} />
                  ) : (
                    <>
                      {isTableLoading ? (
                        spinner
                      ) : (
                        <MainTable
                          tableTitle="Trusted domains table"
                          shownElementsList={trustDomains}
                          pk="cn"
                          keyNames={[
                            "cn",
                            "domain_enabled",
                            "ipantflatname",
                            "ipanttrusteddomainsid",
                          ]}
                          columnNames={[
                            "Domain name",
                            "Status",
                            "Domain NetBIOS name",
                            "Domain security identifier",
                          ]}
                          hasCheckboxes={true}
                          pathname="trusted-domains"
                          showTableRows={!isTableLoading}
                          showLink={false}
                          elementsData={{
                            isElementSelectable: isTrustDomainSelectable,
                            selectedElements,
                            selectableElementsTable:
                              selectableTrustDomainsTable,
                            setElementsSelected: setTrustedDomainsSelected,
                            clearSelectedElements: () =>
                              setSelectedElements([]),
                          }}
                          buttonsData={{
                            updateIsDeleteButtonDisabled:
                              setIsDeleteButtonDisabled,
                            isDeletion,
                            updateIsDeletion: setIsDeletion,
                            updateIsEnableButtonDisabled: (value) =>
                              setIsEnableButtonDisabled(value),
                            updateIsDisableButtonDisabled: (value) =>
                              setIsDisableButtonDisabled(value),
                            isDisableEnableOp: true,
                          }}
                          paginationData={selectedPerPageData}
                          statusElementName="domain_enabled"
                        />
                      )}
                    </>
                  )}
                </InnerScrollContainer>
              </OuterScrollContainer>
            </FlexItem>
            <FlexItem
              style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}
            >
              <PaginationLayout
                list={trustDomains}
                totalCount={totalCount}
                variant={PaginationVariant.bottom}
                widgetId="pagination-options-menu-bottom"
                className="pf-v6-u-pb-0 pf-v6-u-pr-md"
              />
            </FlexItem>
          </Flex>
        </PageSection>
        <EnableDisableTrustedDomainsModal
          isOpen={showEnableDisableModal}
          onClose={() => setShowEnableDisableModal(false)}
          trustId={props.trustId}
          domainNames={selectedElements.map((element) => element.cn)}
          setDomainNames={(newDomainNames) =>
            setSelectedElements(
              newDomainNames.map((cn) => ({ cn }) as TrustDomain)
            )
          }
          operation={operation}
          onRefresh={refreshData}
        />
        <DeleteTrustedDomainsModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          elementsToDelete={selectedElements}
          clearSelectedElements={() => setSelectedElements([])}
          columnNames={[
            "Domain Name",
            "Domain NetBIOS name",
            "Domain security identifier",
          ]}
          keyNames={["cn", "ipantflatname", "ipanttrusteddomainsid"]}
          onRefresh={refreshData}
          updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
          updateIsDeletion={setIsDeletion}
          trustId={props.trustId}
        />
      </div>
    </>
  );
};

export default TrustedDomains;
