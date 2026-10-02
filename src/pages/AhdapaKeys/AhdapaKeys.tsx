import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
  Label,
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
// Data types
import {
  AhdapaSigningKey,
  formatUnixTimestamp,
} from "src/utils/datatypes/ahdapaDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import {
  useListAhdapaKeysQuery,
  useRotateAhdapaKeyMutation,
} from "src/services/rpcAhdapaInfra";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// Components
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";

const AhdapaKeys = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "ahdapa-keys" });

  const { page, perPage } = useListPageSearchParams();

  const {
    data: allKeys = [],
    isFetching,
    error,
    refetch,
  } = useListAhdapaKeysQuery();

  const [rotateKey, { isLoading: isRotating }] = useRotateAhdapaKeyMutation();

  // Client-side pagination
  const totalCount = allKeys.length;
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;
  const paged = allKeys.slice(firstIdx, lastIdx);

  // Refresh
  const refreshData = () => {
    refetch();
  };

  // Rotate key
  const onRotateKey = async () => {
    try {
      await rotateKey().unwrap();
      dispatch(
        addAlert({
          name: "rotate-key-success",
          title: "Signing key rotated successfully",
          variant: "success",
        })
      );
    } catch {
      dispatch(
        addAlert({
          name: "rotate-key-error",
          title: "Failed to rotate signing key",
          variant: "danger",
        })
      );
    }
  };

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="ahdapa-keys-button-refresh"
          onClickHandler={refreshData}
          isDisabled={isFetching}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="ahdapa-keys-button-rotate"
          onClickHandler={onRotateKey}
          isDisabled={isFetching || isRotating}
          isLoading={isRotating}
          spinnerAriaLabel="Rotating key"
        >
          Rotate Key
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <PaginationLayout
          list={paged}
          totalCount={totalCount}
          widgetId="ahdapa-keys-pagination-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Column definitions
  const columnNames = [
    "Key ID",
    "Algorithm",
    "Active",
    "Valid From",
    "Valid Until",
  ] as const;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="ahdapa-keys-page"
          headingLevel="h1"
          text="Signing Keys"
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
                    Error loading signing keys. Please try refreshing.
                  </div>
                ) : (
                  <Table aria-label="Signing Keys table" variant="compact">
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
                              style={{
                                textAlign: "center",
                                padding: "2rem",
                              }}
                            >
                              No signing keys found
                            </div>
                          </Td>
                        </Tr>
                      ) : (
                        paged.map((key: AhdapaSigningKey) => (
                          <Tr key={key.kid}>
                            <Td dataLabel={columnNames[0]}>
                              <code>{key.kid}</code>
                            </Td>
                            <Td dataLabel={columnNames[1]}>{key.algorithm}</Td>
                            <Td dataLabel={columnNames[2]}>
                              {key.active ? (
                                <Label color="green">Active</Label>
                              ) : (
                                <Label color="grey">Inactive</Label>
                              )}
                            </Td>
                            <Td dataLabel={columnNames[3]}>
                              {formatUnixTimestamp(key.not_before)}
                            </Td>
                            <Td dataLabel={columnNames[4]}>
                              {formatUnixTimestamp(key.not_after)}
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
              widgetId="ahdapa-keys-pagination-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default AhdapaKeys;
