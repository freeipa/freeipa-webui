import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  TextArea,
} from "@patternfly/react-core";
// Components
import SecondaryButton from "../layouts/SecondaryButton";
import TextLayout from "../layouts/TextLayout";
// Modals
import ConfirmationModal from "../modals/ConfirmationModal";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// ipaObject utils
import { getParamProperties } from "src/utils/ipaObjectUtils";
import KeyIcon from "@patternfly/react-icons/dist/esm/icons/key-icon";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import {
  Command,
  ErrorResult,
  useSimpleMutCommandMutation,
} from "src/services/rpc";

interface PropsToSshPublicKeysModal {
  ipaObject: Record<string, unknown>;
  onChange: (ipaObject: Record<string, unknown>) => void;
  metadata: Metadata;
  onRefresh: () => void;
  from: "active-users" | "stage-users" | "preserved-users" | "hosts";
}

const IpaSshPublicKeys = (props: PropsToSshPublicKeysModal) => {
  const { readOnly, value } = getParamProperties({
    name: "ipasshpubkey",
    ipaObject: props.ipaObject,
    metadata: props.metadata,
    objectName: "user",
  });

  // Alerts to show in the UI
  const alerts = useAlerts();

  // States
  const [textAreaSshPublicKeysValue, setTextAreaSshPublicKeysValue] =
    React.useState("");
  const [isTextAreaSshPublicKeysOpen, setIsTextAreaSshPublicKeysOpen] =
    React.useState(false);
  const [sshPublicKeysList, setSshPublicKeysList] = React.useState<string[]>(
    (value as string[]) || []
  );

  const [idxSelected, setIdxSelected] = React.useState<number | null>(null);
  const [isSetButtonDisabled, setIsSetButtonDisabled] = React.useState(true);
  // Deletion modal
  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
  const [idxToDelete, setIdxToDelete] = React.useState<number>(999); // Asumption: There will never be 999 entries
  const [deletionMessage, setDeletionMessage] = React.useState("");
  const [deletionMessageObj, setDeletionMessageObj] = React.useState("");
  const [modalSpinning, setModalSpinning] = React.useState(false);

  // Updates SSH public keys list on every change
  React.useEffect(() => {
    if (value !== undefined) {
      setSshPublicKeysList(value as string[]);
    }
  }, [value]);

  // RPC hooks
  const [updateSSHKey] = useSimpleMutCommandMutation();

  const onCloseDeletionModal = () => {
    setIsDeletionModalOpen(false);
  };

  const deletionModalActions = [
    <Button
      key="del-ssh-key"
      variant="danger"
      onClick={() => onRemoveSSHKey(idxToDelete)}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Deleting"
      spinnerAriaLabelledBy="Deleting"
      spinnerAriaLabel="Deleting"
    >
      {modalSpinning ? "Deleting" : "Delete"}
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseDeletionModal}>
      Cancel
    </Button>,
  ];

  // Operation when deleting an entry
  const onDeleteSshKey = (idx: number) => {
    setIdxToDelete(idx);
    setDeletionMessage("Are you sure you want to delete SSH Public key?");
    setDeletionMessageObj(sshPublicKeysList[idx]);
    setIsDeletionModalOpen(true);
  };

  // Remove data (API call)
  const onRemoveSSHKey = (idx: number) => {
    let method = "";
    let id = "";
    if (props.from === "active-users" || props.from === "preserved-users") {
      method = "user_mod";
      id = props.ipaObject.uid as string;
    } else if (props.from === "stage-users") {
      method = "stageuser_mod";
      id = props.ipaObject.uid as string;
    } else if (props.from === "hosts") {
      method = "host_mod";
      id = props.ipaObject.fqdn as string;
    }
    // Prepare payload
    const payload: Command = {
      method: method,
      params: [
        [id],
        {
          delattr: "ipasshpubkey=" + sshPublicKeysList[idx],
        },
      ],
    };
    setModalSpinning(true);

    updateSSHKey(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-ssh-public-key-success",
            "Removed SSH public key from '" + id + "'",
            "success"
          );
          // Update internal list
          const newSshPublicKeysList = [...sshPublicKeysList];
          newSshPublicKeysList.splice(idx, 1);
          setSshPublicKeysList(newSshPublicKeysList);
          // Close things up and refresh
          setIsDeletionModalOpen(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "remove-ssh-public-key-error",
            errorMessage.message,
            "danger"
          );
          // Reset fields' values
          setIsDeletionModalOpen(false);
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
        setModalSpinning(false);
      }
    });
  };

  // On click 'Set' button (within modal)
  const onClickSetTextAreaSshPublicKeys = () => {
    // Prepare payload
    let method = "";
    let id = "";
    if (props.from === "active-users" || props.from === "preserved-users") {
      method = "user_mod";
      id = props.ipaObject.uid as string;
    } else if (props.from === "stage-users") {
      method = "stageuser_mod";
      id = props.ipaObject.uid as string;
    } else if (props.from === "hosts") {
      method = "host_mod";
      id = props.ipaObject.fqdn as string;
    } else {
      return;
    }
    // Get all the ssh keys
    const key_list = [...sshPublicKeysList, textAreaSshPublicKeysValue];

    // Prepare payload
    const payload: Command = {
      method: method,
      params: [
        [id],
        {
          ipasshpubkey: key_list,
        },
      ],
    };
    setModalSpinning(true);

    updateSSHKey(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close the modal
          setIsTextAreaSshPublicKeysOpen(false);
          // Set alert: success
          alerts.addAlert(
            "add-ssh-public-key-success",
            "Added SSH public key to '" + id + "'",
            "success"
          );
          // Update intenral list
          const newSshPublicKeysList = [...sshPublicKeysList];
          newSshPublicKeysList.push(textAreaSshPublicKeysValue);
          setSshPublicKeysList(newSshPublicKeysList);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "add-ssh-public-key-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
        setModalSpinning(false);
      }
    });
  };

  const onChangeTextAreaSshPublicKeysValue = (value: string) => {
    // Update text area state
    setTextAreaSshPublicKeysValue(value);
    // Enable 'Set' button
    if (value !== "") {
      setIsSetButtonDisabled(false);
    } else {
      setIsSetButtonDisabled(true);
    }
  };

  // on click 'Cancel' button (within modal)
  const onClickCancelTextAreaSshPublicKeys = () => {
    // No element index selected
    setIdxSelected(null);
    // Closes the modal
    setIsTextAreaSshPublicKeysOpen(false);
  };

  const openSshPublicKeysModal = () => {
    // Assign value to text area state
    setTextAreaSshPublicKeysValue("");
    // Open modal
    setIsTextAreaSshPublicKeysOpen(true);
  };

  // Update entry on the ssh public key list (from 'Show/Set' button)
  const onShowSetSshKey = (idx: number, sshKey: string) => {
    // Store idx
    setIdxSelected(idx);
    // Assign value to text area state
    setTextAreaSshPublicKeysValue(sshKey);
    // Open modal
    setIsTextAreaSshPublicKeysOpen(true);
  };

  const modal_actions = [
    <SecondaryButton
      key="set"
      onClickHandler={onClickSetTextAreaSshPublicKeys}
      isDisabled={isSetButtonDisabled || modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Setting"
      spinnerAriaLabelledBy="Setting"
      spinnerAriaLabel="Setting"
    >
      {modalSpinning ? "Setting" : "Set"}
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onClickCancelTextAreaSshPublicKeys}
    >
      Cancel
    </Button>,
  ];

  if (idxSelected !== null) {
    modal_actions.shift();
  }

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      {sshPublicKeysList !== undefined
        ? sshPublicKeysList.map((publicKey, idx) => {
            return (
              <div key={idx}>
                <Flex direction={{ default: "row" }}>
                  {publicKey !== "" && (
                    <>
                      <FlexItem>
                        <TextLayout component="small">
                          <KeyIcon /> Key (
                          {sshPublicKeysList[idx].split(" ")[0]})
                        </TextLayout>
                      </FlexItem>
                      <FlexItem>
                        <SecondaryButton
                          onClickHandler={() => onShowSetSshKey(idx, publicKey)}
                          name={"show-ssh-public-key-" + idx}
                          isDisabled={readOnly}
                          isSmall
                        >
                          Show Key
                        </SecondaryButton>
                      </FlexItem>
                      <FlexItem className="pf-v5-u-mb-md">
                        <SecondaryButton
                          onClickHandler={() => onDeleteSshKey(idx)}
                          name={"remove-ssh-public-key-" + idx}
                          isDisabled={readOnly}
                          isSmall
                        >
                          Delete
                        </SecondaryButton>
                      </FlexItem>
                    </>
                  )}
                </Flex>
              </div>
            );
          })
        : null}
      <Modal
        variant="small"
        title={idxSelected !== null ? "SSH Key" : "Set SSH key"}
        isOpen={isTextAreaSshPublicKeysOpen}
        onClose={onClickCancelTextAreaSshPublicKeys}
        actions={modal_actions}
      >
        <Form>
          <FormGroup label="SSH public key:" type="string" fieldId="selection">
            <TextArea
              value={textAreaSshPublicKeysValue}
              name={"ipasshpubkey"}
              onChange={(_event, value: string) => onChangeTextAreaSshPublicKeysValue(value)}
              aria-label="new ssh public key modal text area"
              resizeOrientation="vertical"
              style={{ height: "422px" }}
              isDisabled={idxSelected !== null}
            />
          </FormGroup>
        </Form>
      </Modal>
      <SecondaryButton
        onClickHandler={openSshPublicKeysModal}
        name={"add-ssh-public-key"}
        isDisabled={readOnly}
        isSmall
      >
        Add Key
      </SecondaryButton>
      <ConfirmationModal
        title={"Remove SSH Public Key"}
        isOpen={isDeletionModalOpen}
        onClose={onCloseDeletionModal}
        actions={deletionModalActions}
        messageText={deletionMessage}
        messageObj={deletionMessageObj}
      />
    </>
  );
};

export default IpaSshPublicKeys;
