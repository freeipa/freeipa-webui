import React, { useEffect } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { IDViewOverrideUser } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// Hooks
import useShifting from "src/hooks/useShifting";

interface IDViewsOverrideData {
  isSelectable: (view: IDViewOverrideUser) => boolean;
  selected: string[];
  selectableTable: IDViewOverrideUser[];
  setSelected: (user: IDViewOverrideUser, isSelecting?: boolean) => void;
  setSelectedUsers: (users: string[]) => void;
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
  elementsList: IDViewOverrideUser[];
  shownElementsList: IDViewOverrideUser[];
  showTableRows: boolean;
  overrideEntryData: IDViewsOverrideData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
}

const IDViewsOverrideUsersTable = (props: PropsToTable) => {
  // Retrieve views data from props
  const shownUsersList = [...props.shownElementsList];

  // Column names
  const userColumnNames = {
    ipaanchoruuid: "User to override",
    uid: "User login",
    uidnumber: "UID",
    homedirectory: "Home directory",
    description: "Description",
  };
  // - Returns 'True' if a specific table user has been selected
  const isOverrideSelected = (user: IDViewOverrideUser) =>
    props.overrideEntryData.selected.includes(user.ipaanchoruuid[0]);

  // On selecting one single row
  const onSelect = useShifting(
    shownUsersList,
    props.overrideEntryData.setSelectedUsers
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
      <Th modifier="wrap">{userColumnNames.ipaanchoruuid}</Th>
      <Th modifier="wrap">{userColumnNames.uid}</Th>
      <Th modifier="wrap">{userColumnNames.uidnumber}</Th>
      <Th modifier="wrap">{userColumnNames.homedirectory}</Th>
      <Th modifier="wrap">{userColumnNames.description}</Th>
    </Tr>
  );

  const body = shownUsersList.map((user, rowIndex) => (
    <Tr key={user.ipaanchoruuid} id={user.ipaanchoruuid}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelect(user.ipaanchoruuid[0], rowIndex, isSelecting),
          isSelected: isOverrideSelected(user),
          isDisabled: !props.overrideEntryData.isSelectable(user),
        }}
      />
      <Td dataLabel={userColumnNames.ipaanchoruuid}>{user.ipaanchoruuid}</Td>
      <Td dataLabel={userColumnNames.uid}>{user.uid}</Td>
      <Td dataLabel={userColumnNames.uidnumber}>{user.uidnumber}</Td>
      <Td dataLabel={userColumnNames.homedirectory}>{user.homedirectory}</Td>
      <Td dataLabel={userColumnNames.description}>{user.description}</Td>
    </Tr>
  ));

  const skeleton = (
    <SkeletonOnTableLayout rows={4} colSpan={9} screenreaderText={"No users"} />
  );

  return (
    <TableLayout
      ariaLabel={"ID views override user table"}
      variant={"compact"}
      hasBorders={true}
      tableId={"id-views-override-user-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default IDViewsOverrideUsersTable;
