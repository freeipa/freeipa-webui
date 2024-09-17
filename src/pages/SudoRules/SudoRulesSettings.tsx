import React from "react";
// PatternFly
import { DropdownItem, Flex } from "@patternfly/react-core";
// Data types
import { Metadata, SudoRule } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useSaveSudoRuleMutation } from "src/services/rpcSudoRules";
// Utils
import { asRecord } from "src/utils/sudoRulesUtils";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import TabLayout from "src/components/layouts/TabLayout";
import SudoRuleGeneral from "src/components/SudoRuleSections/SudoRuleGeneral";
import SidebarLayout from "src/components/layouts/SidebarLayout";
import { ErrorResult } from "src/services/rpc";

interface PropsToSudoRulesSettings {
  rule: Partial<SudoRule>;
  originalRule: Partial<SudoRule>;
  metadata: Metadata;
  onRuleChange: (rule: Partial<SudoRule>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<SudoRule>;
  onResetValues: () => void;
}

const SudoRulesSettings = (props: PropsToSudoRulesSettings) => {
  const alerts = useAlerts();

  // API calls
  const [saveService] = useSaveSudoRuleMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "sudo-rules" });

  const [isSaving, setSaving] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.rule,
    props.onRuleChange
  );

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);

  const dropdownItems = [
    <DropdownItem key="enable-sudo-rule" onClick={() => onChangeEnableModal()}>
      Enable
    </DropdownItem>,
    <DropdownItem
      key="disable-sudo-rule"
      onClick={() => onChangeDisableModal()}
    >
      Disable
    </DropdownItem>,
    <DropdownItem key="delete-sudo-rule" onClick={() => onChangeDeleteModal()}>
      Delete
    </DropdownItem>,
  ];

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = React.useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = React.useState(false);
  const onChangeDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const onChangeDisableModal = () => {
    setIsDisableModalOpen(!isDisableModalOpen);
  };
  const onChangeEnableModal = () => {
    setIsEnableModalOpen(!isEnableModalOpen);
  };

  // 'Save' handle method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.rule.cn;
    setSaving(true);

    saveService(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Sudo rule modified", "success");
          props.onRefresh();
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
          // Reset values. Disable 'revert' and 'save' buttons
          props.onResetValues();
        }
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onRuleChange(props.originalRule);
    alerts.addAlert("revert-success", "Sudo rule data reverted", "success");
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={props.onRefresh}>
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

  // Sidebar items
  const itemNames = ["General"];

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <SidebarLayout itemNames={itemNames}>
        {/* General */}
        <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
          <TitleLayout headingLevel="h2" id="general" text="General" />
          <SudoRuleGeneral
            ipaObject={ipaObject}
            recordOnChange={recordOnChange}
            metadata={props.metadata}
          />
        </Flex>
      </SidebarLayout>
    </TabLayout>
  );
};

export default SudoRulesSettings;
