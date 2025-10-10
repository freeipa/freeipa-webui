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
import { IDViewOverrideUser } from "src/utils/datatypes/globalDataTypes";
import {
  useGetIDListMutation,
  FindRPCResponse,
  GenericPayload,
} from "src/services/rpc";
import {
  useAddIDOverrideUserMutation,
  AddUserPayload,
} from "src/services/rpcIdOverrides";
import InputWithValidation from "src/components/layouts/InputWithValidation";

export interface PropsToAddUser {
  show: boolean;
  idview: string;
  users: IDViewOverrideUser[];
  handleModalToggle: () => void;
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onRefresh: () => void;
}

const AddIDOverrideUserModal = (props: PropsToAddUser) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Define 'executeCommand' to add user data to IPA server
  const [executeAddCommand] = useAddIDOverrideUserMutation();
  const [retrieveUsers] = useGetIDListMutation({});

  // States for TextInputs
  const [overrideUser, setOverrideUser] = useState("");
  const [login, setLogin] = useState("");
  const [gecos, setGecos] = useState("");
  const [uidnumber, setUidNumber] = useState("");
  const [gidnumber, setGidNumber] = useState("");
  const [usercertificate, setCertificate] = useState("");
  const [ipasshpubkey, setSSHKey] = useState("");
  const [loginshell, setShell] = useState("");
  const [homedirectory, setHomeDirectory] = useState("");
  const [description, setDescription] = useState("");

  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);
  const [addAgainSpinning, setAddAgainBtnSpinning] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userNames, setUserNames] = useState<string[]>([]);

  // Get our initial list of users
  useEffect(() => {
    if (!props.show) {
      return;
    }
    setLoading(true);
    retrieveUsers({
      searchValue: "",
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 199,
      entryType: "user",
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
        // Filter out users that are already listed
        const existing_users = props.users.map(
          (user) => user["ipaanchoruuid"][0]
        );
        const users =
          result.data?.list.filter((item) => !existing_users.includes(item)) ||
          [];
        setUserNames(users);
      } else {
        setUserNames([]);
      }
      setLoading(false);
    });
  }, [props.show, props.users]);

  // Refs
  const loginRef = useRef() as MutableRefObject<HTMLInputElement>;
  const gecosRef = useRef() as MutableRefObject<HTMLInputElement>;
  const shellRef = useRef() as MutableRefObject<HTMLInputElement>;
  const homedirRef = useRef() as MutableRefObject<HTMLInputElement>;

  // List of fields
  const fields = [
    {
      id: "modal-form-override-user",
      name: "User to override",
      pfComponent: (
        <DropdownSearch
          dataCy="modal-form-override-user"
          id="modal-form-override-user"
          options={userNames}
          onSelect={(value: string) => setOverrideUser(value)}
          searchType="user"
          value={overrideUser}
        />
      ),
    },
    {
      id: "modal-form-user-login",
      name: "User login",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-user-login"
          type="text"
          id="modal-form-user-login"
          name="modal-form-user-login"
          value={login}
          onChange={(_event, value: string) => setLogin(value)}
          ref={loginRef}
        />
      ),
    },
    {
      id: "modal-form-user-gecos",
      name: "GECOS",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-user-gecos"
          type="text"
          id="modal-form-user-gecos"
          name="modal-form-user-gecos"
          value={gecos}
          onChange={(_event, value: string) => setGecos(value)}
          ref={gecosRef}
        />
      ),
    },
    {
      id: "modal-form-user-uidnumber",
      name: "UID",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-user-uidnumber"
          id="modal-form-user-uidnumber"
          name="modal-form-user-uidnumber"
          value={uidnumber}
          onChange={setUidNumber}
          rules={[
            {
              id: "ruleUid",
              message: "Must be empty or a number",
              validate: (v: string) => v === "" || !isNaN(Number(v)),
            },
          ]}
        />
      ),
    },
    {
      id: "modal-form-user-gidnumber",
      name: "GID",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-user-gidnumber"
          id="modal-form-user-gidnumber"
          name="modal-form-user-gidnumber"
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
      id: "modal-form-user-shell",
      name: "Login shell",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-user-shell"
          type="text"
          id="modal-form-user-shell"
          name="modal-form-user-shell"
          value={loginshell}
          onChange={(_event, value: string) => setShell(value)}
          ref={shellRef}
        />
      ),
    },
    {
      id: "modal-form-user-homedir",
      name: "Home directory",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-user-homedir"
          type="text"
          id="modal-form-user-homedir"
          name="modal-form-user-homedir"
          value={homedirectory}
          onChange={(_event, value: string) => setHomeDirectory(value)}
          ref={homedirRef}
        />
      ),
    },
    {
      id: "modal-form-user-cert",
      name: "Certificate",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-user-cert"
          id="modal-form-user-cert"
          name="modal-form-user-cert"
          value={usercertificate}
          onChange={(_event, value: string) => setCertificate(value)}
        />
      ),
    },
    {
      id: "modal-form-user-ssh",
      name: "SSH public key",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-user-ssh"
          id="modal-form-user-ssh"
          name="modal-form-user-ssh"
          value={ipasshpubkey}
          onChange={(_event, value: string) => setSSHKey(value)}
        />
      ),
    },
    {
      id: "modal-form-user-desc",
      name: "Description",
      pfComponent: (
        <TextArea
          data-cy="modal-textbox-user-desc"
          id="modal-form-user-desc"
          name="modal-form-user-desc"
          value={description}
          onChange={(_event, value: string) => setDescription(value)}
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setOverrideUser("");
    setLogin("");
    setGecos("");
    setUidNumber("");
    setGidNumber("");
    setCertificate("");
    setSSHKey("");
    setShell("");
    setHomeDirectory("");
    setDescription("");
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    props.onCloseAddModal();
  };

  // Define status flags to determine user added successfully or error
  let isAdditionSuccess = true;

  // Track which button has been clicked ('onAddUser' or 'onAddAndAddAnother')
  // to better handle the 'retry' function and its behavior
  let onAddClicked = true;

  // Add data
  const addUser = async () => {
    const newUserPayload = {
      idview: props.idview,
      name: overrideUser,
      uid: login,
      gecos,
      uidnumber,
      gidnumber,
      loginshell,
      homedirectory,
      usercertificate,
      ipasshpubkey,
      description,
    } as AddUserPayload;

    // Add host via API call
    await executeAddCommand(newUserPayload).then((add) => {
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
            "add-user-success",
            "New override user added",
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
    addUser().then(() => {
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
    addUser().then(() => {
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
      overrideUser === "" ||
      (uidnumber !== "" && isNaN(Number(uidnumber))) ||
      (gidnumber !== "" && isNaN(Number(gidnumber)))
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [overrideUser, gidnumber, uidnumber]);

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-user"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      type="submit"
      form="override-user-add-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <SecondaryButton
      dataCy="modal-button-add-and-add-another"
      key="add-and-add-another-user"
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
      key="cancel-new-user"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  const loadingUsers = [
    {
      id: "Loading",
      name: "",
      pfComponent: (
        <Content className="pf-v6-u-m-xl">
          <Content component="h3">
            <i>Loading users</i>
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
        dataCy="add-id-override-user-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add new override user"
        formId="override-user-add-modal"
        fields={loading ? loadingUsers : fields}
        show={props.show}
        onSubmit={addHandler}
        onClose={cleanAndCloseModal}
        actions={modalActions}
        isHorizontal
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-id-override-user-modal-error"
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

export default AddIDOverrideUserModal;
