import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  HelperText,
  HelperTextItem,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
// Icons
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
// Layout
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import SecondaryButton from "../layouts/SecondaryButton";
import PasswordInput from "../layouts/PasswordInput";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { addUser as addActiveUser } from "src/store/Identity/activeUsers-slice";
import { addUser as addStageUser } from "src/store/Identity/stageUsers-slice";
import { addUser as addPreservedUser } from "src/store/Identity/preservedUsers-slice";
// RPC
import {
  useSimpleMutCommandMutation,
  Command,
  FindRPCResponse,
} from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "./ErrorModal";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface GroupId {
  cn: string;
  description: string;
  dn: string;
  gidnumber: string;
}

export interface PropsToAddUser {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  //  NOTE: 'setShowTableRows' is handled as { (boolean) => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  setShowTableRows?: (value: boolean) => void;
  //  NOTE: This prop is not needed but it is still being used by 'stage-' and 'preserved users'
  //     and will be removed when the communication layer is implemented in the buttons od those pages.
  handleModalToggle: () => void;
  //  NOTE: 'onOpenAddModal' is handled as { () => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onOpenAddModal?: () => void;
  //  NOTE: 'onCloseAddModal' is handled as { () => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onCloseAddModal?: () => void;
  //  NOTE: 'onRefresh' is handled as { (User) => void | undefined } as a temporal solution
  //    until the C.L. is adapted in 'stage-' and 'preserved users' (otherwise
  //    the operation will fail for those components)
  onRefresh?: (newUserData: User) => void;
}

