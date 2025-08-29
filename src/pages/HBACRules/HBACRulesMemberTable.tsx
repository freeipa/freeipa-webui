import React, { useEffect, useState } from "react";
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import SettingsTableLayout from "src/components/layouts/SettingsTableLayout";
// Modals
import DualListLayout from "src/components/layouts/DualListLayout";
import RemoveHBACRuleMembersModal from "src/components/modals/HbacModals/RemoveHBACRuleMembers";
// Hooks
import { useAlerts } from "../../hooks/useAlerts";
// React Router DOM
import { Link } from "react-router-dom";
// RPC
import { ErrorResult } from "../../services/rpc";
import {
  useRemoveMembersFromHbacRuleMutation,
  useAddMembersToHbacRuleMutation,
} from "../../services/rpcHBACRules";

// These name spaces can be reused as the params to RPC (do not change them)
interface PropsToTable {
  from: "user" | "group" | "host" | "hostgroup" | "hbacsvc" | "hbacsvcgroup";
  id: string;
  members: string[];
  fromLabel?: string;
  onRefresh: () => void;
  unsetCategory: boolean;
}

const HBACRulesMemberTable = (props: PropsToTable) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const [addMemberToHbacRule] = useAddMembersToHbacRuleMutation();
  const [removeMembersFromHbacRule] = useRemoveMembersFromHbacRuleMutation();

  const [members, setMembers] = useState(props.members);
  const [tableMembers, setTableMembers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [deleteSpinning, setDeleteSpinning] = useState<boolean>(false);
  const [addSpinning, setAddSpinning] = useState<boolean>(false);

  // URL handling
  let entryURL = "";
  if (props.from === "user") {
    entryURL = "/active-users/";
  } else if (props.from === "group") {
    entryURL = "/user-groups/";
  } else if (props.from === "host") {
    entryURL = "/hosts/";
  } else if (props.from === "hostgroup") {
    entryURL = "/host-groups/";
  } else if (props.from === "hbacsvc") {
    entryURL = "/hbac-services/";
  } else {
    // "servicegroup"
    entryURL = "/hbac-service-groups/";
  }

  // PaginationPrep
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [totalCount, setMemberTotalCount] = useState<number>(
    props.members.length
  );
  const updateSelectedPerPage = () => {
    // Nothing to do since we are not using bulk selector comp
    return;
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  const resetEntries = () => {
    const firstIdx = (page - 1) * perPage;
    const lastIdx = page * perPage;
    const memberList: string[] = [];
    for (
      let i = firstIdx;
      i < props.members.length && memberList.length < lastIdx;
      i++
    ) {
      memberList.push(props.members[i]);
    }
    memberList.sort();
    setMemberTotalCount(props.members.length);
    setSelectedMembers([]);
    setTableMembers(memberList);
  };

  // Page indexes
  useEffect(() => {
    resetEntries();
  }, [page, perPage, props.members]);

  const onSearchChange = (value: string) => {
    if (value === "") {
      // Reset page will reset member list
      setPage(1);
      return;
    }

    // Filter our current list
    const firstIdx = (page - 1) * perPage;
    const lastIdx = page * perPage;
    const memberList: string[] = [];
    let count = 0;
    for (let i = firstIdx; i < props.members.length && count < lastIdx; i++) {
      if (props.members[i].toLowerCase().includes(value.toLowerCase())) {
        memberList.push(props.members[i]);
        count += 1;
      }
    }
    memberList.sort();
    setSelectedMembers([]);
    setTableMembers(memberList);
  };

  const addMembers = (newMembers: string[]) => {
    setAddSpinning(true);
    addMemberToHbacRule([
      props.id,
      props.from,
      newMembers,
      props.unsetCategory,
    ]).then((response) => {
      if ("data" in response) {
        const results = response.data?.result.results;
        for (const result in results) {
          if (results[result].error) {
            alerts.addAlert(
              "add-member-error",
              results[result].error,
              "danger"
            );
            setAddSpinning(false);
            return;
          }
        }
        // Update displayed members before they are updated via refresh
        const newRuleMembers = members.concat(newMembers);
        setMembers(newRuleMembers);
        setSearchValue("");
        // Set alert: success
        alerts.addAlert(
          "add-member-success",
          "Added " +
            (props.fromLabel ? props.fromLabel : props.from) +
            " to HBAC rule",
          "success"
        );
        props.onRefresh();
        setAddSpinning(false);
        setShowAddModal(false);
        setPage(1);
      }
    });
  };

  const removeMembers = (selectedMembers: string[]) => {
    setDeleteSpinning(true);

    removeMembersFromHbacRule([props.id, props.from, selectedMembers]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-member-success",
              "Removed " +
                (props.fromLabel ? props.fromLabel : props.from) +
                " from HBAC rule " +
                props.id,
              "success"
            );
            // Update displayed members
            const newNembers = members.filter(
              (entry) => !selectedMembers.includes(entry)
            );
            setMembers(newNembers);
            // Close modal
            setShowDeleteModal(false);
            setSearchValue("");
            // Refresh
            props.onRefresh();
            // Go back to page 1
            setPage(1);
          } else if (response.data?.error) {
            // Set alert: error
            const errorMessage = response.data.error as unknown as ErrorResult;
            alerts.addAlert(
              "remove-member-error",
              errorMessage.message,
              "danger"
            );
          }
        }
        setDeleteSpinning(false);
      }
    );
  };

  // 'Delete' button is disabled if no row is selected
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  // Column names (String)
  let columnNamesArray: string[] = [];
  if (props.fromLabel) {
    columnNamesArray = [props.fromLabel];
  } else {
    const columnName = props.from.charAt(0).toUpperCase() + props.from.slice(1);
    columnNamesArray = [columnName];
  }

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // Keyboard event to select rows
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

  // - Returns 'True' if a specific table entry has been selected
  const isEntrySelected = (user: string) => selectedMembers.includes(user);

  const areAllEntriesSelected =
    selectedMembers.length === tableMembers.length && tableMembers.length !== 0;

  // - Select all entries
  const selectAllUsers = (isSelecting = true) => {
    setSelectedMembers(isSelecting ? tableMembers : []);
    setIsDeleteDisabled(isSelecting ? false : true);
  };

  // - Helper method to set the selected entry from the table
  const setMemberSelected = (member: string, isSelecting = true) =>
    setSelectedMembers((prevSelected) => {
      const otherSelectedMembers = prevSelected.filter((r) => r !== member);
      return isSelecting
        ? [...otherSelectedMembers, member]
        : otherSelectedMembers;
    });

  // - On selecting one single row
  const onSelectMember = (
    member: string,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the element is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
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
        setMemberSelected(member[index], isSelecting)
      );
    } else {
      setMemberSelected(member, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
    // Enable 'Delete' button
    setIsDeleteDisabled(false);
  };

  // Disable 'Delete' button when no elements selected
  useEffect(() => {
    if (selectedMembers.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedMembers]);

  // Entries displayed on the first page
  const updateShownEntriesList = (newShownEntriesList: string[]) => {
    setTableMembers(newShownEntriesList);
  };

  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownEntriesList,
    totalCount,
  };

  // Header
  const header = (
    <Tr>
      <Th
        select={{
          onSelect: (_event, isSelecting) => selectAllUsers(isSelecting),
          isSelected: areAllEntriesSelected,
          isDisabled: tableMembers.length === 0 ? true : false,
        }}
      />
      <Th width={10}>{columnNamesArray[0]}</Th>
    </Tr>
  );

  // Body
  const body = tableMembers.map((entry, rowIndex) => (
    <Tr key={entry} id={entry}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectMember(entry, rowIndex, isSelecting),
          isSelected: isEntrySelected(entry),
          isDisabled: false,
        }}
      />
      <Td dataLabel={columnNamesArray[0]}>
        <Link to={entryURL + entry} state={tableMembers[rowIndex]}>
          {entry}
        </Link>
      </Td>
    </Tr>
  ));

  // Modal functionality
  // - Show modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // - Close 'Add' modal
  const onCloseAddHandler = () => {
    setShowAddModal(false);
  };

  // - close 'Delete' button
  const onCloseDeleteHandler = () => {
    setShowDeleteModal(false);
  };

  // - 'Add' button -> Open modal
  const onClickAddHandler = () => {
    setShowAddModal(true);
  };

  // - 'Delete' button -> Remove table entry
  const onClickDeleteHandler = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className="pf-v6-u-mr-md pf-v6-u-ml-xl">
      <alerts.ManagedAlerts />
      <SettingsTableLayout
        ariaLabel={props.from + " table in HBAC rules"}
        variant="compact"
        hasBorders={true}
        name={props.from}
        tableId={props.from + "-table"}
        isStickyHeader={false}
        tableHeader={header}
        tableBody={body}
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={onClickAddHandler}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        paginationData={paginationData}
        list={props.members}
        entryType={props.fromLabel ? props.fromLabel : props.from}
      />
      <DualListLayout
        entry={props.id}
        target={props.from}
        title={
          "Add " +
          (props.fromLabel ? props.fromLabel : props.from) +
          "s to HBAC rule"
        }
        showModal={showAddModal}
        onCloseModal={onCloseAddHandler}
        onOpenModal={onClickAddHandler}
        action={addMembers}
        spinning={addSpinning}
        addBtnName="Add"
        addSpinningBtnName="Adding"
        tableElementsList={tableMembers}
      />
      {showDeleteModal && (
        <RemoveHBACRuleMembersModal
          elementType={props.from}
          label={props.fromLabel}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedMembers}
          removeMembers={removeMembers}
          spinning={deleteSpinning}
        />
      )}
    </div>
  );
};

export default HBACRulesMemberTable;
