import React from "react";
// PatternFly
import { Button, Flex, FlexItem } from "@patternfly/react-core";
// Components
import SecondaryButton from "../layouts/SecondaryButton";
import TextLayout from "../layouts/TextLayout";
// Modals
import ModalWithTextAreaLayout from "../layouts/ModalWithTextAreaLayout";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";
// ipaObject utils
import { getParamProperties, updateIpaObject } from "src/utils/ipaObjectUtils";

interface PropsToSshPublicKeysModal {
  ipaObject: Record<string, unknown>;
  onChange: (ipaObject: Record<string, unknown>) => void;
  metadata: Metadata;
}

const IpaSshPublicKeys = (props: PropsToSshPublicKeysModal) => {
  const { readOnly, value } = getParamProperties({
    name: "ipasshpubkey",
    ipaObject: props.ipaObject,
    metadata: props.metadata,
    objectName: "user",
  });

  // States
  const [textAreaSshPublicKeysValue, setTextAreaSshPublicKeysValue] =
    React.useState("");
  const [isTextAreaSshPublicKeysOpen, setIsTextAreaSshPublicKeysOpen] =
    React.useState(false);
  const [sshPublicKeysList, setSshPublicKeysList] = React.useState<string[]>(
    (value as string[]) || []
  );
  const [idxSelected, setIdxSelected] = React.useState<number | null>(null);
  const [originalIpaObject] = React.useState(props.ipaObject);
  const [isSetButtonDisabled, setIsSetButtonDisabled] = React.useState(true);

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

  // On click 'Set' button (within modal)
  const onClickSetTextAreaSshPublicKeys = () => {
    // Store new entry
    const newSshPublicKeysList = [...sshPublicKeysList];
    // Takes 'idxSelected' as reference to determine whether the entry is new or not
    if (idxSelected !== null) {
      // Existing entries
      newSshPublicKeysList[idxSelected] = textAreaSshPublicKeysValue;
    } else {
      // New entries
      newSshPublicKeysList.push(textAreaSshPublicKeysValue);
    }

    setSshPublicKeysList(newSshPublicKeysList);
    // No element index selected
    setIdxSelected(null);
    // Closes the modal
    setIsTextAreaSshPublicKeysOpen(false);
    // Update ipaObject
    updateIpaObject(
      props.ipaObject,
      props.onChange,
      newSshPublicKeysList,
      "ipasshpubkey"
    );
    // Disable 'Set' button
    setIsSetButtonDisabled(true);
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

  // Delete entry on the ssh public key list
  const onDeleteSshKey = (idx: number) => {
    const newSshPublicKeysList = [...sshPublicKeysList];
    newSshPublicKeysList.splice(idx, 1);
    setSshPublicKeysList(newSshPublicKeysList);
    // Update ipaObject when deleting the last changes (to disable 'Revert' and 'Save' button)
    if (
      JSON.stringify(newSshPublicKeysList) ===
      JSON.stringify(originalIpaObject["ipasshpubkey"])
    ) {
      updateIpaObject(
        props.ipaObject,
        props.onChange,
        newSshPublicKeysList,
        "ipasshpubkey"
      );
    }
    // TODO: When 'ipaObject[<name>]' is undefined, the 'Revert' button is not disabled
  };

  // Render component
  return (
    <>
      {sshPublicKeysList !== undefined
        ? sshPublicKeysList.map((publicKey, idx) => {
            return (
              <>
                <Flex direction={{ default: "row" }}>
                  {publicKey !== "" && (
                    <>
                      <FlexItem>
                        <TextLayout>New: key set</TextLayout>
                      </FlexItem>
                      <FlexItem>
                        <SecondaryButton
                          onClickHandler={() => onShowSetSshKey(idx, publicKey)}
                          isDisabled={readOnly}
                        >
                          Show/Set key
                        </SecondaryButton>
                      </FlexItem>
                      <FlexItem className="pf-u-mb-md">
                        <SecondaryButton
                          onClickHandler={() => onDeleteSshKey(idx)}
                          isDisabled={readOnly}
                        >
                          Undo
                        </SecondaryButton>
                      </FlexItem>
                    </>
                  )}
                </Flex>
              </>
            );
          })
        : null}
      <ModalWithTextAreaLayout
        value={textAreaSshPublicKeysValue}
        onChange={onChangeTextAreaSshPublicKeysValue}
        isOpen={isTextAreaSshPublicKeysOpen}
        onClose={onClickCancelTextAreaSshPublicKeys}
        actions={[
          <SecondaryButton
            key="set"
            onClickHandler={onClickSetTextAreaSshPublicKeys}
            isDisabled={isSetButtonDisabled}
          >
            Set
          </SecondaryButton>,
          <Button
            key="cancel"
            variant="link"
            onClick={onClickCancelTextAreaSshPublicKeys}
          >
            Cancel
          </Button>,
        ]}
        title="Set SSH key"
        subtitle="SSH public key:"
        ariaLabel="new ssh public key modal text area"
        cssStyle={{ height: "422px" }}
        name={"ipasshpubkey"}
        objectName="user"
        ipaObject={props.ipaObject}
        metadata={props.metadata}
      />
      <SecondaryButton
        onClickHandler={openSshPublicKeysModal}
        isDisabled={readOnly}
      >
        Add
      </SecondaryButton>
    </>
  );
};

export default IpaSshPublicKeys;
