import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { HBACServiceGroup } from "../../utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// React Router DOM
import { Link } from "react-router";

interface ServicesData {
  isHbacServiceSelectable: (service: HBACServiceGroup) => boolean;
  selectedServices: HBACServiceGroup[];
  selectableServicesTable: HBACServiceGroup[];
  setServicesSelected: (
    service: HBACServiceGroup,
    isSelecting?: boolean
  ) => void;
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

export interface PropsToTable {
  shownElementsList: HBACServiceGroup[];
  showTableRows: boolean;
  servicesData: ServicesData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const HBACServiceGroupsTable = (props: PropsToTable) => {
  // Retrieve data from props
  const shownServicesList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    cn: "Service group name",
    description: "Description",
  };

  const isServiceSelected = (service: HBACServiceGroup) => {
    if (
      props.servicesData.selectedServices.find(
        (selectedService) => selectedService.cn[0] === service.cn[0]
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
    service: HBACServiceGroup,
    rowIndex: number,
    isSelecting: boolean
  ) => {
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
        props.servicesData.setServicesSelected(
          shownServicesList[index],
          isSelecting
        )
      );
    } else {
      props.servicesData.setServicesSelected(service, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update selected array
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

  // Reset selected array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.servicesData.clearSelectedServices();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any entry is selected)
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
      <Th modifier="wrap" aria-label="Select rows"></Th>
      <Th modifier="wrap">{columnNames.cn}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownServicesList.map((service, rowIndex) => (
    <Tr key={service.cn} id={service.cn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectService(service, rowIndex, isSelecting),
          isSelected: isServiceSelected(service),
          isDisabled: !props.servicesData.isHbacServiceSelectable(service),
        }}
      />
      <Td dataLabel={columnNames.cn}>
        <Link to={"/hbac-service-groups/" + service.cn} state={service}>
          {service.cn}
        </Link>
      </Td>
      <Td dataLabel={columnNames.description}>{service.description}</Td>
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
      ariaLabel={"HBAC service groups table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v6-u-mt-md"}
      tableId={"hbacrservicegroups-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default HBACServiceGroupsTable;
