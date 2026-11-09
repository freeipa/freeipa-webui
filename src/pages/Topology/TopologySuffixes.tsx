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
import { TopologySuffix } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Redux
import { useAppSelector, useAppDispatch } from "src/store/hooks";
// RPC
import { useGetTopologySuffixesFullDataQuery } from "src/services/rpcTopology";
// Utils
import { apiToTopologySuffix } from "src/utils/topologyUtils";
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

const TopologySuffixes = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useContextualHelpTopic("topology-suffixes");

  useUpdateRoute({
    pathname: "topology-suffixes",
  });

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, perPage, searchValue } = useListPageSearchParams();

  const globalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const suffixesResponse = useGetTopologySuffixesFullDataQuery({
    searchValue,
    apiVersion,
    sizelimit: 0,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const { data, isFetching, error } = suffixesResponse;

  React.useEffect(() => {
    if (suffixesResponse.isFetching) {
      globalErrors.clear();
      return;
    }

    if (
      !suffixesResponse.isLoading &&
      suffixesResponse.isError &&
      suffixesResponse.error !== undefined
    ) {
      navigate("/login");
      window.location.reload();
    }
  }, [suffixesResponse, navigate, globalErrors]);

  const suffixes = React.useMemo(() => {
    if (suffixesResponse.isSuccess && suffixesResponse.data && data) {
      const listResult = data.result.results;
      const listSize = data.result.count;
      const elementsList: TopologySuffix[] = [];

      for (let i = 0; i < listSize; i++) {
        elementsList.push(apiToTopologySuffix(listResult[i].result));
      }

      return elementsList;
    }
    return [];
  }, [data, suffixesResponse.isSuccess, suffixesResponse.data]);

  const totalCount = React.useMemo(() => {
    if (suffixesResponse.isSuccess && suffixesResponse.data) {
      return suffixesResponse.data.result.totalCount;
    }
    return 0;
  }, [suffixesResponse.isSuccess, suffixesResponse.data]);

  const refreshData = () => {
    suffixesResponse.refetch();
  };

  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search topology suffixes"
          placeholder="Search topology suffixes"
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 1,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="topology-suffixes-button-refresh"
          onClickHandler={refreshData}
          isDisabled={isFetching}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 4,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 5,
      element: (
        <PaginationLayout
          list={suffixes}
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
          id="topology-suffixes title"
          headingLevel="h1"
          text="Topology suffixes"
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
                    tableTitle="Topology suffixes table"
                    shownElementsList={suffixes}
                    pk="cn"
                    keyNames={["cn", "iparepltopoconfroot"]}
                    columnNames={["Suffix name", "Managed LDAP suffix DN"]}
                    hasCheckboxes={false}
                    pathname="topology-suffixes"
                    showTableRows={!isFetching}
                    showLink={false}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={suffixes}
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </div>
  );
};

export default TopologySuffixes;
