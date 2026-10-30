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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
// React Router
import { Link } from "react-router";
// Data types
import { AhdapaIpaIdp } from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { useListAhdapaIpaIdpsQuery } from "src/services/rpcAhdapaFederation";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";

const AhdapaIpaIdps = () => {
  useUpdateRoute({ pathname: "ahdapa-ipa-idps" });

  const { page, perPage, searchValue } = useListPageSearchParams();

  const {
    data: allIdps = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaIpaIdpsQuery();

  // Client-side search filtering
  const filtered = React.useMemo(() => {
    if (!searchValue) return allIdps;
    const lower = searchValue.toLowerCase();
    return allIdps.filter(
      (idp) =>
        idp.id.toLowerCase().includes(lower) ||
        idp.display_name.toLowerCase().includes(lower) ||
        idp.issuer.toLowerCase().includes(lower) ||
        idp.client_id.toLowerCase().includes(lower)
    );
  }, [allIdps, searchValue]);

  // Client-side pagination
  const totalCount = filtered.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = filtered.slice(firstIdx, lastIdx);

  // Toolbar items (read-only: only search + refresh)
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SearchInputLayout
          dataCy="ahdapa-ipa-idps-search"
          name="search"
          ariaLabel="Search IPA upstream IdPs"
          placeholder="Search IdPs"
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
          dataCy="ahdapa-ipa-idps-button-refresh"
          onClickHandler={() => refetch()}
          isDisabled={isFetching}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <PaginationLayout
          list={paged}
          totalCount={totalCount}
          widgetId="ahdapa-ipa-idps-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "ID",
    "Display Name",
    "Issuer",
    "Client ID",
    "Scopes",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-ipa-idps-page"
          headingLevel="h1"
          text="IPA Upstream IdPs"
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
                {isFetching ? (
                  <DataSpinner />
                ) : error ? (
                  <div style={{ padding: "1rem" }}>
                    Error loading IPA upstream IdPs. Please try refreshing.
                  </div>
                ) : (
                  <Table aria-label="IPA Upstream IdPs table" variant="compact">
                    <Thead>
                      <Tr>
                        {columnNames.map((col) => (
                          <Th key={col}>{col}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paged.length === 0 ? (
                        <Tr>
                          <Td colSpan={columnNames.length}>
                            <div
                              style={{ textAlign: "center", padding: "2rem" }}
                            >
                              No IPA upstream IdPs found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((idp: AhdapaIpaIdp) => (
                          <Tr key={idp.id}>
                            <Td dataLabel={columnNames[0]}>
                              <Link
                                to={`/ahdapa-ipa-idps/${encodeURIComponent(idp.id)}`}
                              >
                                {idp.id}
                              </Link>
                            </Td>
                            <Td dataLabel={columnNames[1]}>
                              {idp.display_name}
                            </Td>
                            <Td dataLabel={columnNames[2]}>{idp.issuer}</Td>
                            <Td dataLabel={columnNames[3]}>{idp.client_id}</Td>
                            <Td dataLabel={columnNames[4]}>
                              {idp.scopes.join(", ")}
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={paged}
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="ahdapa-ipa-idps-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default AhdapaIpaIdps;
