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
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Forms
import DropdownSearch from "src/components/layouts/DropdownSearch";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
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
import { EMPTY_OR_NUMBER_MESSAGE, isEmptyOrNumber } from "src/utils/utils";

interface PropsToAddUser {
  idview: string;
  users: IDViewOverrideUser[];
  onClose: () => void;
  onRefresh: () => void;
}

const AddIDOverrideUserModal = (props: PropsToAddUser) => {
  const dispatch = useAppDispatch();

  const [executeAddCommand] = useAddIDOverrideUserMutation();
  const [retrieveUsers] = useGetIDListMutation({});

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userNames, setUserNames] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    retrieveUsers({
      searchValue: "",
      sizeLimit: 200,
      startIdx: 0,
      stopIdx: 199,
      entryType: "user",
    } as GenericPayload).then((result) => {
      if (result && "data" in result) {
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
  }, [props.users]);

  const loginRef = useRef() as MutableRefObject<HTMLInputElement>;
  const gecosRef = useRef() as MutableRefObject<HTMLInputElement>;
  const shellRef = useRef() as MutableRefObject<HTMLInputElement>;
  const homedirRef = useRef() as MutableRefObject<HTMLInputElement>;

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
              message: EMPTY_OR_NUMBER_MESSAGE,
              validate: isEmptyOrNumber,
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

  const addHandler = () => {
    setAddBtnSpinning(true);
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

    executeAddCommand(newUserPayload).then((add) => {
      if ("data" in add) {
        const data = add.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;
        if (error) {
          let title = "";
          if ("code" in error) {
            title = "IPA error " + error.code + ": " + error.name;
          }
          dispatch(
            addAlert({
              name: "add-override-user-error",
              title,
              variant: "danger",
            })
          );
        } else {
          dispatch(
            addAlert({
              name: "add-user-success",
              title: "New override user added",
              variant: "success",
            })
          );
          props.onRefresh();
          props.onClose();
        }
      }
      setAddBtnSpinning(false);
    });
  };

  const onClose = () => {
    if (!addSpinning) {
      props.onClose();
    }
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

  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-user"
      isDisabled={buttonDisabled || addSpinning}
      type="submit"
      form="override-user-add-modal"
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
      onClick={onClose}
      isDisabled={addSpinning}
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

  return (
    <ModalWithFormLayout
      dataCy="add-id-override-user-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add new override user"
      formId="override-user-add-modal"
      fields={loading ? loadingUsers : fields}
      show
      onSubmit={addHandler}
      onClose={onClose}
      actions={modalActions}
      isHorizontal
    />
  );
};

export default AddIDOverrideUserModal;
