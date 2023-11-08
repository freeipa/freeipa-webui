import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Form
import IpaTextInputFromList from "./IpaTextInputFromList";
// Modals
import AddTextInputFromListModal from "../modals/AddTextInputFromListModal";
import DeletionConfirmationModal from "../modals/DeletionConfirmationModal";
// RTK
import {
  ErrorResult,
  useAddPrincipalAliasMutation,
  useRemovePrincipalAliasMutation,
  useAddStagePrincipalAliasMutation,
  useRemoveStagePrincipalAliasMutation,
} from "src/services/rpc";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { getRealmFromKrbPolicy } from "src/utils/utils";

interface PrincipalAliasMultiTextBoxProps {
  ipaObject: Record<string, unknown>;
  metadata: Metadata;
  onRefresh: () => void;
  from: "active-users" | "stage-users" | "preserved-users";
}

const PrincipalAliasMultiTextBox = (props: PrincipalAliasMultiTextBoxProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RTK hooks
  let [addPrincipalAlias] = useAddPrincipalAliasMutation();
  if (props.from === "stage-users") {
    [addPrincipalAlias] = useAddStagePrincipalAliasMutation();
  }
  let [removePrincipalAlias] = useRemovePrincipalAliasMutation();
  if (props.from === "stage-users") {
    [removePrincipalAlias] = useRemoveStagePrincipalAliasMutation();
  }
  // 'krbprincipalname' value from ipaObject
  const krbprincipalname = props.ipaObject["krbprincipalname"] as string[];

  // TextInput Modal data
  const [isTextInputModalOpen, setIsTextInputModalOpen] = React.useState(false);
  const [newAliasValue, setNewAliasValue] = React.useState("");

  const onOpenTextInputModal = () => {
    setIsTextInputModalOpen(true);
  };

  const onCloseTextInputModal = () => {
    setIsTextInputModalOpen(false);
  };

  // Current realm
  const currentRealm = getRealmFromKrbPolicy(props.metadata);

  // Get realm from 'newAliasValue' (if any)
  const getRealmNewAliasValue = () => {
    const realm = newAliasValue.split("@")[1];
    return realm;
  };

  const newAliasValueRealm = getRealmNewAliasValue();

  // Validation for textInput: realm matches with the current realm (if specified)
  const areRealmsMatching =
    newAliasValue !== "" &&
    newAliasValue.includes("@") &&
    currentRealm !== "" &&
    newAliasValueRealm !== undefined &&
    newAliasValueRealm === currentRealm;

  // Deletion confirmation Modal data
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] =
    React.useState(false);
  const [aliasIdxToDelete, setAliasIdxToDelete] = React.useState<number>(999); // Asumption: There will never be 999 alias
  const [messageDeletionConf, setMessageDeletionConf] = React.useState("");

  const onRemoveAlias = (idx: number) => {
    // Get the specific index of the element to remove
    setAliasIdxToDelete(idx);
    // Set message to show on the deletion confirmation modal
    const aliasToDelete = krbprincipalname[idx];
    setMessageDeletionConf(
      "Do you want to remove kerberos alias " + aliasToDelete + "?"
    );
    // Open deletion confirmation modal
    onOpenDeletionConfModal();
  };

  const onOpenDeletionConfModal = () => {
    setIsDeleteConfModalOpen(true);
  };

  const onCloseDeletionConfModal = () => {
    setIsDeleteConfModalOpen(false);
  };

  const deletionConfModalActions = [
    <Button
      key="del-principal-alias"
      variant="danger"
      onClick={() => onRemovePrincipalAlias(aliasIdxToDelete)}
    >
      Delete
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseDeletionConfModal}>
      Cancel
    </Button>,
  ];

  // Add 'principal alias'
  const onAddPrincipalAlias = () => {
    const payload = [props.ipaObject.uid, [newAliasValue]];

    addPrincipalAlias(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsTextInputModalOpen(false);
          // Set alert: success
          alerts.addAlert(
            "add-alias-success",
            "Added new aliases to user '" + props.ipaObject.uid + "'",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("add-alias-error", errorMessage.message, "danger");
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  // Remove handler
  const onRemovePrincipalAlias = (idx: number) => {
    const aliasList = [...krbprincipalname];
    const elementToRemove = aliasList[idx];

    // Set payload
    const payload = [props.ipaObject.uid, [elementToRemove]];

    removePrincipalAlias(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          setIsDeleteConfModalOpen(false);
          // Show toast notification: success
          alerts.addAlert(
            "remove-alias-success",
            "Removed aliases from user '" + props.ipaObject.uid + "'",
            "success"
          );
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("remove-alias-error", errorMessage.message, "danger");
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  const textInputModalActions = [
    <SecondaryButton
      key="add-principal-alias"
      onClickHandler={onAddPrincipalAlias}
      // isDisabled={newAliasValue === "" ? true : false}
      isDisabled={
        (newAliasValue !== "" && !newAliasValue.includes("@")) ||
        areRealmsMatching
          ? false
          : true
      }
    >
      Add
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onCloseTextInputModal}>
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <IpaTextInputFromList
        name="krbprincipalname"
        elementsList={krbprincipalname}
        ipaObject={props.ipaObject}
        metadata={props.metadata}
        onOpenModal={onOpenTextInputModal}
        onRemove={onRemoveAlias}
      />
      <AddTextInputFromListModal
        newValue={newAliasValue}
        setNewValue={setNewAliasValue}
        title={"Add kerberos principal alias"}
        isOpen={isTextInputModalOpen}
        onClose={onCloseTextInputModal}
        actions={textInputModalActions}
        textInputTitle={"New kerberos principal alias"}
        textInputName="krbprincalname"
        textInputValidator={areRealmsMatching}
      />
      <DeletionConfirmationModal
        title={"Remove kerberos alias"}
        isOpen={isDeleteConfModalOpen}
        onClose={onCloseDeletionConfModal}
        actions={deletionConfModalActions}
        messageText={messageDeletionConf}
      />
    </>
  );
};

export default PrincipalAliasMultiTextBox;
