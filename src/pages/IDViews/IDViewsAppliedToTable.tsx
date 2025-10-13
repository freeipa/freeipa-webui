import React, { useEffect } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "src/components/layouts/TableLayout";
// Layouts
import EmptyBodyTable from "src/components/tables/EmptyBodyTable";
// React Router DOM
import { Link } from "react-router";
// Hooks
import useShifting from "src/hooks/useShifting";

interface HostsData {
  selectedHosts: string[];
  hostsList: string[];
  setSelectedHosts: (hosts: string[]) => void;
  clearSelectedHosts: () => void;
}

interface ButtonsData {
  updateIsUnapplyButtonDisabled: (value: boolean) => void;
  isUnapply: boolean;
  updateIsUnapply: (value: boolean) => void;
}

interface PaginationData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

interface PropsToTable {
  hosts: string[];
  shownHosts: string[];
  hostsData: HostsData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
}

const IDViewsAppliedToTable = (props: PropsToTable) => {
  // Retrieve views data from props
  const shownHostsList = [...props.shownHosts];

  const isHostSelected = (host: string) => {
    if (
      props.hostsData.selectedHosts.find(
        (selectedHost) => selectedHost === host
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  // On selecting one single row
  const onSelectHost = useShifting(
    shownHostsList,
    props.hostsData.setSelectedHosts
  );

  // Reset 'selectedHosts' array if an apply operation has been done
  useEffect(() => {
    if (props.buttonsData.isUnapply) {
      props.hostsData.clearSelectedHosts();
      props.buttonsData.updateIsUnapply(false);
    }
  }, [props.buttonsData.isUnapply]);

  // Enable 'Un-apply' button (if any host selected)
  useEffect(() => {
    if (props.hostsData.selectedHosts.length > 0) {
      props.buttonsData.updateIsUnapplyButtonDisabled(false);
    }

    if (props.hostsData.selectedHosts.length === 0) {
      props.buttonsData.updateIsUnapplyButtonDisabled(true);
    }
  }, [props.hostsData.selectedHosts]);

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap">Host</Th>
    </Tr>
  );

  const body = shownHostsList.map((host, rowIndex) => (
    <Tr key={host} id={host}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectHost(host, rowIndex, isSelecting),
          isSelected: isHostSelected(host),
        }}
      />
      <Td dataLabel={host}>
        <Link to={"/hosts/" + host} state={host}>
          {host}
        </Link>
      </Td>
    </Tr>
  ));

  return (
    <TableLayout
      ariaLabel={"ID view applies to table"}
      variant={"compact"}
      hasBorders={true}
      tableId={"id-views-applies-to-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={props.shownHosts.length === 0 ? <EmptyBodyTable /> : body}
    />
  );
};

export default IDViewsAppliedToTable;
