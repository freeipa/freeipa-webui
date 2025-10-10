import React, { MutableRefObject, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Button,
  Spinner,
  Content,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
// Redux
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
// Forms
import DropdownSearch from "src/components/layouts/DropdownSearch";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Data types
import { IDViewOverrideGroup } from "src/utils/datatypes/globalDataTypes";
import {
  useGetIDListMutation,
  FindRPCResponse,
  GenericPayload,
} from "src/services/rpc";
import {
  useAddIDOverrideGroupMutation,
  AddGroupPayload,
} from "src/services/rpcIdOverrides";

export interface PropsToAddGroup {
  show: boolean;
  idview: string;
  groups: IDViewOverrideGroup[];
  handleModalToggle: () => void;
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onRefresh: () => void;
}

const AddIDOverrideGroupModal = (props: PropsToAddGroup) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Define 'executeCommand' to add group data to IPA server
  const [executeAddCommand] = useAddIDOverrideGroupMutation();
  const [retrieveGroups] = useGetIDListMutation({});

  // States for TextInputs
  const [overrideGroup, setOverrideGroup] = useState("");
  const [groupName, setGroupName] = useState("");
  const [gidnumber, setGidNumber] = useState("");
  const [description, setDescription] = useState("");

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [addAgainSpinning, setAddAgainBtnSpinning] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [groupNames, setGroupNames] = useState<string[]>([]);

  // Get our initial list of groups
  useEffect(() => {
    if (!props.show) {
      return;
    }
    setLoading(true);
    retrieveGroups({
      searchValue: "",
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 199,
      entryType: "group",
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
        // Filter out groups that are already listed
        const existing_groups = props.groups.map(
          (group) => group["ipaanchoruuid"][0]
        );
        const groups = (result.data?.list || []).filter(
          (item) => !existing_groups.includes(item)
        );
        setGroupNames(groups);
      } else {
        setGroupNames([]);
      }
      setLoading(false);
    });
  }, [props.show, props.groups]);

  // Refs
  const loginRef = useRef() as MutableRefObject<HTMLInputElement>;

  // List of fields
  const fields = [
    {
      id: "modal-form-override-group",
      name: "Group to override",
      pfComponent: (
        <DropdownSearch
          dataCy="modal-override-group"
          id="modal-form-override-group"
          options={groupNames}
          onSelect={(value: string) => setOverrideGroup(value)}
          searchType="group"
          value={overrideGroup}
        />
      ),
    },
    {
      id: "modal-form-group-name",
      name: "Group name",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-group-name"
          type="text"
          id="modal-form-group-name"
          name="modal-form-group-name"
          value={groupName}
          onChange={(_event, value: string) => setGroupName(value)}
          ref={loginRef}
        />
      ),
    },
    {
      id: "modal-form-gidnumber",
      name: "GID",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-gidnumber"
          id="modal-form-gidnumber"
          name="modal-form-gidnumber"
          value={gidnumber}
          onChange={setGidNumber}
          rules={[
            {
              id: "ruleGid",
              message: "Must be empty or a number",
              validate: (v: string) => v === "" || !isNaN(Number(v)),
            },
          ]}
        />
      ),
    },
    {
      id: "modal-form-group-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-group-description"
          id="modal-form-group-desc"
          name="modal-form-group-desc"
          value={description}
          onChange={(_event, value: string) => setDescription(value)}
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setOverrideGroup("");
    setGroupName("");
    setGidNumber("");
    setDescription("");
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    props.onCloseAddModal();
  };

  // Define status flags to determine group added successfully or error
  let isAdditionSuccess = true;

  // Track which button has been clicked ('onAdd' or 'onAddAndAddAnother')
  // to better handle the 'retry' function and its behavior
  let onAddClicked = true;

  // Add data
  const addGroup = async () => {
    const newGroupPayload = {
      idview: props.idview,
      group: overrideGroup,
      groupName: groupName,
      gidnumber,
      description,
    } as AddGroupPayload;

    // Add via API call
    await executeAddCommand(newGroupPayload).then((add) => {
      if ("data" in add) {
        const data = add.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;
        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          alerts.addAlert(
            "add-group-success",
            "New override group added",
            "success"
          );

          // Set status flag: success
          isAdditionSuccess = true;
          // Refresh data
          props.onRefresh();
        }
        setAddBtnSpinning(false);
        setAddAgainBtnSpinning(false);
      }
    });
  };

  const addAndAddAnotherHandler = () => {
    onAddClicked = false;
    setAddAgainBtnSpinning(true);
    addGroup().then(() => {
      if (isAdditionSuccess) {
        // Do not close the modal, but clean fields & reset validations
        cleanAllFields();
      } else {
        // Close the modal without cleaning fields
        if (props.onCloseAddModal !== undefined) {
          props.onCloseAddModal();
        }
      }
    });
  };

  const addHandler = () => {
    onAddClicked = true;
    setAddBtnSpinning(true);
    addGroup().then(() => {
      if (!isAdditionSuccess) {
        // Close the modal without cleaning fields
        if (props.onCloseAddModal !== undefined) {
          props.onCloseAddModal();
        }
      } else {
        // Clean data and close modal
        cleanAndCloseModal();
      }
    });
  };

  // Handle API error data
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

    // Repeats the same previous operation
    if (onAddClicked) {
      addHandler();
    } else {
      addAndAddAnotherHandler();
    }
  };

  const errorModalActions = [
    <SecondaryButton
      key="retry"
      onClickHandler={onRetry}
      dataCy="modal-button-retry"
    >
      Retry
    </SecondaryButton>,
    <Button
      key="cancel"
      variant="link"
      onClick={onCloseErrorModal}
      data-cy="modal-button-cancel"
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

  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (
      overrideGroup === "" ||
      (gidnumber !== "" && isNaN(Number(gidnumber)))
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [overrideGroup, gidnumber]);

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-group"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      type="submit"
      form="override-group-add-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <SecondaryButton
      dataCy="modal-button-add-and-add-another"
      key="add-and-add-another-group"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addAndAddAnotherHandler}
      spinnerAriaValueText="Adding again"
      spinnerAriaLabel="Adding again"
      isLoading={addAgainSpinning}
    >
      {addAgainSpinning ? "Adding" : "Add and add another"}
    </SecondaryButton>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-group"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  const loadingGroups = [
    {
      id: "Loading",
      name: "",
      pfComponent: (
        <Content className="pf-v6-u-m-xl">
          <Content component="h3">
            <i>Loading groups</i>
            <Spinner isInline size="xl" className="pf-v6-u-ml-md" />
          </Content>
        </Content>
      ),
    },
  ];

  // Render
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        dataCy="add-id-override-group-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add new override group"
        formId="override-group-add-modal"
        fields={loading ? loadingGroups : fields}
        show={props.show}
        onSubmit={addHandler}
        onClose={cleanAndCloseModal}
        actions={modalActions}
        isHorizontal
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-id-override-group-modal-error"
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

export default AddIDOverrideGroupModal;
