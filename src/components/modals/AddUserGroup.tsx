import React, { useEffect, useState } from "react";
// PatternFly
import { Button, TextArea } from "@patternfly/react-core";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
import InputRequiredText from "../layouts/InputRequiredText";
import InputWithValidation from "../layouts/InputWithValidation";
// Modals
import ErrorModal from "./ErrorModal";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { FindRPCResponse } from "../../services/rpc";
import {
  GroupAddPayload,
  useAddGroupMutation,
} from "../../services/rpcUserGroups";
import SimpleSelector, { SelectOptionProps } from "../layouts/SimpleSelector";
import { isEmptyOrNumber, EMPTY_OR_NUMBER_MESSAGE } from "src/utils/utils";
interface PropsToAddGroup {
  show: boolean;
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  onRefresh?: () => void;
}

const groupTypeOptions: SelectOptionProps[] = [
  {
    key: "posix",
    value: "posix",
  },
  {
    key: "non-posix",
    value: "non-posix",
  },
  {
    key: "external",
    value: "external",
  },
];

const AddUserGroup = (props: PropsToAddGroup) => {
  const dispatch = useAppDispatch();
  const [executeGroupAddCommand] = useAddGroupMutation();

  // Set host names list
  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [groupName, setGroupName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [gidNumber, setGID] = React.useState("");
  const [groupType, setGroupType] = React.useState("posix");

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      groupName === "" ||
      (groupType === "posix" && gidNumber !== "" && isNaN(Number(gidNumber)))
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [gidNumber, groupName]);

  useEffect(() => {
    if (groupType !== "posix") {
      setGID("");
    }
  }, [groupType]);

  // List of fields
  const fields = [
    {
      id: "modal-form-group-name",
      name: "Group name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-group-name"
          id="modal-form-group-name"
          name="modal-form-group-name"
          value={groupName}
          onChange={setGroupName}
          requiredHelperText="Please enter a group name"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-group-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-group-description"
          id="modal-form-group-description"
          name="modal-form-group-description"
          value={description}
          onChange={(_event, value) => setDescription(value)}
          aria-label="Group description"
          autoResize
        />
      ),
    },
    {
      id: "modal-form-group-type",
      name: "Group type",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-group-type"
          id="group-type-selector"
          options={groupTypeOptions}
          selected={groupType}
          onSelectedChange={(selected: string) => setGroupType(selected)}
          ariaLabel="Group type selector"
        />
      ),
    },
    {
      id: "modal-form-group-gid",
      name: "GID",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-group-gid"
          id="modal-form-group-gid"
          name="modal-form-group-gid"
          value={gidNumber}
          onChange={setGID}
          rules={
            groupType === "posix"
              ? [
                  {
                    id: "ruleGid",
                    message: EMPTY_OR_NUMBER_MESSAGE,
                    validate: isEmptyOrNumber,
                  },
                ]
              : []
          }
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setGroupName("");
    setDescription("");
    setGroupType("posix");
    setGID("");
    setAddBtnSpinning(false);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    props.handleModalToggle();
  };

  // Define status flags to determine user added successfully or error
  let isAdditionSuccess = true;

  // Add host data
  const addGroupData = async () => {
    const newGroupPayload = {
      groupName: groupName,
      groupType: groupType,
      gidnumber: gidNumber,
      description: description,
    } as GroupAddPayload;

    // Add host via API call
    await executeGroupAddCommand(newGroupPayload).then((group) => {
      if ("data" in group) {
        const data = group.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          dispatch(
            addAlert({
              name: "add-group-success",
              title: "New user group added",
              variant: "success",
            })
          );

          // Set status flag: success
          isAdditionSuccess = true;
          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh();
          }
        }
      }
    });
  };

  const addGroupHandler = () => {
    setAddBtnSpinning(true);
    addGroupData().then(() => {
      if (!isAdditionSuccess) {
        // Close the modal without cleaning fields
        if (props.onCloseAddModal !== undefined) {
          props.onCloseAddModal();
        }
        setAddBtnSpinning(false);
      } else {
        // Clean data and close modal
        cleanAndCloseModal();
      }
    });
  };

  // Error handling
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
    // Show Add modal
    if (props.onOpenAddModal !== undefined) {
      props.onOpenAddModal();
    }
  };

  const onRetry = () => {
    // Keep the add modal closed until the operation is done...
    if (props.onCloseAddModal !== undefined) {
      props.onCloseAddModal();
    }

    // Close the error modal
    closeAndCleanErrorParameters();

    addGroupHandler();
  };

  const errorModalActions = [
    <SecondaryButton
      dataCy="modal-button-retry"
      key="retry"
      onClickHandler={onRetry}
    >
      Retry
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseErrorModal}
    >
      Cancel
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    }
    setIsModalErrorOpen(true);
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-group"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="add-user-group-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-group"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy="add-user-group-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add user group"
        formId="add-user-group-modal"
        fields={fields}
        show={props.show}
        onSubmit={addGroupHandler}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-user-group-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default AddUserGroup;
