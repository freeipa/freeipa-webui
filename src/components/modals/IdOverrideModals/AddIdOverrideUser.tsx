import React, { MutableRefObject, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Button,
  Spinner,
  Text,
  TextContent,
  TextInput,
  TextArea,
  ValidatedOptions,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Redux
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
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
        const users = result.data.list.filter(
          (item) => !existing_users.includes(item)
        );
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
  const uidNumberRef = useRef() as MutableRefObject<HTMLInputElement>;
  const gidNumberRef = useRef() as MutableRefObject<HTMLInputElement>;
  const shellRef = useRef() as MutableRefObject<HTMLInputElement>;
  const homedirRef = useRef() as MutableRefObject<HTMLInputElement>;

  // List of fields
  const fields = [
    {
      id: "override-user",
      name: "User to override",
      pfComponent: (
        <DropdownSearch
          id="modal-form-user-name"
          options={userNames}
          onSelect={(value: string) => setOverrideUser(value)}
          searchType="user"
          value={overrideUser}
        />
      ),
    },
    {
      id: "user-login",
      name: "User login",
      pfComponent: (
        <TextInput
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
      id: "user-gecos",
      name: "GECOS",
      pfComponent: (
        <TextInput
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
      id: "user-uidnumber",
      name: "UID",
      pfComponent: (
        <TextInput
          type="text"
          id="modal-form-user-uidnumber"
          name="modal-form-user-uidnumber"
          value={uidnumber}
          onChange={(_event, value: string) => setUidNumber(value)}
          ref={uidNumberRef}
          validated={
            uidnumber !== "" && isNaN(Number(uidnumber))
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      ),
    },
    {
      id: "user-gidnumber",
      name: "GID",
      pfComponent: (
        <TextInput
          type="text"
          id="modal-form-user-gidnumber"
          name="modal-form-user-gidnumber"
          value={gidnumber}
          onChange={(_event, value: string) => setGidNumber(value)}
          ref={gidNumberRef}
          validated={
            gidnumber !== "" && isNaN(Number(gidnumber))
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      ),
    },
    {
      id: "user-shell",
      name: "Login shell",
      pfComponent: (
        <TextInput
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
      id: "user-homedir",
      name: "Home directory",
      pfComponent: (
        <TextInput
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
      id: "user-cert",
      name: "Certificate",
      pfComponent: (
        <TextArea
          id="modal-form-user-cert"
          name="modal-form-user-cert"
          value={usercertificate}
          onChange={(_event, value: string) => setCertificate(value)}
        />
      ),
    },
    {
      id: "user-ssh",
      name: "SSH public key",
      pfComponent: (
        <TextArea
          id="modal-form-user-ssh"
          name="modal-form-user-ssh"
          value={ipasshpubkey}
          onChange={(_event, value: string) => setSSHKey(value)}
        />
      ),
    },
    {
      id: "user-desc",
      name: "Description",
      pfComponent: (
        <TextArea
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
    <SecondaryButton key="retry" onClickHandler={onRetry}>
      Retry
    </SecondaryButton>,
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
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
    <SecondaryButton
      key="add-new-user"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addHandler}
      form="modal-form"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </SecondaryButton>,
    <SecondaryButton
      key="add-and-add-another-user"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addAndAddAnotherHandler}
      spinnerAriaValueText="Adding again"
      spinnerAriaLabel="Adding again"
      isLoading={addAgainSpinning}
    >
      {addAgainSpinning ? "Adding" : "Add and add another"}
    </SecondaryButton>,
    <Button key="cancel-new-user" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  const loadingUsers = [
    {
      id: "Loading",
      name: "",
      pfComponent: (
        <TextContent className="pf-v5-u-m-xl">
          <Text component="h3">
            <i>Loading users</i>
            <Spinner isInline size="xl" className="pf-v5-u-ml-md" />
          </Text>
        </TextContent>
      ),
    },
  ];

  // Render
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add new override user"
        formId="override-user-add-modal"
        fields={loading ? loadingUsers : fields}
        show={props.show}
        onClose={cleanAndCloseModal}
        actions={modalActions}
        isHorizontal
      />
      {isModalErrorOpen && (
        <ErrorModal
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
