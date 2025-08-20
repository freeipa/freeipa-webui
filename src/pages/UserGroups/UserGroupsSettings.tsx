import React, { useState } from "react";
// PatternFly
import {
  Button,
  Divider,
  DropdownItem,
  Flex,
  Form,
  FormGroup,
  Label,
  TextInput,
} from "@patternfly/react-core";
// Modals
import ConfirmationModal from "../../components/modals/ConfirmationModal";
// Forms
import IpaTextArea from "../../components/Form/IpaTextArea";
import { useNavigate } from "react-router-dom";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import {
  UserGroup,
  Metadata,
  PwPolicy,
} from "../../utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useRemoveGroupMutation,
  useSaveGroupMutation,
  useConvertGroupExternalMutation,
  useConvertGroupPOSIXMutation,
} from "src/services/rpcUserGroups";

interface PropsToGroupsSettings {
  userGroup: Partial<UserGroup>;
  originalGroup: Partial<UserGroup>;
  metadata: Metadata;
  onGroupChange: (userGroup: Partial<UserGroup>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<UserGroup>;
  onResetValues: () => void;
  pwPolicyData: Partial<PwPolicy>;
}

const UserGroupsSettings = (props: PropsToGroupsSettings) => {
  const alerts = useAlerts();
  const navigate = useNavigate();

  // API
  const [saveGroup] = useSaveGroupMutation();
  const [deleteGroup] = useRemoveGroupMutation();
  const [convertGroupExternal] = useConvertGroupExternalMutation();
  const [convertGroupPOSIX] = useConvertGroupPOSIXMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "user-groups", noBreadcrumb: true });

  let cn = "";
  if (props.userGroup.cn !== undefined) {
    cn = props.userGroup.cn;
  }

  let groupType = "";
  if (props.userGroup.objectclass) {
    if (props.userGroup.objectclass.includes("posixgroup")) {
      groupType = "POSIX";
    } else if (props.userGroup.objectclass.includes("ipaexternalgroup")) {
      groupType = "External";
    }
  }

  const [isSaving, setSaving] = useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.userGroup,
    props.onGroupChange
  );

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem
      key="delete-user-group"
      onClick={() => onOpenDeleteModal()}
      data-cy="user-groups-tab-settings-kebab-delete"
    >
      Delete group
    </DropdownItem>,
  ];
  if (groupType === "") {
    dropdownItems.push(<Divider key="separator" />);
    dropdownItems.push(
      <DropdownItem
        key="change-to-posix"
        onClick={() => onOpenPOSIXModal()}
        data-cy="user-groups-tab-settings-kebab-change-to-posix"
      >
        Change to POSIX group
      </DropdownItem>
    );
    dropdownItems.push(
      <DropdownItem
        key="change-to-external"
        onClick={() => onOpenExternalModal()}
        data-cy="user-groups-tab-settings-kebab-change-to-external"
      >
        Change to external group
      </DropdownItem>
    );
  }

  const onKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };

  // Confirmation modals
  const [modalSpinning, setModalSpinning] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = React.useState(false);
  const [isPOSIXModalOpen, setIsPOSIXModalOpen] = React.useState(false);
  const onOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const onCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const onOpenExternalModal = () => {
    setIsExternalModalOpen(true);
  };
  const onCloseExternalModal = () => {
    setIsExternalModalOpen(false);
  };
  const onOpenPOSIXModal = () => {
    setIsPOSIXModalOpen(true);
  };
  const onClosePOSIXModal = () => {
    setIsPOSIXModalOpen(false);
  };

  // Change group to POSIX group
  const doChangeToPosix = () => {
    setModalSpinning(true);
    convertGroupPOSIX(cn).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          alerts.addAlert(
            "posix-usergroup-success",
            "User group changed to POSIX group",
            "success"
          );
        } else if (response.data?.error) {
          alerts.addAlert(
            "posix-error",
            "Failed to convert group: " + response.data.error,
            "danger"
          );
        }
      }
      props.onRefresh();
      setIsPOSIXModalOpen(false);
      setModalSpinning(false);
    });
  };

  // Change group to external
  const doChangeToExternal = () => {
    setModalSpinning(true);
    convertGroupExternal(cn).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          alerts.addAlert(
            "external-usergroup-success",
            "User group changed to external group",
            "success"
          );
        } else if (response.data?.error) {
          alerts.addAlert(
            "external-error",
            "Failed to convert group: " + response.data.error,
            "danger"
          );
        }
      }
      props.onRefresh();
      setIsExternalModalOpen(false);
      setModalSpinning(false);
    });
  };

  // Delete group
  const doDelete = () => {
    setModalSpinning(true);
    deleteGroup(cn).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          alerts.addAlert(
            "remove-usergroup-success",
            "User group removed",
            "success"
          );
          // Redirect to the main page
          navigate("/user-groups");
        } else if (response.data?.error) {
          alerts.addAlert(
            "delete-error",
            "Failed to delete group: " + response.data.error,
            "danger"
          );
        }
      }
      setIsDeleteModalOpen(false);
      setModalSpinning(false);
    });
  };

  const deleteModalActions = [
    <Button
      data-cy="modal-button-delete"
      key="delete-host"
      variant="danger"
      onClick={doDelete}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Deleting"
      spinnerAriaLabelledBy="Deleting"
      spinnerAriaLabel="Deleting"
    >
      {modalSpinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseDeleteModal}
    >
      Cancel
    </Button>,
  ];

  const posixModalActions = [
    <Button
      data-cy="modal-button-change"
      key="change-posix"
      variant="primary"
      onClick={doChangeToPosix}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Changing"
      spinnerAriaLabelledBy="Changing"
      spinnerAriaLabel="Changing"
    >
      {modalSpinning ? "Changing" : "Change Group"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onClosePOSIXModal}
    >
      Cancel
    </Button>,
  ];

  const externalModalActions = [
    <Button
      data-cy="modal-button-change"
      key="change-external"
      variant="primary"
      onClick={doChangeToExternal}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Changing"
      spinnerAriaLabelledBy="Changing"
      spinnerAriaLabel="Changing"
    >
      {modalSpinning ? "Changing" : "Change Group"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseExternalModal}
    >
      Cancel
    </Button>,
  ];

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.userGroup.cn;
    setSaving(true);

    saveGroup(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "User group modified", "success");
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        // Reset values. Disable 'revert' and 'save' buttons
        props.onResetValues();
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onGroupChange(props.originalGroup);
    alerts.addAlert("revert-success", "User group data reverted", "success");
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          onClickHandler={props.onRefresh}
          dataCy="user-groups-tab-settings-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified}
          onClickHandler={onRevert}
          dataCy="user-groups-tab-settings-button-revert"
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified || isSaving}
          onClickHandler={onSave}
          dataCy="user-groups-tab-settings-button-save"
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          dataCy="user-groups-tab-settings-kebab"
          direction={"up"}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={dropdownItems}
        />
      ),
    },
  ];

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
        <TitleLayout
          key={0}
          headingLevel="h2"
          id="group-settings"
          text="User group settings"
        />
        <Form
          className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
          isHorizontal
        >
          <FormGroup label="Description" fieldId="description">
            <IpaTextArea
              dataCy="user-groups-tab-settings-textbox-description"
              name="description"
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="group"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="Group type" fieldId="group-type">
            <TextInput
              data-cy="user-groups-tab-settings-textbox-group-type"
              id="group-type"
              name="grouptype"
              value={groupType}
              type="text"
              aria-label="group type"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup label="GID" fieldId="gid">
            <TextInput
              data-cy="user-groups-tab-settings-textbox-gid"
              id="gid"
              name="gid"
              value={props.userGroup.gidnumber}
              type="text"
              aria-label="GID"
              readOnlyVariant="plain"
            />
          </FormGroup>
          <FormGroup label="Password policy" fieldId="pwdpolicy" role="group">
            <Label
              label="Temporary until pwdPolicy page is finished"
              color={props.pwPolicyData.cn ? "blue" : "grey"}
            >
              {props.pwPolicyData.cn || "None"}
            </Label>
          </FormGroup>
        </Form>
      </Flex>
      <ConfirmationModal
        dataCy="delete-user-group-modal"
        title={"Delete user group"}
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        actions={deleteModalActions}
        messageText={"Are you sure you want to delete this user group?"}
        messageObj={cn}
      />
      <ConfirmationModal
        dataCy="change-group-type-posix-modal"
        title={"Change group type"}
        isOpen={isPOSIXModalOpen}
        onClose={onClosePOSIXModal}
        actions={posixModalActions}
        messageText={
          "Are you sure you want to change this group to a POSIX group?"
        }
        messageObj={cn}
      />
      <ConfirmationModal
        dataCy="change-group-type-external-modal"
        title={"Change group type"}
        isOpen={isExternalModalOpen}
        onClose={onCloseExternalModal}
        actions={externalModalActions}
        messageText={
          "Are you sure you want to change this group to an external group?"
        }
        messageObj={cn}
      />
    </TabLayout>
  );
};

export default UserGroupsSettings;
