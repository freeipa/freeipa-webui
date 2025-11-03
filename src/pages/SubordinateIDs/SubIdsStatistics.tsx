import React from "react";
// PatternFly
import {
  Button,
  Grid,
  GridItem,
  PageSection,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import TableLayout from "src/components/layouts/TableLayout";
import { Td, Th, Tr } from "@patternfly/react-table";
// components
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import PageLayout from "src/components/layouts/PageLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import { useSubidStatsQuery } from "src/services/rpcSubIds";

interface SubidStats {
  assigned_subids: number;
  baseid: number;
  dna_remaining: number;
  rangesize: number;
  remaining_subids: number;
}

const SubIdsStatistics = () => {
  const dispatch = useAppDispatch();

  // States
  const [subidStats, setSubidStats] = React.useState<SubidStats>({
    assigned_subids: 0,
    baseid: 0,
    dna_remaining: 0,
    rangesize: 0,
    remaining_subids: 0,
  });
  const [showTableRows, setShowTableRows] = React.useState<boolean>(false);

  // API call
  const subidStatsResponse = useSubidStatsQuery();
  const { data, isLoading, error } = subidStatsResponse;

  React.useEffect(() => {
    setShowTableRows(!isLoading);

    if (!isLoading && error) {
      dispatch(
        addAlert({
          name: "Error fetching data",
          title: JSON.stringify(error, null, 2),
          variant: "danger",
        })
      );
    }

    if (!isLoading && data) {
      const subidStats = data.result.result;
      setSubidStats(subidStats as unknown as SubidStats);
    }
  }, [data, isLoading]);

  // On refresh
  const onRefresh = () => {
    setShowTableRows(false);
    subidStatsResponse.refetch().then(() => {
      setShowTableRows(true);
    });
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="subids-statistics-button-refresh"
          onClick={onRefresh}
          isDisabled={!showTableRows}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 2,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
  ];

  // Table
  // - Data
  const headerData = [
    "Base ID",
    "Assigned Subordinate IDs",
    "Remaining Subordinate IDs",
    "Range Size",
    "DNA Remaining",
  ];

  // - Header
  const header = (
    <Tr>
      {headerData.map((entry, idx) => (
        <Th modifier="wrap" key={idx}>
          {entry}
        </Th>
      ))}
    </Tr>
  );

  // - Body
  const body = (
    <Tr>
      <Td dataLabel="Base ID">{subidStats.baseid}</Td>
      <Td dataLabel="Assigned Subordinate IDs">{subidStats.assigned_subids}</Td>
      <Td dataLabel="Remaining Subordinate IDs">
        {subidStats.remaining_subids}
      </Td>
      <Td dataLabel="Range Size">{subidStats.rangesize}</Td>
      <Td dataLabel="DNA Remaining">{subidStats.dna_remaining}</Td>
    </Tr>
  );

  const skeleton = (
    <SkeletonOnTableLayout
      rows={1}
      colSpan={5}
      screenreaderText={"Loading table rows"}
    />
  );

  return (
    <PageLayout
      title="Subordinate ID Statistics"
      pathname="subordinate-id-statistics"
      hasAlerts={true}
      toolbarItems={toolbarItems}
    >
      <PageSection hasBodyWrapper={false}>
        <Grid hasGutter>
          <GridItem span={12}>
            <TableLayout
              ariaLabel={"subordinate id statistics table"}
              variant="compact"
              hasBorders={true}
              classes={"pf-v6-u-mt-md"}
              tableId={"subid-stats-table"}
              tableHeader={header}
              tableBody={!showTableRows ? skeleton : body}
              isStickyHeader={false}
            />
          </GridItem>
        </Grid>
      </PageSection>
    </PageLayout>
  );
};

export default SubIdsStatistics;
