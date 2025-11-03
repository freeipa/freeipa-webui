import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Form
import IpaTextInputFromList from "./../IpaTextInputFromList";
// Modals
import AddTextInputFromListModal from "../../modals/AddTextInputFromListModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
// RTK
import { ErrorResult } from "src/services/rpc";
import {
  useAddHostPrincipalAliasMutation,
  useRemoveHostPrincipalAliasMutation,
} from "src/services/rpcHosts";
import {
  useAddPrincipalAliasMutation,
  useRemovePrincipalAliasMutation,
  useAddStagePrincipalAliasMutation,
  useRemoveStagePrincipalAliasMutation,
} from "src/services/rpcUsers";
import {
  useAddServicePrincipalAliasMutation,
  useRemoveServicePrincipalAliasMutation,
} from "src/services/rpcServices";
// Layouts
import SecondaryButton from "../../layouts/SecondaryButton";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// Utils
import { getRealmFromKrbPolicy } from "src/utils/utils";
import { IPAObject } from "src/utils/ipaObjectUtils";

export interface PrincipalAliasMultiTextBoxProps {
  dataCy: string;
  ipaObject: Record<string, unknown>;
  metadata: Metadata;
  onRefresh: () => void;
  from:
    | "active-users"
    | "stage-users"
    | "preserved-users"
    | "hosts"
    | "services";
}

const getPrincipalAliasMutations = (from: string) => {
  if (from === "stage-users") {
    const [addPrincipalAlias] = useAddStagePrincipalAliasMutation();
    const [removePrincipalAlias] = useRemoveStagePrincipalAliasMutation();
    return [addPrincipalAlias, removePrincipalAlias];
  } else if (from === "hosts") {
    const [addPrincipalAlias] = useAddHostPrincipalAliasMutation();
    const [removePrincipalAlias] = useRemoveHostPrincipalAliasMutation();
    return [addPrincipalAlias, removePrincipalAlias];
  } else if (from === "services") {
    const [addPrincipalAlias] = useAddServicePrincipalAliasMutation();
    const [removePrincipalAlias] = useRemoveServicePrincipalAliasMutation();
    return [addPrincipalAlias, removePrincipalAlias];
  }

  // active-users, preserved-users
  const [addPrincipalAlias] = useAddPrincipalAliasMutation();
  const [removePrincipalAlias] = useRemovePrincipalAliasMutation();
  return [addPrincipalAlias, removePrincipalAlias];
};

const getObjectID = (from: string, ipaObject: IPAObject) => {
  if (from === "hosts") return ipaObject.fqdn;
  if (from === "services") return ipaObject.krbcanonicalname;
  return ipaObject.uid;
};

const PrincipalAliasMultiTextBox = (props: PrincipalAliasMultiTextBoxProps) => {
  const dispatch = useAppDispatch();

  // RTK hooks
  const [addPrincipalAlias, removePrincipalAlias] = getPrincipalAliasMutations(
    props.from
  );
  const objectID = getObjectID(props.from, props.ipaObject);

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
  const [aliasIdxToDelete, setAliasIdxToDelete] = React.useState<number>(999); // Assumption: There will never be 999 alias
  const [messageDeletionConf, setMessageDeletionConf] = React.useState("");
  const [messageDeletionObj, setMessageDeletionObj] = React.useState("");
  const [modalSpinning, setModalSpinning] = React.useState(false);

  const onRemoveAlias = (idx: number) => {
    // Get the specific index of the element to remove
    setAliasIdxToDelete(idx);
    // Set message to show on the deletion confirmation modal
    const aliasToDelete = krbprincipalname[idx];
    setMessageDeletionConf("Do you want to remove kerberos alias?");
    setMessageDeletionObj(aliasToDelete);

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
      data-cy="modal-button-delete"
      key="del-principal-alias"
      variant="danger"
      onClick={() => onRemovePrincipalAlias(aliasIdxToDelete)}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Deleting"
      spinnerAriaLabelledBy="Deleting"
      spinnerAriaLabel="Deleting"
    >
      {modalSpinning ? " Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseDeletionConfModal}
    >
      Cancel
    </Button>,
  ];

  // Add 'principal alias'
  const onAddPrincipalAlias = () => {
    const payload = [objectID, [newAliasValue]];
    setModalSpinning(true);

    addPrincipalAlias(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close modal
          setIsTextInputModalOpen(false);
          setModalSpinning(false);
          // Set alert: success
          dispatch(
            addAlert({
              name: "add-alias-success",
              title: "Added new aliases to '" + objectID + "'",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "add-alias-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
        // Refresh data to show new changes in the UI
        setModalSpinning(false);
        props.onRefresh();
      }
    });
  };

  // Remove handler
  const onRemovePrincipalAlias = (idx: number) => {
    const aliasList = [...krbprincipalname];
    const elementToRemove = aliasList[idx];

    // Set payload
    const payload = [objectID, [elementToRemove]];
    setModalSpinning(true);
    removePrincipalAlias(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Close modal
          setIsDeleteConfModalOpen(false);
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "remove-alias-success",
              title: "Removed aliases from '" + objectID + "'",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "remove-alias-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
        // Refresh data to show new changes in the UI
        setModalSpinning(false);
        props.onRefresh();
      }
    });
  };

  const textInputModalActions = [
    <SecondaryButton
      dataCy="modal-button-add"
      key="add-principal-alias"
      onClickHandler={onAddPrincipalAlias}
      isDisabled={
        (newAliasValue !== "" && !newAliasValue.includes("@")) ||
        modalSpinning ||
        areRealmsMatching
          ? false
          : true
      }
      isLoading={modalSpinning}
      spinnerAriaValueText="Adding"
      spinnerAriaLabelledBy="Adding"
      spinnerAriaLabel="Adding"
    >
      {modalSpinning ? "Adding" : "Add"}
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseTextInputModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <IpaTextInputFromList
        dataCy={props.dataCy}
        name="krbprincipalname"
        elementsList={krbprincipalname}
        ipaObject={props.ipaObject}
        metadata={props.metadata}
        onOpenModal={onOpenTextInputModal}
        onRemove={onRemoveAlias}
        from={props.from === "hosts" ? "host" : "user"}
        isPrincipalAlias
      />
      <AddTextInputFromListModal
        dataCy={props.dataCy}
        id="kerberos-principal-textinput"
        newValue={newAliasValue}
        setNewValue={setNewAliasValue}
        title={"Add kerberos principal alias"}
        isOpen={isTextInputModalOpen}
        onClose={onCloseTextInputModal}
        actions={textInputModalActions}
        textInputTitle={"New kerberos principal alias"}
        textInputName="krbprincipalname"
        textInputValidator={areRealmsMatching}
      />
      <ConfirmationModal
        dataCy="remove-kerberos-alias-modal"
        title={"Remove kerberos alias"}
        isOpen={isDeleteConfModalOpen}
        onClose={onCloseDeletionConfModal}
        actions={deletionConfModalActions}
        messageText={messageDeletionConf}
        messageObj={messageDeletionObj}
      />
    </>
  );
};

export default PrincipalAliasMultiTextBox;
