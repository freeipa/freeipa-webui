import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { Host } from "../../utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// React Router DOM
import { Link } from "react-router-dom";

interface HostsData {
  isHostSelectable: (host: Host) => boolean;
  selectedHosts: Host[];
  selectableHostsTable: Host[];
  setHostSelected: (host: Host, isSelecting?: boolean) => void;
  clearSelectedHosts: () => void;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  isDeletion: boolean;
  updateIsDeletion: (value: boolean) => void;
}

interface PaginationData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

export interface PropsToTable {
  elementsList: Host[];
  shownElementsList: Host[];
  showTableRows: boolean;
  hostsData: HostsData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const HostsTable = (props: PropsToTable) => {
  // Retrieve hosts data from props
  const shownHostsList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    fqdn: "Host name",
    description: "Description",
    enrolled: "Enrolled",
  };

  // Filter (SearchInput)
  // - When a host is search using the Search Input
  const onFilter = (host: Host) => {
    if (props.searchValue === "") {
      return true;
    }

    let input: RegExp;
    try {
      input = new RegExp(props.searchValue, "i");
    } catch (err) {
      input = new RegExp(
        props.searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    for (const attr of Object.keys(columnNames)) {
      if (
        host[attr] !== undefined &&
        host[attr] !== "enrolled" &&
        host[attr][0].search(input) >= 0
      ) {
        return true;
      }
    }
    return false;
  };

  const filteredShownHosts =
    props.searchValue === ""
      ? shownHostsList
      : props.elementsList.filter(onFilter);

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = useState<number | null>(null);

  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = useState<
    "asc" | "desc" | null
  >(null);

  // Since OnSort specifies sorted columns by index, we need sortable values for our object by column index.
  const getSortableRowValues = (host: Host): (string | number)[] => {
    const { fqdn, description } = host;

    let descriptionString = "";
    if (description !== undefined) {
      descriptionString = description[0];
    }

    return [fqdn, descriptionString];
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectHost = (host: Host, rowIndex: number, isSelecting: boolean) => {
    // If the host is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(
              new Array(numberSelected + 1),
              (_x, i) => i + recentSelectedRowIndex
            )
          : Array.from(
              new Array(Math.abs(numberSelected) + 1),
              (_x, i) => i + rowIndex
            );
      intermediateIndexes.forEach((index) =>
        props.hostsData.setHostSelected(shownHostsList[index], isSelecting)
      );
    } else {
      props.hostsData.setHostSelected(host, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update hostIdsSelected array
    if (isSelecting) {
      // Increment the elements selected per page (++)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage + 1
      );
    } else {
      // Decrement the elements selected per page (--)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage - 1
      );
    }
  };

  // Reset 'selectedHostIds' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.hostsData.clearSelectedHosts();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any host selected)
  useEffect(() => {
    if (props.hostsData.selectedHosts.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.hostsData.selectedHosts.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.hostsData.selectedHosts]);

  // Keyboard event
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap">{columnNames.fqdn}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
      <Th modifier="wrap">{columnNames.enrolled}</Th>
    </Tr>
  );

  const body = filteredShownHosts.map((host, rowIndex) => (
    <Tr key={host.fqdn} id={host.fqdn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectHost(host, rowIndex, isSelecting),
          isSelected: isHostSelected(host),
          isDisabled: !props.hostsData.isHostSelectable(host),
        }}
      />
      <Td dataLabel={columnNames.fqdn}>
        <Link to={URL_PREFIX + "/hosts/settings"} state={host}>
          {host.fqdn}
        </Link>
      </Td>
      <Td dataLabel={columnNames.description}>{host.description}</Td>
      <Td dataLabel={columnNames.enrolled}>
        {host.enrolledby !== "" ? "True" : "False"}
      </Td>
    </Tr>
  ));

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  return (
    <TableLayout
      ariaLabel={"Hosts table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={"hosts-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default HostsTable;
