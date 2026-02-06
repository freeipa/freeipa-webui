/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Checkbox,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  ValidatedOptions,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "../layouts/SecondaryButton";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Modals
import ErrorModal from "./ErrorModal";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import { FindRPCResponse } from "../../services/rpc";
import {
  ServiceAddPayload,
  useAddServiceMutation,
} from "../../services/rpcServices";

interface PropsToAddService {
  show: boolean;
  hostsList: string[];
  handleModalToggle: () => void;
  onOpenAddModal?: () => void;
  onCloseAddModal?: () => void;
  onRefresh?: () => void;
}

const AddService = (props: PropsToAddService) => {
  const dispatch = useAppDispatch();
  const [executeServiceAddCommand] = useAddServiceMutation();

  // Set host names list
  const [addSpinning, setAddBtnSpinning] = React.useState<boolean>(false);

  // 'Service' select
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [serviceSelected, setServiceSelected] = useState("");
  const serviceOptions = [
    "cifs",
    "DNS",
    "ftp",
    "HTTP",
    "imap",
    "ldap",
    "libvirt",
    "nfs",
    "smtp",
    "qpidd",
  ];

  const serviceOnToggle = () => {
    setIsServiceOpen(!isServiceOpen);
  };

  // Toggle
  const toggleService = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy="modal-select-service-toggle"
      ref={toggleRef}
      onClick={serviceOnToggle}
      className="pf-v6-u-w-100"
      isExpanded={isServiceOpen}
    >
      {serviceSelected}
    </MenuToggle>
  );

  const serviceOnSelect = (selection: any) => {
    setServiceSelected(selection.target.textContent);
    setServiceValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
    setIsServiceOpen(false);
  };

  // Validation fields
  const [hostNameValidation, setHostNameValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });

  // 'Host name' select
  const [isHostNameOpen, setIsHostNameOpen] = useState(false);
  const [hostNameSelected, setHostNameSelected] = useState("");

  const hostNameOnToggle = () => {
    setIsHostNameOpen(!isHostNameOpen);
  };

  const hostNameOnSelect = (selection: any) => {
    setHostNameSelected(selection.target.textContent);
    setHostNameValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
    setIsHostNameOpen(false);
  };

  // Toggle
  const toggleHost = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy="modal-select-host-name-toggle"
      ref={toggleRef}
      onClick={hostNameOnToggle}
      className="pf-v6-u-w-100"
      isExpanded={isHostNameOpen}
    >
      {hostNameSelected}
    </MenuToggle>
  );

  // Validation fields
  const [serviceValidation, setServiceValidation] = useState({
    isError: false,
    message: "",
    pfError: ValidatedOptions.default,
  });

  const serviceValidationHandler = () => {
    if (serviceSelected === "") {
      const serviceVal = {
        isError: true,
        message: "Required field",
        pfError: ValidatedOptions.error,
      };
      setServiceValidation(serviceVal);
      return true;
    } else {
      const serviceVal = {
        isError: false,
        message: "",
        pfError: ValidatedOptions.default,
      };
      setServiceValidation(serviceVal);
      return false;
    }
  };

  const hostNameValidationHandler = () => {
    if (hostNameSelected === "") {
      const hostNameVal = {
        isError: true,
        message: "Required field",
        pfError: ValidatedOptions.error,
      };
      setHostNameValidation(hostNameVal);
      return true;
    } else {
      const hostNameVal = {
        isError: false,
        message: "",
        pfError: ValidatedOptions.default,
      };
      setHostNameValidation(hostNameVal);
      return false;
    }
  };

  // Reset validation methods
  // - Service
  const resetServiceError = () => {
    setHostNameValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // - Host name
  const resetHostNameError = () => {
    setHostNameValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
  };

  // Helper method to reset validation values
  const resetValidations = () => {
    resetServiceError();
    resetHostNameError();
  };

  // Checklbox handlers
  const [forceCheckbox, setForceCheckbox] = useState(false);
  const [skipHostCheckbox, setSkipHostCheckbox] = useState(false);
  // Force
  const handleForceCheckbox = () => {
    setForceCheckbox(!forceCheckbox);
  };
  // Skip host check
  const handleSkipHostCheckCheckbox = () => {
    setSkipHostCheckbox(!skipHostCheckbox);
  };

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (serviceSelected !== "" && hostNameSelected !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [serviceSelected, hostNameSelected]);

  // List of fields
  const fields = [
    {
      id: "service-select",
      name: "Service",
      fieldRequired: true,
      pfComponent: (
        <>
          <Select
            data-cy="modal-select-service"
            id="service"
            aria-label="Select service"
            toggle={toggleService}
            onSelect={serviceOnSelect}
            selected={serviceSelected}
            isOpen={isServiceOpen}
            aria-labelledby="service"
          >
            <SelectList>
              {serviceOptions.map((option, index) => (
                <SelectOption
                  data-cy={"modal-select-service-" + option}
                  key={index}
                  value={option}
                >
                  {option}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
          <HelperText>
            {!serviceValidation.isError && (
              <HelperTextItem>{serviceValidation.message}</HelperTextItem>
            )}
            {serviceValidation.isError && (
              <HelperTextItem variant="error">
                {serviceValidation.message}
              </HelperTextItem>
            )}
          </HelperText>
        </>
      ),
    },
    {
      id: "host-name-select",
      name: "Host name",
      fieldRequired: true,
      pfComponent: (
        <>
          <Select
            data-cy="modal-select-host-name"
            id="host"
            aria-label="Select host name"
            toggle={toggleHost}
            onSelect={hostNameOnSelect}
            selected={hostNameSelected}
            isOpen={isHostNameOpen}
            aria-labelledby="host name"
          >
            <SelectList>
              {props.hostsList.map((option, index) => (
                <SelectOption
                  data-cy={"modal-select-host-name-" + option}
                  key={index}
                  value={option}
                >
                  {option}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
          <HelperText>
            {!hostNameValidation.isError && (
              <HelperTextItem>{hostNameValidation.message}</HelperTextItem>
            )}
            {hostNameValidation.isError && (
              <HelperTextItem variant="error">
                {hostNameValidation.message}
              </HelperTextItem>
            )}
          </HelperText>
        </>
      ),
    },
    {
      id: "force-service",
      name: "",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-force-service"
          label="Force"
          isChecked={forceCheckbox}
          aria-label="force service checkbox"
          id="force-checkbox"
          name="force"
          value="force"
          onChange={handleForceCheckbox}
        />
      ),
    },
    {
      id: "skip-host-check-service",
      name: "",
      pfComponent: (
        <Checkbox
          data-cy="modal-checkbox-skip-host-check-service"
          label="Skip host check"
          isChecked={skipHostCheckbox}
          aria-label="skip host check checkbox"
          id="skip-host-check-checkbox"
          name="skip_host_check"
          value="skip-host-check"
          onChange={handleSkipHostCheckCheckbox}
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setServiceSelected("");
    setHostNameSelected("");
    setForceCheckbox(false);
    setSkipHostCheckbox(false);
    setIsHostNameOpen(false);
    setIsServiceOpen(false);
    setAddBtnSpinning(false);
  };

  // Clean fields and close modal (To prevent data persistence when reopen modal)
  const cleanAndCloseModal = () => {
    cleanAllFields();
    resetValidations();
    props.handleModalToggle();
  };

  // List of field validations
  const validateFields = () => {
    resetValidations();
    const serviceError = serviceValidationHandler();
    const hostNameError = hostNameValidationHandler();
    if (serviceError || hostNameError) {
      return false;
    } else return true;
  };

  // Define status flags to determine user added successfully or error
  let isAdditionSuccess = true;

  // Add host data
  const addServiceData = async () => {
    const newServicePayload = {
      service: serviceSelected + "/" + hostNameSelected,
      force: forceCheckbox,
      skip_host_check: skipHostCheckbox,
    } as ServiceAddPayload;

    // Add host via API call
    await executeServiceAddCommand(newServicePayload).then((service) => {
      if ("data" in service) {
        const data = service.data as FindRPCResponse;
        const error = data.error as FetchBaseQueryError | SerializedError;

        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          dispatch(
            addAlert({
              name: "add-service-success",
              title: "New service added",
              variant: "success",
            })
          );

          // Set status flag: success
          isAdditionSuccess = true;
          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh();
          }
        }
      }
    });
  };

  const addServiceHandler = () => {
    const validation = validateFields();
    if (validation) {
      setAddBtnSpinning(true);
      addServiceData().then(() => {
        if (!isAdditionSuccess) {
          // Close the modal without cleaning fields
          if (props.onCloseAddModal !== undefined) {
            props.onCloseAddModal();
          }
          setAddBtnSpinning(false);
        } else {
          // Clean data and close modal
          cleanAndCloseModal();
        }
      });
    }
  };

  // Error handling
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

    addServiceHandler();
  };

  const errorModalActions = [
    <SecondaryButton
      dataCy="modal-button-retry"
      key="retry"
      onClickHandler={onRetry}
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
      key="add-new-service"
      name="add"
      isDisabled={buttonDisabled || addSpinning}
      onClick={() => addServiceHandler()}
      form="modal-form"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-service"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy="add-service-modal"
        variantType="small"
        modalPosition="top"
        offPosition="76px"
        title="Add service"
        formId="add-service-modal"
        fields={fields}
        show={props.show}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="add-service-modal-error"
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

export default AddService;
