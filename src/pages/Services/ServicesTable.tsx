import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, ThProps, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "src/components/layouts/TableLayout";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "src/components/layouts/Skeleton/SkeletonOnTableLayout";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// React Router DOM
import { Link } from "react-router-dom";

interface ServicesData {
  isServiceSelectable: (service: Service) => boolean;
  selectedServices: Service[];
  selectableServicesTable: Service[];
  setServiceSelected: (service: Service, isSelecting?: boolean) => void;
  clearSelectedServices: () => void;
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

interface PropsToTable {
  elementsList: Service[];
  shownElementsList: Service[];
  showTableRows: boolean;
  servicesData: ServicesData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const ServicesTable = (props: PropsToTable) => {
  // Retrieve services data from props
  const shownServicesList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    principalName: "Principal name",
  };

  // Index of the currently sorted column
  // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
  // as the identifier of the sorted column. See the "Compound expandable" example.
  const [activeSortIndex, setActiveSortIndex] = useState<number | null>(null);

  // Sort direction of the currently sorted column
  const [activeSortDirection, setActiveSortDirection] = useState<
    "asc" | "desc" | null
  >(null);

  // Since OnSort specifies sorted columns by index, we need sortable values for our object by column index.
  const getSortableRowValues = (service: Service): (string | number)[] => {
    const { krbcanonicalname } = service;
    return [krbcanonicalname];
  };

  let sortedServices = [...shownServicesList];
  if (activeSortIndex !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sortedServices = shownServicesList.sort((a, b) => {
      let aValue = getSortableRowValues(a)[activeSortIndex][0];
      let bValue = getSortableRowValues(b)[activeSortIndex][0];
      if (typeof aValue === "number") {
        // Numeric sort
        if (activeSortDirection === "asc") {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (aValue.constructor === Array) {
          aValue = aValue[0];
          bValue = bValue[0];
        }
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

  const isServiceSelected = (service: Service) => {
    if (
      props.servicesData.selectedServices.find(
        (selectedService) =>
          selectedService.krbcanonicalname[0] === service.krbcanonicalname[0]
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectService = (
    service: Service,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the service is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
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
        props.servicesData.setServiceSelected(
          shownServicesList[index],
          isSelecting
        )
      );
    } else {
      props.servicesData.setServiceSelected(service, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update serviceIdsSelected array
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

  // Reset 'selectedServiceIds' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.servicesData.clearSelectedServices();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any service selected)
  useEffect(() => {
    if (props.servicesData.selectedServices.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.servicesData.selectedServices.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.servicesData.selectedServices]);

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
        {columnNames.principalName}
      </Th>
    </Tr>
  );

  const body = shownServicesList.map((service, rowIndex) => (
    <Tr key={service.krbcanonicalname[0]} id={service.krbcanonicalname[0]}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectService(service, rowIndex, isSelecting),
          isSelected: isServiceSelected(service),
          isDisabled: !props.servicesData.isServiceSelectable(service),
        }}
      />
      <Td dataLabel={columnNames.principalName}>
        <Link to={URL_PREFIX + "/services/settings"} state={service}>
          {service.krbcanonicalname[0]}
        </Link>
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

  // Render component
  return (
    <TableLayout
      ariaLabel={"Services table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v5-u-mt-md"}
      tableId={"services-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default ServicesTable;
