import React, { useEffect, useState } from "react";
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import SettingsTableLayout from "src/components/layouts/SettingsTableLayout";
// Modals
import DualListLayout from "src/components/layouts/DualListLayout";
import RemoveSelinuxUserMapMembersModal from "src/components/modals/SelinuxUserMapModals/RemoveSelinuxUserMapMembers";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// React Router DOM
import { Link } from "react-router";
// RPC
import { ErrorResult } from "../../services/rpc";
import {
  useRemoveMembersFromSelinuxUserMapMutation,
  useAddMembersToSelinuxUserMapMutation,
} from "../../services/rpcSelinuxUserMaps";

interface PropsToTable {
  from: "user" | "group" | "host" | "hostgroup";
  id: string;
  members: string[];
  fromLabel?: string;
  onRefresh: () => void;
  unsetCategory: boolean;
}

const SELinuxUserMapsMemberTable = (props: PropsToTable) => {
  const dispatch = useAppDispatch();

  const [addMember] = useAddMembersToSelinuxUserMapMutation();
  const [removeMembers] = useRemoveMembersFromSelinuxUserMapMutation();

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
  }

  // PaginationPrep
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [totalCount, setMemberTotalCount] = useState<number>(
    props.members.length
  );

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
      setPage(1);
      return;
    }

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
    addMember([props.id, props.from, newMembers, props.unsetCategory]).then(
      (response) => {
        if ("data" in response) {
          const results = response.data?.result.results;
          for (const result in results) {
            if (results[result].error) {
              dispatch(
                addAlert({
                  name: "add-member-error",
                  title: results[result].error,
                  variant: "danger",
                })
              );
              setAddSpinning(false);
              return;
            }
          }
          const newRuleMembers = members.concat(newMembers);
          setMembers(newRuleMembers);
          setSearchValue("");
          dispatch(
            addAlert({
              name: "add-member-success",
              title:
                "Added " +
                (props.fromLabel ? props.fromLabel : props.from) +
                " to SELinux user map",
              variant: "success",
            })
          );
          props.onRefresh();
          setAddSpinning(false);
          setShowAddModal(false);
          setPage(1);
        }
      }
    );
  };

  const onRemoveMembers = (selectedMembers: string[]) => {
    setDeleteSpinning(true);

    removeMembers([props.id, props.from, selectedMembers]).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          dispatch(
            addAlert({
              name: "remove-member-success",
              title:
                "Removed " +
                (props.fromLabel ? props.fromLabel : props.from) +
                " from SELinux user map " +
                props.id,
              variant: "success",
            })
          );
          const newMembers = members.filter(
            (entry) => !selectedMembers.includes(entry)
          );
          setMembers(newMembers);
          setShowDeleteModal(false);
          setSearchValue("");
          props.onRefresh();
          setPage(1);
        } else if (response.data?.error) {
          const errorMessage = response.data.error as unknown as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-member-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
      setDeleteSpinning(false);
    });
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

  const isEntrySelected = (user: string) => selectedMembers.includes(user);

  const areAllEntriesSelected =
    selectedMembers.length === tableMembers.length && tableMembers.length !== 0;

  const selectAllUsers = (isSelecting = true) => {
    setSelectedMembers(isSelecting ? tableMembers : []);
    setIsDeleteDisabled(isSelecting ? false : true);
  };

  const setMemberSelected = (member: string, isSelecting = true) =>
    setSelectedMembers((prevSelected) => {
      const otherSelectedMembers = prevSelected.filter((r) => r !== member);
      return isSelecting
        ? [...otherSelectedMembers, member]
        : otherSelectedMembers;
    });

  const onSelectMember = (
    member: string,
    rowIndex: number,
    isSelecting: boolean
  ) => {
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
    setIsDeleteDisabled(false);
  };

  useEffect(() => {
    if (selectedMembers.length === 0) {
      setIsDeleteDisabled(true);
    }
  }, [selectedMembers]);

  const paginationData = {
    page,
    perPage,
    onUpdatePage: setPage,
    onUpdatePerPage: setPerPage,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onCloseAddHandler = () => {
    setShowAddModal(false);
  };

  const onCloseDeleteHandler = () => {
    setShowDeleteModal(false);
  };

  const onClickAddHandler = () => {
    setShowAddModal(true);
  };

  const onClickDeleteHandler = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className="pf-v6-u-mr-md pf-v6-u-ml-xl">
      <SettingsTableLayout
        ariaLabel={props.from + " table in SELinux user map"}
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
          "s to SELinux user map"
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
        <RemoveSelinuxUserMapMembersModal
          elementType={props.from}
          label={props.fromLabel}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedMembers}
          removeMembers={onRemoveMembers}
          spinning={deleteSpinning}
        />
      )}
    </div>
  );
};

export default SELinuxUserMapsMemberTable;
