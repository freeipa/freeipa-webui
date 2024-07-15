import React from "react";
// PatternFly
import {
  Button,
  Pagination,
  PaginationVariant,
  TextInput,
} from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "./MemberTable";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";

import {
  MemberPayload,
  useAddAsMemberMutation,
  useRemoveAsMemberMutation,
} from "src/services/rpcUserGroups";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";

interface PropsToMembersExternal {
  entity: Partial<UserGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_external: string[];
  membershipDisabled?: boolean;
}

const MembersExternal = (props: PropsToMembersExternal) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Get parameters from URL
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Other states
  const [externalsSelected, setExternalsSelected] = React.useState<string[]>(
    []
  );

  // Choose the correct externals based on the membership direction
  const [externals, setExternals] = React.useState(props.member_external || []);
  const isExternal =
    props.entity.objectclass?.includes("ipaexternalgroup") || false;

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else {
      // Return 'group' as default
      return "group";
    }
  };

  // Computed "states"
  const someItemSelected = externalsSelected.length > 0;
  const showTableRows = externals.length > 0;
  const entityType = getEntityType();
  const externalColumnNames = ["External member"];
  const externalProperties = externals;

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled = !props.isDataLoading;
  const isDeleteEnabled = someItemSelected;
  const isAddButtonEnabled = isExternal && isRefreshButtonEnabled;

  // API calls
  const [addExternalMember] = useAddAsMemberMutation();
  const [removeExternalMembers] = useRemoveAsMemberMutation();

  // Add
  const [newMember, setNewMember] = React.useState("");

  // - Fields
  const fieldsToAddModal = [
    {
      id: "New external member",
      name: "External member",
      pfComponent: (
        <TextInput
          id="new-external-member"
          name="ipaexternalmember"
          value={newMember}
          onChange={(_event, value) => setNewMember(value)}
          type="text"
          aria-label="new external member"
        />
      ),
    },
  ];

  // - Reset value on close modal
  React.useEffect(() => {
    if (!showAddModal) {
      setNewMember("");
    }
  }, [showAddModal]);

  // - Actions
  const actionsToAddModal = [
    <Button
      key="add-new-external"
      variant="secondary"
      isDisabled={newMember.length === 0}
      form="new-external-member"
      onClick={() => onAddExternal([{ key: newMember, title: newMember }])}
    >
      Add
    </Button>,
    <Button
      key="cancel-new-external"
      variant="link"
      onClick={() => setShowAddModal(false)}
    >
      Cancel
    </Button>,
  ];

  const onAddExternal = (items: AvailableItems[]) => {
    const newExternalNames = items.map((item) => item.key);
    if (props.id === undefined || newExternalNames.length == 0) {
      return;
    }

    const payload = {
      userGroup: props.id,
      entityType: "ipaexternalmember",
      idsToAdd: newExternalNames,
    } as MemberPayload;

    addExternalMember(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new externals to " + entityType + " " + props.id,
            "success"
          );
          // Update displayed externals before they are updated via refresh
          setExternals(newExternalNames);

          // Refresh data
          props.onRefreshData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
        }
      }
    });
  };

  // Delete
  const onDeleteExternal = () => {
    const payload = {
      userGroup: props.id,
      entityType: "ipaexternalmember",
      idsToAdd: externalsSelected,
    } as MemberPayload;

    removeExternalMembers(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-members-success",
            "Removed members from " + entityType + " '" + props.id + "'",
            "success"
          );
          // Update displayed externals
          const newExternals = externals.filter(
            (external) => !externalsSelected.includes(external)
          );
          setExternals(newExternals);
          // Update data
          setExternalsSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Refresh
          props.onRefreshData();
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-externals-error",
            errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      <MemberOfToolbar
        searchText={searchValue}
        onSearchTextChange={setSearchValue}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch={() => {}}
        refreshButtonEnabled={isRefreshButtonEnabled}
        onRefreshButtonClick={props.onRefreshData}
        deleteButtonEnabled={isDeleteEnabled}
        onDeleteButtonClick={() => setShowDeleteModal(true)}
        addButtonEnabled={isAddButtonEnabled}
        onAddButtonClick={() => setShowAddModal(true)}
        helpIconEnabled={true}
        totalItems={externals.length}
        perPage={perPage}
        page={page}
        onPerPageChange={setPerPage}
        onPageChange={setPage}
      />
      <MemberTable
        entityList={externals}
        idKey="krbcanonicalname"
        columnNamesToShow={externalColumnNames}
        propertiesToShow={externalProperties}
        checkedItems={externalsSelected}
        onCheckItemsChange={setExternalsSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={externals.length}
        widgetId="pagination-options-menu-bottom"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => setPage(page)}
        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
      />
      {showAddModal && (
        <ModalWithFormLayout
          variantType="small"
          modalPosition="top"
          title={"Add external member"}
          formId={props.id}
          fields={fieldsToAddModal}
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          actions={actionsToAddModal}
        />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete " + entityType + " from External"}
          onDelete={onDeleteExternal}
        >
          <MemberTable
            entityList={externals.filter((external) =>
              externalsSelected.includes(external)
            )}
            columnNamesToShow={externalColumnNames}
            propertiesToShow={externalProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersExternal;
