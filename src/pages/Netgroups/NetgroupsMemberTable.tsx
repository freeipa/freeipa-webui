import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { Td, Th, Tr } from "@patternfly/react-table";
// Layout
import SettingsTableLayout from "src/components/layouts/SettingsTableLayout";
// Modals
import DualListLayout from "src/components/layouts/DualListLayout";
import RemoveNetgroupMembersModal from "src/components/modals/RemoveNetgroupMembers";
// Hooks
import { useAlerts } from "../../hooks/useAlerts";
// React Router DOM
import { Link } from "react-router-dom";
import { Netgroup } from "../../utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "../../services/rpc";
import {
  useSaveNetgroupMutation,
  useAddMemberToNetgroupsMutation,
  useRemoveMemberFromNetgroupsMutation,
} from "../../services/rpcNetgroups";

// These name spaces can be reused as the params to RPC (do not change them)
interface PropsToTable {
  from: "user" | "group" | "host" | "hostgroup" | "netgroup" | "externalHost";
  id: string;
  members: string[];
  fromLabel?: string;
  onRefresh: () => void;
  unsetCategory: boolean;
}

const NetgroupsMemberTable = (props: PropsToTable) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const [saveNetgroup] = useSaveNetgroupMutation();
  const [addMemberToNetgroups] = useAddMemberToNetgroupsMutation();
  const [removeMembersFromNetgroups] = useRemoveMemberFromNetgroupsMutation();

  const [members, setMembers] = useState(props.members);
  const [tableMembers, setTableMembers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [deleteSpinning, setDeleteSpinning] = useState<boolean>(false);

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
  } else {
    // external, handled differently
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

  // External host modal
  const [externalHostName, setExternalHost] = useState<string>("");
  const [addSpinning, setAddSpinning] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openExternalModal = () => {
    setExternalHost("");
    setModalOpen(true);
  };
  const closeExternalModal = () => {
    setModalOpen(false);
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
    let type = props.from;
    if (props.from === "externalHost") {
      type = "host";
    }
    setAddSpinning(true);
    addMemberToNetgroups([props.id, type, newMembers]).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Update displayed netgroups before they are updated via refresh
          const newNetgroups = members.concat(newMembers);
          setMembers(newNetgroups);
          setSearchValue("");

          if (props.unsetCategory) {
            // Ok need to unset the category attribute via a nested update
            const group: Partial<Netgroup> = {};
            group.cn = props.id;
            if (props.from === "user" || props.from === "group") {
              group.usercategory = "";
            } else {
              group.hostcategory = "";
            }
            saveNetgroup(group).then((modResponse) => {
              if ("data" in modResponse) {
                if (modResponse.data?.error) {
                  const errorMessage = modResponse.data
                    .error as unknown as ErrorResult;
                  alerts.addAlert(
                    "update-netgroup-error",
                    errorMessage.message,
                    "danger"
                  );
                  setAddSpinning(false);
                  return;
                } else {
                  // Set alert: success
                  alerts.addAlert(
                    "update-success",
                    "Added " + props.from + " to netgroup",
                    "success"
                  );
                  props.onRefresh();
                  setAddSpinning(false);
                  setShowAddModal(false);
                  closeExternalModal();
                  setPage(1);
                }
              }
            });
          } else {
            // Set alert: success
            alerts.addAlert(
              "add-member-success",
              "Added " + props.from + " to netgroup",
              "success"
            );
            props.onRefresh();
            setAddSpinning(false);
            setShowAddModal(false);
            closeExternalModal();
            setPage(1);
          }
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
          setAddSpinning(false);
        }
      }
    });
  };

  const removeMembers = (selectedMembers: string[]) => {
    let type = props.from;
    if (props.from === "externalHost") {
      type = "host";
    }
    setDeleteSpinning(true);
    removeMembersFromNetgroups([props.id, type, selectedMembers]).then(
      (response) => {
        if ("data" in response) {
          if (response.data?.result) {
            // Set alert: success
            alerts.addAlert(
              "remove-netgroups-success",
              "Removed " + props.from + " from netgroup " + props.id,
              "success"
            );
            // Update displayed netgroups
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
              "remove-netgroups-error",
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
        {props.from !== "externalHost" ? (
          <Link to={entryURL + entry} state={tableMembers[rowIndex]}>
            {entry}
          </Link>
        ) : (
          entry
        )}
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

  const target = props.from === "externalHost" ? "host" : props.from;

  return (
    <div className="pf-v6-u-mr-md pf-v6-u-ml-xl">
      <alerts.ManagedAlerts />
      <SettingsTableLayout
        ariaLabel={props.from + " table in netgroups"}
        variant="compact"
        hasBorders={true}
        name={props.from}
        tableId={props.from + "-table"}
        isStickyHeader={false}
        tableHeader={header}
        tableBody={body}
        onDeleteModal={onClickDeleteHandler}
        isDeleteDisabled={isDeleteDisabled}
        onAddModal={
          props.from === "externalHost" ? openExternalModal : onClickAddHandler
        }
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        paginationData={paginationData}
        list={props.members}
        entryType={props.fromLabel ? props.fromLabel : props.from}
      />
      {showAddModal && (
        <DualListLayout
          entry={props.id}
          target={target}
          title={
            "Add " +
            (props.fromLabel ? props.fromLabel : props.from) +
            "s to netgroup"
          }
          showModal={showAddModal}
          onCloseModal={onCloseAddHandler}
          onOpenModal={onClickAddHandler}
          action={addMembers}
          tableElementsList={props.members}
          spinning={addSpinning}
          addBtnName="Add"
          addSpinningBtnName="Adding"
        />
      )}
      {showDeleteModal && (
        <RemoveNetgroupMembersModal
          elementType={props.from}
          label={props.fromLabel}
          showModal={showDeleteModal}
          closeModal={onCloseDeleteHandler}
          elementsToDelete={selectedMembers}
          removeMembers={removeMembers}
          spinning={deleteSpinning}
        />
      )}
      <Modal
        data-cy="add-external-host-modal"
        variant="small"
        isOpen={modalOpen}
        onClose={closeExternalModal}
      >
        <ModalHeader
          title={"Add external host"}
          labelId="add-external-host-modal-title"
        />
        <ModalBody id="add-external-host-modal-body">
          <Form id={"external-modal"}>
            <FormGroup
              key={"externalHostName"}
              label={"External hostname"}
              fieldId={"externalHostName"}
              isRequired
            >
              <TextInput
                data-cy="modal-textbox-external-host-name"
                type="text"
                id="externalHostName"
                name="externalHostName"
                value={externalHostName}
                validated={
                  externalHostName === "" || !externalHostName.includes(".")
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
                onChange={(_event, value: string) => setExternalHost(value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="modal-button-add"
            key="add-new-host"
            isDisabled={
              externalHostName === "" ||
              !externalHostName.includes(".") ||
              addSpinning
            }
            onClick={() => addMembers([externalHostName])}
            spinnerAriaValueText="Adding"
            spinnerAriaLabel="Adding"
            isLoading={addSpinning}
          >
            {addSpinning ? "Adding" : "Add"}
          </Button>
          <Button
            data-cy="modal-button-cancel"
            key="cancel-new-host"
            variant="link"
            onClick={closeExternalModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NetgroupsMemberTable;
