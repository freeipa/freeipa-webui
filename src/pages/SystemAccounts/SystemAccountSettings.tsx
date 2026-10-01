import React, { useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  DropdownItem,
  Flex,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Forms
import IpaTextInput from "src/components/Form/IpaTextInput";
import IpaTextArea from "src/components/Form/IpaTextArea";
// Layouts
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
// Utils
import {
  asRecord,
  partialSysAccountToSysAccount,
} from "src/utils/sysaccountsUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Data types
import { SysAccount, Metadata } from "src/utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  SysAccountModPayload,
  useSaveSysAccountMutation,
} from "src/services/rpcSystemAccounts";
// Modals
import DeleteSysAccountsModal from "src/components/modals/SysAccountModals/DeleteSysAccountsModal";
import EnableDisableSysAccountModal from "src/components/modals/SysAccountModals/EnableDisableSysAccountModal";
import ResetSysAccountPasswordModal from "src/components/modals/SysAccountModals/ResetSysAccountPasswordModal";

interface PropsToSettings {
  sysAccount: Partial<SysAccount>;
  originalSysAccount: Partial<SysAccount>;
  metadata: Metadata;
  onSysAccountChange: (sysAccount: Partial<SysAccount>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<SysAccount>;
  onResetValues: () => void;
  onOpenContextualPanel?: () => void;
}

const SystemAccountSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();

  // API
  const [saveSysAccount] = useSaveSysAccountMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "system-accounts", noBreadcrumb: true });

  // Get 'ipaObject' and 'recordOnChange' to use in form fields
  const { ipaObject, recordOnChange } = asRecord(
    props.sysAccount,
    props.onSysAccountChange
  );

  const [isSaving, setSaving] = useState(false);

  // Determine account status (nsaccountlock: true = disabled, false/undefined = enabled)
  const isAccountEnabled = !props.sysAccount.nsaccountlock;

  // 'Save' handler method
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const modifiedValues = props.modifiedValues() as Record<string, unknown>;
    const sysAccountModPayload: SysAccountModPayload = {
      uid: props.sysAccount.uid || "",
      description: modifiedValues?.description as string,
      userpassword: modifiedValues?.userpassword as string,
      privileged: modifiedValues?.privileged as boolean,
    };
    setSaving(true);

    saveSysAccount(sysAccountModPayload)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "save-success",
                title: "System account modified",
                variant: "success",
              })
            );
            props.onRefresh();
          } else if (response.data?.error) {
            const errorMessage = response.data.error as ErrorResult;
            dispatch(
              addAlert({
                name: "save-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
            props.onResetValues();
          }
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onSysAccountChange(props.originalSysAccount);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "System account data reverted",
        variant: "success",
      })
    );
  };

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEnableDisableModalOpen, setIsEnableDisableModalOpen] =
    useState(false);
  const [enableDisableOperation, setEnableDisableOperation] = useState<
    "enable" | "disable"
  >("enable");

  const openEnableDisableModal = (op: "enable" | "disable") => {
    setEnableDisableOperation(op);
    setIsEnableDisableModalOpen(true);
  };

  const kebabItems = [
    <DropdownItem
      data-cy="sysaccount-tab-settings-kebab-reset-password"
      key="reset-password"
      onClick={() => setIsResetPasswordModalOpen(true)}
    >
      Reset password
    </DropdownItem>,
    <DropdownItem
      data-cy="sysaccount-tab-settings-kebab-enable"
      key="enable"
      isDisabled={isAccountEnabled}
      onClick={() => openEnableDisableModal("enable")}
    >
      Enable
    </DropdownItem>,
    <DropdownItem
      data-cy="sysaccount-tab-settings-kebab-disable"
      key="disable"
      isDisabled={!isAccountEnabled}
      onClick={() => openEnableDisableModal("disable")}
    >
      Disable
    </DropdownItem>,
    <DropdownItem
      data-cy="sysaccount-tab-settings-kebab-delete"
      key="delete"
      onClick={() => setIsDeleteModalOpen(true)}
    >
      Delete
    </DropdownItem>,
  ];

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="sysaccount-tab-settings-button-refresh"
          onClick={props.onRefresh}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          variant="secondary"
          data-cy="sysaccount-tab-settings-button-revert"
          isDisabled={!props.isModified || isSaving || props.isDataLoading}
          onClick={onRevert}
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          variant="primary"
          data-cy="sysaccount-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving || props.isDataLoading}
          type="submit"
          form="sysaccount-settings-form"
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </Button>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          dataCy="sysaccount-tab-settings-kebab"
          direction={"up"}
          onDropdownSelect={() => setIsKebabOpen(!isKebabOpen)}
          onKebabToggle={() => setIsKebabOpen(!isKebabOpen)}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={kebabItems}
          isDisabled={props.isDataLoading}
        />
      ),
    },
  ];

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={props.onOpenContextualPanel}
          />
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <Form
              className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
              id="sysaccount-settings-form"
              isHorizontal
              onSubmit={onSave}
            >
              <FormGroup label="System account ID" fieldId="uid">
                <IpaTextInput
                  dataCy="sysaccount-tab-settings-textinput-uid"
                  name="uid"
                  ariaLabel="System account ID"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="sysaccount"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup label="Description" fieldId="description">
                <IpaTextArea
                  dataCy="sysaccount-tab-settings-textarea-description"
                  name="description"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="sysaccount"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup
                label="Change passwords without reset"
                fieldId="privileged"
              >
                <Checkbox
                  data-cy="sysaccount-tab-settings-checkbox-privileged"
                  id="privileged-checkbox"
                  name="privileged"
                  label=""
                  aria-label="Change passwords without reset"
                  isChecked={
                    String(ipaObject["privileged"]).toLowerCase() === "true"
                  }
                  onChange={(_event, checked) =>
                    recordOnChange({
                      ...ipaObject,
                      privileged: checked.toString(),
                    })
                  }
                />
              </FormGroup>
            </Form>
          </Flex>
        </SidebarContent>
      </Sidebar>
      <EnableDisableSysAccountModal
        isOpen={isEnableDisableModalOpen}
        onClose={() => setIsEnableDisableModalOpen(false)}
        uid={props.sysAccount.uid || ""}
        operation={enableDisableOperation}
        onRefresh={props.onRefresh}
      />
      <DeleteSysAccountsModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        elementsToDelete={[partialSysAccountToSysAccount(props.sysAccount)]}
        clearSelectedElements={() => {}}
        columnNames={["System account ID", "Description"]}
        keyNames={["uid", "description"]}
        onRefresh={props.onRefresh}
        updateIsDeleteButtonDisabled={() => {}}
        updateIsDeletion={() => {}}
        fromSettings={true}
      />
      <ResetSysAccountPasswordModal
        uid={props.sysAccount.uid || ""}
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onRefresh={props.onRefresh}
      />
    </TabLayout>
  );
};

export default SystemAccountSettings;
