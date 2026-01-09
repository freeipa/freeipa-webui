import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  FlexItem,
  SelectOptionProps,
  TextInput,
} from "@patternfly/react-core";
// Layout
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PasswordInput from "src/components/layouts/PasswordInput";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// RPC
import {
  useSimpleMutCommandMutation,
  Command,
  FindRPCResponse,
} from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Utils
import { NO_SELECTION_OPTION } from "src/utils/constUtils";
// Components
import TypeAheadSelectWithCreate from "src/components/TypeAheadSelectWithCreate";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import { AddUserPayload, useAddUserMutation } from "src/services/rpcUsers";
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";

interface GroupId {
  cn: string;
  description: string;
  dn: string;
  gidnumber: string;
}

interface PropsToAddUser {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  setShowTableRows?: (value: boolean) => void;
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  onRefresh?: () => void;
}

const AddUser = (props: PropsToAddUser) => {
  const dispatch = useAppDispatch();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Define 'executeCommand' to add user data to IPA server
  const [addUser] = useAddUserMutation();
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
  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);

  const newPasswordValueHandler = (value: string) => {
    setNewPassword(value);
  };

  const verifyNewPasswordValueHandler = (value: string) => {
    setVerifyNewPassword(value);
  };

  // User login: Valid characters in first char: ., _
  const userLoginFormatFirst = /^([A-Za-z._]).*$/;
  // User login: Valid characters in body (every char must be in set): letters, digits, '_', '-', '.', '$'
  const userLoginFormatBody = /^[A-Za-z0-9._\-$]*$/;
  // Valid characters: spaces and '-' symbols only
  const format = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~]/;
  // Valid characters: '-' symbols only
  const formatWithoutSpaces = /[`!@#$%^&*()_+=[\]{};':"\\|,.<>/?~\s]/;

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

  const getGidOptions = (groups: GroupId[]) => {
    const newGidOptions: SelectOptionProps[] = [];
    groups.map((gid) => {
      const item = {
        value: gid.gidnumber[0],
        children: gid.cn[0],
      } as SelectOptionProps;
      newGidOptions.push(item);
    });

    newGidOptions.unshift({
      "data-cy": "modal-useradd-gid-select",
      value: "",
      children: NO_SELECTION_OPTION,
    });
    return newGidOptions;
  };

  const [GIDs, setGIDs] = useState<GroupId[]>([]);
  const [gidSelected, setGidSelected] = useState<string>("");
  const gidOptions = getGidOptions(GIDs);

  // Checks if the passwords are filled and matches
  const verifiedPasswords =
    (newPassword === verifyNewPassword &&
      newPassword.length > 0 &&
      verifyNewPassword.length > 0) ||
    (newPassword.length === 0 && verifyNewPassword.length === 0);

  // Buttons are disabled until the user fills the required fields
  const buttonDisabled = !(
    firstName.length > 0 &&
    lastName.length > 0 &&
    verifiedPasswords &&
    (isNoPrivateGroupChecked === true ? gidSelected !== "" : true)
  );

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
  let fields = [
    {
      id: "modal-form-user-login",
      name: "User login",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-login"
          id="modal-form-user-login"
          name="modal-form-user-login"
          isRequired
          value={userLogin}
          onChange={setUserLogin}
          rules={[
            {
              id: "ruleLength",
              message: "Must be at least 3 characters in length",
              validate: (v: string) => v.length >= 3,
            },
            {
              id: "ruleCharacters",
              message: "Only alphanumeric and special characters _-.$",
              validate: (v: string) =>
                userLoginFormatFirst.test(v.charAt(0)) &&
                userLoginFormatBody.test(v.substring(1)),
            },
          ]}
        />
      ),
    },
    {
      id: "modal-form-first-name",
      name: "First name",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-first-name"
          id="modal-form-first-name"
          name="modal-form-first-name"
          value={firstName}
          onChange={setFirstName}
          isRequired
          rules={[
            {
              id: "ruleCharacters",
              message: "First name should not contain special characters",
              validate: (v: string) => !format.test(v),
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-last-name",
      name: "Last name",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-last-name"
          id="modal-form-last-name"
          name="modal-form-last-name"
          value={lastName}
          onChange={setLastName}
          isRequired
          rules={[
            {
              id: "ruleCharacters",
              message:
                "Last name should not contain special characters or spaces",
              validate: (v: string) => !formatWithoutSpaces.test(v),
            },
          ]}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-user-class",
      name: "Class",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-user-class"
          id="modal-form-user-class"
          name="modal-form-user-class"
          value={userClass}
          onChange={(_event, value: string) => setUserClass(value)}
        />
      ),
    },
    {
      id: "no-private-group",
      pfComponent: (
        <Flex
          direction={{ default: "row" }}
          alignItems={{ default: "alignItemsCenter" }}
        >
          <FlexItem>
            <Checkbox
              data-cy="modal-checkbox-no-private-group"
              label="No private group"
              id="no-private-group"
              isChecked={isNoPrivateGroupChecked}
              onChange={(_event, checked: boolean) =>
                setIsNoPrivateGroupChecked(checked)
              }
            />
          </FlexItem>
          <FlexItem>
            <PopoverWithIconLayout
              message={
                "A GID must be specified when 'No private group' is selected"
              }
            />
          </FlexItem>
        </Flex>
      ),
    },
    {
      id: "gid-form",
      name: "GID",
      pfComponent: (
        <TypeAheadSelectWithCreate
          data-cy="modal-useradd-gid"
          id={"modal-form-gid"}
          options={gidOptions}
          selected={gidSelected}
          onSelectedChange={setGidSelected}
        />
      ),
      fieldRequired: isNoPrivateGroupChecked,
    },
    {
      id: "modal-form-new-password",
      name: "New password",
      pfComponent: (
        <PasswordInput
          dataCy="modal-textbox-new-password"
          id="modal-form-new-password"
          name="modal-form-new-password"
          value={newPassword}
          onChange={newPasswordValueHandler}
          onRevealHandler={setPasswordHidden}
          passwordHidden={passwordHidden}
        />
      ),
    },
    {
      id: "modal-form-verify-password",
      name: "Verify password",
      pfComponent: (
        <>
          <PasswordInput
            dataCy="modal-textbox-verify-password"
            id="modal-form-verify-password"
            name="modal-form-verify-password"
            value={verifyNewPassword}
            onChange={verifyNewPasswordValueHandler}
            onRevealHandler={setVerifyPasswordHidden}
            passwordHidden={verifyPasswordHidden}
            rules={[
              {
                id: "verify-match",
                message: "Passwords must match",
                validate: (v: string) => v === newPassword,
              },
            ]}
          />
        </>
      ),
    },
  ];

  // For stage users we need to clean up the fields
  if (props.from === "stage-users") {
    const new_fields = fields.filter(
      (el) => el.id !== "no-private-group" && el.id !== "gid-form"
    );
    fields = new_fields;
  }

  // Track which button has been clicked ('onAddUser')
  //  to better handle the 'retry' function and its behavior
  let onAddUserClicked = true;

  const onAddUser = () => {
    onAddUserClicked = true;

    // Prepare payload
    const newUserPayload: AddUserPayload = {
      type: props.from === "stage-users" ? "stageuser" : "user",
      givenname: firstName,
      sn: lastName,
    };

    if (userLogin !== "") {
      newUserPayload.uid = userLogin;
    }

    if (userClass !== "") {
      newUserPayload.userclass = userClass;
    }

    if (isNoPrivateGroupChecked === true) {
      newUserPayload.noprivate = true;
    }

    if (gidSelected !== "") {
      newUserPayload.gidnumber = gidSelected;
    }

    if (newPassword !== "") {
      newUserPayload.userpassword = newPassword;
    }

    if (verifiedPasswords) {
      setAddBtnSpinning(true);

      addUser(newUserPayload)
        .then((user) => {
          if ("data" in user) {
            const data = user.data as FindRPCResponse;
            const result = data.result;
            const error = data.error as FetchBaseQueryError | SerializedError;

            if (result) {
              // Refresh data
              if (props.onRefresh !== undefined) {
                props.onRefresh();
              }

              // Set alert: success
              dispatch(
                addAlert({
                  name: "add-user-success",
                  title: "New user added",
                  variant: "success",
                })
              );
              cleanAndCloseModal();
            } else if (error) {
              // Handle error
              handleAPIError(error);
            }
          }
        })
        .finally(() => {
          setAddBtnSpinning(false);
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
    if (props.onCloseAddModal !== undefined) {
      props.onCloseAddModal();
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
      key="add-new-user"
      variant="secondary"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="users-add-user-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-user"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render 'AddUser'
  return (
    <>
      <ModalWithFormLayout
        dataCy="add-user-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title={props.from === "stage-users" ? "Add stage user" : "Add user"}
        formId="users-add-user-modal"
        fields={fields}
        show={props.show}
        onSubmit={onAddUser}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-user-modal-error"
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