const AddUser = (props: PropsToAddUser) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Define 'executeCommand' to add user data to IPA server
  const [executeUserAddCommand] = useSimpleMutCommandMutation();
  // Define handler to execute when getting gids
  const [retrieveGIDs] = useSimpleMutCommandMutation();

  // useStates for TextInputs
  const [userLogin, setUserLogin] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [userClass, setUserClass] = React.useState("");
  const [isNoPrivateGroupChecked, setIsNoPrivateGroupChecked] =
    React.useState<boolean>(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [verifyNewPassword, setVerifyNewPassword] = React.useState("");

  // Verify the passwords are the same when we update a password value
  useEffect(() => {
    verifyPasswordValidationHandler();
  }, [newPassword, verifyNewPassword]);

  // refs
  const userLoginRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const firstNameRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const lastNameRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const userClassRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const newPasswordRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const verifyNewPasswordRef =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;

  // Validation fields
  const [userLoginValidation, setUserLoginValidation] = useState({
    isError: false,
    message: "Only alphanumeric and special characters _-.$",
    pfError: ValidatedOptions.default,
  });
  const [firstNameValidation, setFirstNameValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });
  const [lastNameValidation, setLastNameValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });
  const [verifyPasswordValidation, setVerifyPasswordValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });

  // TextInput setters
  const userLoginValueHandler = (value: string) => {
    setUserLogin(value);
  };

  const firstNameValueHandler = (value: string) => {
    setFirstName(value);
  };

  const lastNameValueHandler = (value: string) => {
    setLastName(value);
  };

  const userClassValueHandler = (value: string) => {
    setUserClass(value);
  };

  const newPasswordValueHandler = (value: string) => {
    setNewPassword(value);
  };

  const verifyNewPasswordValueHandler = (value: string) => {
    setVerifyNewPassword(value);
  };

  // User login: Valid characters in first char: ., _
  const userLoginFormatFirst = /^([A-Za-z._]).*$/;
  // User login: Valid characters in body: '_', '-', '.', '$'
  const userLoginFormatBody = /^.*([A-Za-z.-_$\d])$/;
  // Valid characters: spaces and '-' symbols only
  const format = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~]/;
  // Valid characters: '-' symbols only
  const formatWithoutSpaces = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~\s]/;

  // TextInput validation handlers
  //   Returns true | false if error
  const userLoginValidationHandler = () => {
    if (
      (!userLoginFormatFirst.test(userLogin.charAt(0)) ||
        !userLoginFormatBody.test(userLogin.substring(1))) &&
      userLogin.length > 0
    ) {
      const userLoginVal = {
        isError: true,
        message: "Only alphanumeric and special characters _-.$",
        pfError: ValidatedOptions.error,
      };
      setUserLoginValidation(userLoginVal);
      return true; // is error
    }
    return false;
  };

  const firstNameValidationHandler = () => {
    if (format.test(firstName)) {
      const firstNameVal = {
        isError: true,
        message: "First name should not contain special characters",
        pfError: ValidatedOptions.error,
      };
      setFirstNameValidation(firstNameVal);
      return true; // is error
    }
    return false;
  };

  const lastNameValidationHandler = () => {
    if (formatWithoutSpaces.test(lastName)) {
      const lastNameVal = {
        isError: true,
        message: "Last name should not contain special characters",
        pfError: ValidatedOptions.error,
      };
      setLastNameValidation(lastNameVal);
      return true; // is error
    }
    return false;
  };

  const verifyPasswordValidationHandler = () => {
    if (newPassword !== verifyNewPassword) {
      const verifyPassVal = {
        isError: true,
        message: "Passwords must match",
        pfError: ValidatedOptions.error,
      };
      setVerifyPasswordValidation(verifyPassVal);
      return true; // is error
    }
    resetVerifyPassword();
    return false;
  };

  // Reset validation methods
  // - User login
  const resetUserLoginError = () => {
    setUserLoginValidation({
      isError: false,
      message: "Only alphanumeric and special characters _-.$",
      pfError: ValidatedOptions.default,
    });
  };

  // First name
  const resetFirstNameError = () => {
    setFirstNameValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // Last name
  const resetLastNameError = () => {
    setLastNameValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // Verify password
  const resetVerifyPassword = () => {
    setVerifyPasswordValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // [API call] Get GIDs
  const getGIDs = () => {
    // Prepare the command data
    const groupParamsData = [
      [null],
      {
        no_members: true,
        posix: true,
        version: apiVersion,
      },
    ];

    // Define payload data
    const groupFindPayload: Command = {
      method: "group_find",
      params: groupParamsData,
    };

    // Execute command here
    retrieveGIDs(groupFindPayload).then((response) => {
      if ("data" in response) {
        const data = response.data as FindRPCResponse;
        const GIDsData = data.result.result;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error !== null) return error;

        setGIDs(GIDsData as unknown as GroupId[]);
        return GIDsData;
      }
    });
  };

  // Select GID
  const [GIDs, setGIDs] = useState<GroupId[]>([]);
  const [isGidOpen, setIsGidOpen] = useState(false);
  const [gidSelected, setGidSelected] = useState<string>("");
  const gidOptions = GIDs.map((gid) => gid.cn);

  const gidOnToggle = (isOpen: boolean) => {
    setIsGidOpen(isOpen);
  };

  // Given a gid name, return gid number
  const getGIDNumberFromName = (gidName: string) => {
    for (let i = 0; i < GIDs.length; i++) {
      if (gidName === GIDs[i].cn[0]) {
        return GIDs[i].gidnumber[0];
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gidOnSelect = (selection: any) => {
    const gidnumber = getGIDNumberFromName(selection.target.textContent);
    setGidSelected(gidnumber as string);
    setIsGidOpen(false);
  };

  // Checks if the passwords are filled and matches
  const verifiedPasswords =
    (newPassword === verifyNewPassword &&
      newPassword.length > 0 &&
      verifyNewPassword.length > 0) ||
    (newPassword.length === 0 && verifyNewPassword.length === 0);

  // Buttons are disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      verifiedPasswords &&
      validateFields()
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [userLogin, firstName, lastName, newPassword, verifyNewPassword]);

  // If modal is shown, load GID data to show in the selector (only once)
  useEffect(() => {
    if (props.show) {
      if (GIDs.length === 0) {
        getGIDs();
      }
    }
  }, [props.show]);

  const [passwordHidden, setPasswordHidden] = React.useState(true);
  const [verifyPasswordHidden, setVerifyPasswordHidden] = React.useState(true);

  // List of fields
  const fields = [
    {
      id: "user-login",
      name: "User login",
      pfComponent: (
        <>
          <TextInput
            type="text"
            id="modal-form-user-login"
            name="modal-form-user-login"
            onFocus={resetUserLoginError}
            onBlur={userLoginValidationHandler}
            value={userLogin}
            onChange={userLoginValueHandler}
            validated={userLoginValidation.pfError}
            ref={userLoginRef}
          />
          <HelperText>
            {!userLoginValidation.isError && (
              <HelperTextItem>{userLoginValidation.message}</HelperTextItem>
            )}
            {userLoginValidation.isError && (
              <HelperTextItem variant="error">
                {userLoginValidation.message}
              </HelperTextItem>
            )}
          </HelperText>
        </>
      ),
    },
    {
      id: "first-name",
      name: "First name",
      pfComponent: (
        <>
          <TextInput
            isRequired
            type="text"
            id="modal-form-first-name"
            name="modal-form-first-name"
            onFocus={resetFirstNameError}
            onBlur={firstNameValidationHandler}
            value={firstName}
            onChange={firstNameValueHandler}
            validated={firstNameValidation.pfError}
            ref={firstNameRef}
          />
          <HelperText>
            <HelperTextItem variant="error">
              {firstNameValidation.message}
            </HelperTextItem>
          </HelperText>
        </>
      ),
      fieldRequired: true,
    },
    {
      id: "last-name",
      name: "Last name",
      pfComponent: (
        <>
          <TextInput
            isRequired
            type="text"
            id="modal-form-last-name"
            name="modal-form-last-name"
            onFocus={resetLastNameError}
            onBlur={lastNameValidationHandler}
            value={lastName}
            onChange={lastNameValueHandler}
            validated={lastNameValidation.pfError}
            ref={lastNameRef}
          />
          <HelperText>
            <HelperTextItem variant="error">
              {lastNameValidation.message}
            </HelperTextItem>
          </HelperText>
        </>
      ),
      fieldRequired: true,
    },
    {
      id: "modal-class",
      name: "Class",
      pfComponent: (
        <TextInput
          type="text"
          id="modal-form-user-class"
          name="modal-form-user-class"
          value={userClass}
          onChange={userClassValueHandler}
          ref={userClassRef}
        />
      ),
      labelIcon: <HelpIcon className="pf-u-ml-xs" />,
    },
    {
      id: "no-private-group",
      pfComponent: (
        <Flex>
          <Checkbox
            label="No private group"
            id="no-private-group"
            isChecked={isNoPrivateGroupChecked}
          />
          <HelpIcon />
        </Flex>
      ),
    },
    {
      id: "gid-form",
      name: "GID",
      pfComponent: (
        <Select
          id="gid"
          variant={SelectVariant.single}
          placeholderText=" "
          aria-label="Select Input"
          onToggle={gidOnToggle}
          onSelect={gidOnSelect}
          selections={gidSelected}
          isOpen={isGidOpen}
          aria-labelledby="gid"
        >
          {gidOptions.map((option, index) => (
            <SelectOption key={index} value={option} />
          ))}
        </Select>
      ),
    },
    {
      id: "new-password",
      name: "New Password",
      pfComponent: (
        <PasswordInput
          id="modal-form-new-password"
          name="modal-form-new-password"
          value={newPassword}
          onFocus={resetVerifyPassword}
          onChange={newPasswordValueHandler}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
        />
      ),
    },
    {
      id: "verify-password",
      name: "Verify password",
      pfComponent: (
        <>
          <PasswordInput
            id="modal-form-verify-password"
            name="modal-form-verify-password"
            value={verifyNewPassword}
            onFocus={resetVerifyPassword}
            onChange={verifyNewPasswordValueHandler}
            onRevealHandler={setVerifyPasswordHidden}
            passwordHidden={verifyPasswordHidden}
            validated={verifyPasswordValidation.pfError}
          />
          <HelperText>
            <HelperTextItem variant="error">
              {verifyPasswordValidation.message}
            </HelperTextItem>
          </HelperText>
        </>
      ),
    },
  ];

  // Helper method to reset validation values
  const resetValidations = () => {
    resetUserLoginError();
    resetFirstNameError();
    resetLastNameError();
    resetVerifyPassword();
  };

  // List of field validations
  const validateFields = () => {
    resetValidations();
    const userLoginError = userLoginValidationHandler();
    const firstNameError = firstNameValidationHandler();
    const lastNameError = lastNameValidationHandler();
    const verifyPasswordError = verifyPasswordValidationHandler();
    if (
      userLoginError ||
      firstNameError ||
      lastNameError ||
      verifyPasswordError
    ) {
      return false;
    } else return true;
  };

  // Add new user data to user Redux slice
  const newUserToRedux = (userData: User) => {
    if (props.from === "active-users") {
      dispatch(addActiveUser(userData));
    } else if (props.from === "stage-users") {
      dispatch(addStageUser(userData));
    } else if (props.from === "preserved-users") {
      dispatch(addPreservedUser(userData));
    }
  };

  // Define status flags to determine user added successfully or error
  let isAdditionSuccess = true;

  // Track which button has been clicked ('onAddUser' or 'onAddAndAddAnother')
  //  to better handle the 'retry' function and its behavior
  let onAddUserClicked = true;

  // Add user data
  const addUserData = async () => {
    // Hide table elements
    if (props.setShowTableRows !== undefined) {
      props.setShowTableRows(false);
    }

    // If 'userLogin' is not provided, use empty array
    const usLogin = userLogin !== "" ? [userLogin] : [];

    const newUserData = {
      givenname: firstName,
      noprivate: isNoPrivateGroupChecked,
      sn: lastName,
      userclass: userClass !== "" ? userClass : undefined,
      gidnumber: gidSelected,
      userpassword: newPassword,
      version: apiVersion,
    };

    // Prepare the command data
    const newUserCommandData = [usLogin, newUserData];

    // Define payload data
    const newUserPayload: Command = {
      method: "user_add",
      params: newUserCommandData,
    };

    // Add user via API call
    await executeUserAddCommand(newUserPayload).then((user) => {
      if ("data" in user) {
        const data = user.data as FindRPCResponse;
        const result = data.result;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (result) {
          const updatedUsersList = result.result as unknown as User;
          // Dispatch user data to redux
          newUserToRedux(updatedUsersList);
          // Set status flag: success
          isAdditionSuccess = true;
          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh(updatedUsersList);
          }

          // Set alert: success
          alerts.addAlert("add-user-success", "New user added", "success");
        } else if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        }
      }
      // Show table elements
      if (props.setShowTableRows !== undefined) {
        props.setShowTableRows(true);
      }
    });
  };

  const onAddUser = () => {
    onAddUserClicked = true;
    const validation = validateFields();
    if (validation) {
      addUserData().then(() => {
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
    }
  };

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setUserLogin("");
    setFirstName("");
    setLastName("");
    setUserClass("");
    setIsNoPrivateGroupChecked(false);
    setGidSelected("");
    setNewPassword("");
    setVerifyNewPassword("");
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    resetValidations();
    if (props.onCloseAddModal !== undefined) {
      props.onCloseAddModal();
    }
  };

  const onAddAndAddAnother = () => {
    onAddUserClicked = false;
    const validation = validateFields();
    if (validation) {
      addUserData().then(() => {
        if (isAdditionSuccess) {
          // Do not close the modal, but clean fields & reset validations
          cleanAllFields();
          resetValidations();
        } else {
          // Close the modal without cleaning fields
          if (props.onCloseAddModal !== undefined) {
            props.onCloseAddModal();
          }
        }
      });
    }
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
    if (onAddUserClicked) {
      onAddUser();
    } else {
      onAddAndAddAnother();
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

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      key="add-new-user"
      variant="secondary"
      isDisabled={buttonDisabled}
      onClick={onAddUser}
      form="modal-form"
    >
      Add
    </Button>,
    <Button
      key="add-and-add-another-user"
      variant="secondary"
      isDisabled={buttonDisabled}
      onClick={onAddAndAddAnother}
    >
      Add and add another
    </Button>,
    <Button key="cancel-new-user" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  // Render 'AddUser'
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add user"
        formId="users-add-user-modal"
        fields={fields}
        show={props.show}
        onClose={cleanAndCloseModal}
        actions={modalActions}
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

export default AddUser;
