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
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addUser as addActiveUser } from "src/store/Identity/activeUsers-slice";
import { addUser as addStageUser } from "src/store/Identity/stageUsers-slice";
import { addUser as addPreservedUser } from "src/store/Identity/preservedUsers-slice";

export interface PropsToAddUser {
  show: boolean;
  from: "active-users" | "stage-users" | "preserved-users";
  handleModalToggle: () => void;
}

const AddUser = (props: PropsToAddUser) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // useStates for TextInputs
  const [userLogin, setUserLogin] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [userClass, setUserClass] = React.useState("");
  const [isNoPrivateGroupChecked, setIsNoPrivateGroupChecked] =
    React.useState<boolean>(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [verifyNewPassword, setVerifyNewPassword] = React.useState("");

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

  // Validation fiels
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

  // Select GID
  const [isGidOpen, setIsGidOpen] = useState(false);
  const [gidSelected, setGidSelected] = useState("");
  const gidOptions = [
    { value: "Option 1", disabled: false },
    { value: "Option 2", disabled: false },
    { value: "Option 3", disabled: false },
  ];
  const gidOnToggle = (isOpen: boolean) => {
    setIsGidOpen(isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gidOnSelect = (selection: any) => {
    setGidSelected(selection.target.textContent);
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
            <SelectOption
              isDisabled={option.disabled}
              key={index}
              value={option.value}
            />
          ))}
        </Select>
      ),
    },
    {
      id: "new-password",
      name: "New Password",
      pfComponent: (
        <TextInput
          type="password"
          id="modal-form-new-password"
          name="modal-form-new-password"
          value={newPassword}
          onBlur={verifyPasswordValidationHandler}
          onFocus={resetVerifyPassword}
          onChange={newPasswordValueHandler}
          ref={newPasswordRef}
        />
      ),
    },
    {
      id: "verify-password",
      name: "Verify password",
      pfComponent: (
        <>
          <TextInput
            type="password"
            id="modal-form-verify-password"
            name="modal-form-verify-password"
            value={verifyNewPassword}
            onBlur={verifyPasswordValidationHandler}
            onFocus={resetVerifyPassword}
            onChange={verifyNewPasswordValueHandler}
            validated={verifyPasswordValidation.pfError}
            ref={verifyNewPasswordRef}
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

  const addUserData = () => {
    // If 'userLogin' is empty, generate one based on first and last names
    // TODO: This might need a better name generator method to manage long names and accents
    let usLogin = userLoginRef.current.value;
    if (userLogin.length === 0) {
      usLogin =
        firstNameRef.current.value.charAt(0) +
        lastNameRef.current.value.replace(" ", "");
      usLogin = usLogin.toLowerCase();
    }

    const newUser: User = {
      title: "",
      givenname: firstNameRef.current.value,
      sn: lastNameRef.current.value,
      displayname: firstNameRef.current.value + lastNameRef.current.value,
      initials:
        firstNameRef.current.value.charAt(0) +
        lastNameRef.current.value.charAt(0),
      gecos: firstNameRef.current.value + lastNameRef.current.value,
      userclass: "",
      // account
      uid: usLogin,
      has_password: true,
      krbpasswordexpiration: "",
      uidnumber: "12345678",
      gidnumber: "12345678",
      krbprincipalname: usLogin + "@IPA.DOMAIN",
      krbprincipalexpiration: "",
      loginshell: "/bin/sh",
      homedirectory: "/home/" + usLogin,
      ipasshpubkey: [""],
      usercertificate: [""],
      ipacertmapdata: [""],
      ipauserauthtype: {
        password: false,
        radius: false,
        otp: false,
        pkinit: false,
        hardened: false,
        idp: false,
      },
      ipatokenradiusconfiglink: [""],
      ipatokenradiususername: "",
      ipaidpconfiglink: [""],
      ipaidpsub: "",
      // pwpolicy
      krbmaxpwdlife: "90",
      krbminpwdlife: "1",
      krbpwdhistorylength: "0",
      krbpwdmindiffchars: "0",
      krbpwdminlength: "8",
      krbpwdmaxfailure: "6",
      krbpwdfailurecountinterval: "60",
      krbpwdlockoutduration: "600",
      passwordgracelimit: "-1",
      // krbtpolicy
      krbmaxrenewableage: "604800",
      krbmaxticketlife: "86400",
      // contact
      mail: [usLogin + "@ipa.domain"],
      telephonenumber: [""],
      pager: [""],
      mobile: [""],
      facsimiletelephonenumber: [""],
      // mailing
      street: "",
      l: "",
      st: "",
      postalcode: "",
      // employee
      ou: "",
      manager: [""],
      departmentnumber: [""],
      employeenumber: "",
      employeetype: "",
      preferredlanguage: "",
      // misc
      carlicense: [""],
      // smb_attributes
      ipantlogonscript: "",
      ipantprofilepath: "",
      ipanthomedirectory: "",
      ipanthomedirectorydrive: "",
      // 'Member of' data
      memberof_group: [""], // E.g: "cn=ipausers,cn=groups,cn=accounts,dc=ipa,dc=domain"
      // 'Managed by' data
      mepmanagedentry: [""], // E.g: "cn=username,cn=groups,cn=accounts,dc=ipa,dc=domain"
      // other
      cn: firstNameRef.current.value + lastNameRef.current.value,
      krbcanonicalname: [usLogin + "@ipa.domain"],
      nsaccountlock: false,
      objectclass: [],
      ipauniqueid: "", // E.g: "3c44ec90-b8f5-11ed-9350-52540021e405" Auth. generated?
      ipantsecurityidentifier: "", // E.g: "S-1-5-21-905075754-1492382060-461393011-1005"
      attributelevelrights: {},
      has_keytab: false,
      preserved: false,
      dn: "uid=" + usLogin + ",cn=users,cn=accounts,dc=ipa,dc=domain",
    };

    if (props.from === "active-users") {
      dispatch(addActiveUser(newUser));
    } else if (props.from === "stage-users") {
      dispatch(addStageUser(newUser));
    } else if (props.from === "preserved-users") {
      dispatch(addPreservedUser(newUser));
    }
  };

  const onAddUser = () => {
    const validation = validateFields();
    if (validation) {
      addUserData();
      cleanAndCloseModal();
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
    props.handleModalToggle();
  };

  const onAddAndAddAnother = () => {
    const validation = validateFields();
    if (validation) {
      addUserData();
      // Do not close the modal, but clean fields & reset validations
      cleanAllFields();
      resetValidations();
    }
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
  );
};

export default AddUser;
