import React, { useState } from "react";
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import { SudoRule } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  Command,
  BatchRPCResponse,
  useBatchMutCommandMutation,
  ErrorResult,
} from "src/services/rpc";
import {
  useDisableSudoRuleMutation,
  useEnableSudoRuleMutation,
} from "src/services/rpcSudoRules";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "src/components/modals/ErrorModal";
// Data types
import { ErrorData } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";

interface ButtonsData {
  updateIsEnableButtonDisabled: (value: boolean) => void;
  updateIsDisableButtonDisabled: (value: boolean) => void;
  updateIsDisableEnableOp: (value: boolean) => void;
}

interface SelectedRulesData {
  selectedRules: SudoRule[];
  clearSelectedRules: () => void;
}

export interface PropsToDisableEnableRules {
  show: boolean;
  handleModalToggle: () => void;
  optionSelected: boolean; // 'enable': false | 'disable': true
  selectedRulesData: SelectedRulesData;
  buttonsData?: ButtonsData;
  onRefresh?: () => void;
  singleRule?: boolean | false;
}

const DisableEnableSudoRules = (props: PropsToDisableEnableRules) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Define 'executeEnableDisableCommand' to add rules to IPA server
  const [executeEnableDisableCommand] = useBatchMutCommandMutation();
  // Single rule operations
  const [enableSingleRule] = useEnableSudoRuleMutation();
  const [disableSingleRule] = useDisableSudoRuleMutation();

  // Define which action (enable | disable) based on 'optionSelected'
  const action = !props.optionSelected ? "enable" : "disable";

  const rules = props.selectedRulesData.selectedRules.map((rule) => rule.cn);

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content>
          <Content component={ContentVariants.p}>
            Are you sure you want to {action} selected entries?
          </Content>
          <Content component={ContentVariants.p}>
            <i>{rules.join(", ")}</i>
          </Content>
        </Content>
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
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
  };

  const errorModalActions = [
    <Button
      data-cy="modal-button-ok"
      key="ok"
      variant="link"
      onClick={onCloseErrorModal}
    >
      OK
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    } else if ("data" in error) {
      const errorData = error.data as ErrorData;
      const errorCode = errorData.code as string;
      const errorName = errorData.name as string;
      const errorMessage = errorData.error as string;

      setErrorTitle("IPA error " + errorCode + ": " + errorName);
      setErrorMessage(errorMessage);
    }
    setIsModalErrorOpen(true);
  };

  // Modify rule status using IPA commands
  const modifyStatus = (newStatus: boolean, selectedRules: SudoRule[]) => {
    // Prepare rule params
    const idsToChangeStatusPayload: Command[] = [];
    const changeStatusParams = {};
    const option = props.optionSelected
      ? "sudorule_disable"
      : "sudorule_enable";

    // Make the API call (depending on 'singleRule' value)
    if (props.singleRule === undefined || !props.singleRule) {
      selectedRules.map((rule) => {
        const payloadItem = {
          method: option,
          params: [rule.cn, changeStatusParams],
        } as Command;

        idsToChangeStatusPayload.push(payloadItem);
      });

      executeEnableDisableCommand(idsToChangeStatusPayload).then((response) => {
        if ("data" in response) {
          const data = response.data as BatchRPCResponse;
          const result = data.result;
          const error = data.error as FetchBaseQueryError | SerializedError;

          if (result) {
            if ("error" in result.results[0] && result.results[0].error) {
              const errorData = {
                code: result.results[0].error_code,
                name: result.results[0].error_name,
                error: result.results[0].error,
              } as ErrorData;

              const error = {
                status: "CUSTOM_ERROR",
                data: errorData,
              } as FetchBaseQueryError;

              // Handle error
              handleAPIError(error);
            } else {
              if (props.buttonsData !== undefined) {
                // Update 'isDisbleEnableOp' to notify table that an updating operation is performed
                props.buttonsData.updateIsDisableEnableOp(true);

                // Update buttons
                if (!props.optionSelected) {
                  // Enable
                  props.buttonsData.updateIsEnableButtonDisabled(true);
                  props.buttonsData.updateIsDisableButtonDisabled(false);
                  // Set alert: success
                  alerts.addAlert(
                    "enable-sudorule-success",
                    "Sudo rule enabled",
                    "success"
                  );
                } else if (props.optionSelected) {
                  // Disable
                  props.buttonsData.updateIsEnableButtonDisabled(false);
                  props.buttonsData.updateIsDisableButtonDisabled(true);
                  // Set alert: success
                  alerts.addAlert(
                    "disable-sudorule-success",
                    "Sudo rule disabled",
                    "success"
                  );
                }
              }

              // Reset selected rules
              props.selectedRulesData.clearSelectedRules();

              // Refresh data
              if (props.onRefresh !== undefined) {
                props.onRefresh();
              }
            }
          } else if (error) {
            // Handle error
            handleAPIError(error);
          }
          // Close modal
          closeModal();
        }
      });
    } else {
      // Single rule operation
      let command;
      if (option === "sudorule_disable") {
        command = disableSingleRule;
      } else {
        command = enableSingleRule;
      }

      const payload = props.selectedRulesData.selectedRules[0];

      command(payload).then((response) => {
        if ("data" in response) {
          if (response.data.result) {
            // Close modal
            closeModal();
            // Set alert: success
            alerts.addAlert(
              "enable-sudorule-success",
              "Enabled Sudo rule '" +
                props.selectedRulesData.selectedRules[0].cn +
                "'",
              "success"
            );
            // Reset selected rules
            props.selectedRulesData.clearSelectedRules();
            // Refresh data
            if (props.onRefresh !== undefined) {
              props.onRefresh();
            }
          } else if (response.data.error) {
            // Set alert: error
            const errorMessage = response.data.error as ErrorResult;
            alerts.addAlert(
              "enable-sudorule-error",
              errorMessage.message,
              "danger"
            );
          }
        }
      });
    }
  };

  // Set the Modal and Action buttons for 'Disable' option
  const modalActionsDisable: JSX.Element[] = [
    <Button
      data-cy="modal-button-disable"
      key="disable-sudorules"
      variant="primary"
      onClick={() =>
        modifyStatus(
          props.optionSelected,
          props.selectedRulesData.selectedRules
        )
      }
      form="sudorules-enable-disable-modal"
    >
      Disable
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-disable-sudorule"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  const modalDisable: JSX.Element = (
    <ModalWithFormLayout
      dataCy="disable-enable-sudo-rules-modal"
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Disable confirmation"
      formId="sudorules-enable-disable-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsDisable}
    />
  );

  // Set the Modal and Action buttons for 'Enable' option
  const modalActionsEnable: JSX.Element[] = [
    <Button
      data-cy="modal-button-enable"
      key="enable-sudorules"
      variant="primary"
      onClick={() =>
        modifyStatus(
          props.optionSelected,
          props.selectedRulesData.selectedRules
        )
      }
      form="sudorules-enable-disable-modal"
    >
      Enable
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-enable-sudorule"
      variant="link"
      onClick={closeModal}
    >
      Cancel
    </Button>,
  ];

  const modalEnable: JSX.Element = (
    <ModalWithFormLayout
      dataCy="disable-enable-sudo-rules-modal"
      variantType="medium"
      modalPosition="top"
      offPosition="76px"
      title="Enable confirmation"
      formId="sudorules-enable-disable-modal"
      fields={fields}
      show={props.show}
      onClose={closeModal}
      actions={modalActionsEnable}
    />
  );

  return (
    <>
      <alerts.ManagedAlerts />
      {!props.optionSelected ? modalEnable : modalDisable}
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="disable-enable-sudo-rules-modal-error"
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

export default DisableEnableSudoRules;
