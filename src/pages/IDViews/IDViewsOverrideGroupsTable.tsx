import React, { useEffect } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { IDViewOverrideGroup } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// Hooks
import useShifting from "src/hooks/useShifting";

interface IDViewsOverrideData {
  isSelectable: (view: IDViewOverrideGroup) => boolean;
  selected: string[];
  selectableTable: IDViewOverrideGroup[];
  setSelectedGroups: (group: string[]) => void;
  clearSelected: () => void;
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
  elementsList: IDViewOverrideGroup[];
  shownElementsList: IDViewOverrideGroup[];
  showTableRows: boolean;
  overrideEntryData: IDViewsOverrideData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
}

const IDViewsOverrideGroupsTable = (props: PropsToTable) => {
  // Retrieve views data from props
  const shownGroupsList = [...props.shownElementsList];

  // Column names
  const groupColumnNames = {
    ipaanchoruuid: "Group to override",
    cn: "Group name",
    gidnumber: "GID",
    description: "Description",
  };
  // - Returns 'True' if a specific table group has been selected
  const isOverrideSelected = (group: IDViewOverrideGroup) =>
    props.overrideEntryData.selected.includes(group.ipaanchoruuid[0]);

  // On selecting one single row
  const onSelect = useShifting(
    shownGroupsList,
    props.overrideEntryData.setSelectedGroups
  );

  // Reset 'selectedViewIds' array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.overrideEntryData.clearSelected();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any host selected)
  useEffect(() => {
    if (props.overrideEntryData.selected.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.overrideEntryData.selected.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.overrideEntryData.selected]);

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap"></Th>
      <Th modifier="wrap">{groupColumnNames.ipaanchoruuid}</Th>
      <Th modifier="wrap">{groupColumnNames.cn}</Th>
      <Th modifier="wrap">{groupColumnNames.gidnumber}</Th>
      <Th modifier="wrap">{groupColumnNames.description}</Th>
    </Tr>
  );

  const body = shownGroupsList.map((group, rowIndex) => (
    <Tr key={group.ipaanchoruuid} id={group.ipaanchoruuid}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelect(group.ipaanchoruuid[0], rowIndex, isSelecting),
          isSelected: isOverrideSelected(group),
          isDisabled: !props.overrideEntryData.isSelectable(group),
        }}
      />
      <Td dataLabel={groupColumnNames.ipaanchoruuid}>{group.ipaanchoruuid}</Td>
      <Td dataLabel={groupColumnNames.cn}>{group.cn}</Td>
      <Td dataLabel={groupColumnNames.gidnumber}>{group.gidnumber}</Td>
      <Td dataLabel={groupColumnNames.description}>{group.description}</Td>
    </Tr>
  ));

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"No groups"}
    />
  );

  return (
    <TableLayout
      ariaLabel={"ID views override group table"}
      variant={"compact"}
      hasBorders={true}
      tableId={"id-views-override-group-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default IDViewsOverrideGroupsTable;
