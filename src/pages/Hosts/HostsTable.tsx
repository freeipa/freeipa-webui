import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, ThProps, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// React Router DOM
import { Link } from "react-router-dom";

interface HostsData {
  isHostSelectable: (host: Host) => boolean;
  selectedHostIds: string[];
  changeSelectedHostIds: (newSelectedHostIds: string[]) => void; //
  selectableHostsTable: Host[];
  setHostSelected: (host: Host, isSelecting?: boolean) => void;
  updateSelectedHosts: (newSelectedHosts: string[]) => void;
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

    return [fqdn[0], descriptionString];
  };

  let sortedHosts = [...shownHostsList];
  if (activeSortIndex !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sortedHosts = shownHostsList.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (typeof aValue === "number") {
        // Numeric sort
        if (activeSortDirection === "asc") {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === "asc") {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
    });
  }

  // TODO: Put function in 'utils' file
  const getSortParams = (columnIndex: number): ThProps["sort"] => ({
    sortBy: {
      index: activeSortIndex as number,
      direction: activeSortDirection as "asc" | "desc",
      // starting sort direction when first sorting a column. Defaults to 'asc'
      defaultDirection: "asc",
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const isHostSelected = (host: Host) =>
    props.hostsData.selectedHostIds.includes(host.fqdn);

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
    let hostIdsSelectedArray = props.hostsData.selectedHostIds;
    if (isSelecting) {
      hostIdsSelectedArray.push(host.fqdn);
      // Increment the elements selected per page (++)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage + 1
      );
    } else {
      hostIdsSelectedArray = hostIdsSelectedArray.filter(
        (hostId) => hostId !== host.fqdn
      );
      // Decrement the elements selected per page (--)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage - 1
      );
    }
    props.hostsData.changeSelectedHostIds(hostIdsSelectedArray);
    props.hostsData.updateSelectedHosts(hostIdsSelectedArray);
  };

  // Reset 'selectedHostIds' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.hostsData.changeSelectedHostIds([]);
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any host selected)
  useEffect(() => {
    if (props.hostsData.selectedHostIds.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.hostsData.selectedHostIds.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.hostsData.selectedHostIds]);

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
      <Th modifier="wrap" sort={getSortParams(0)}>
        {columnNames.fqdn}
      </Th>
      <Th modifier="wrap" sort={getSortParams(1)}>
        {columnNames.description}
      </Th>
      <Th modifier="wrap" sort={getSortParams(2)}>
        {columnNames.enrolled}
      </Th>
    </Tr>
  );

  const body = filteredShownHosts.map((host, rowIndex) => (
    <Tr key={host.fqdn[0]} id={host.fqdn[0]}>
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
          {host.fqdn[0]}
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
