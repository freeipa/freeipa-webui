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
  SelectOption,
  ValidatedOptions,
} from "@patternfly/react-core";
// Layout
import SecondaryButton from "../layouts/SecondaryButton";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Data types
import { Service } from "../../utils/datatypes/globalDataTypes";
// Modals
import ErrorModal from "./ErrorModal";
// Redux
import { useAppDispatch } from "../../store/hooks";
import { addService } from "../../store/Identity/services-slice";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// Hooks
import useAlerts from "../../hooks/useAlerts";
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
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts to show in the UI
  const alerts = useAlerts();

  const [executeServiceAddCommand] = useAddServiceMutation();

  // Set host names list
  const hostsList = useAppSelector((state) => state.hosts.hostsList);
  const hostNamesList = hostsList.map((hostName) => hostName.fqdn);

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
      ref={toggleRef}
      onClick={serviceOnToggle}
      className="pf-v5-u-w-100"
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
      ref={toggleRef}
      onClick={hostNameOnToggle}
      className="pf-v5-u-w-100"
    >
      {hostNameSelected}
    </MenuToggle>
  );

  // 'Force' checkbox
  const [isForceChecked, setIsForceChecked] = useState(false);

  // 'Skip host check' checkbox
  const [isSkipHostChecked, setIsSkipHostChecked] = useState(false);

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
            id="service"
            aria-label="Select service"
            toggle={toggleService}
            onSelect={serviceOnSelect}
            selected={serviceSelected}
            isOpen={isServiceOpen}
            aria-labelledby="service"
          >
            {serviceOptions.map((option, index) => (
              <SelectOption key={index} value={option}>
                {option}
              </SelectOption>
            ))}
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
            id="host"
            aria-label="Select host name"
            toggle={toggleHost}
            onSelect={hostNameOnSelect}
            selected={hostNameSelected}
            isOpen={isHostNameOpen}
            aria-labelledby="host name"
          >
            {hostNameOptions.map((option, index) => (
              <SelectOption key={index} value={option}>
                {option}
              </SelectOption>
            ))}
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
    setAddAgainBtnSpinning(false);
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

  // Track which button has been clicked ('onAddUser' or 'onAddAndAddAnother')
  // to better handle the 'retry' function and its behavior
  let onAddServiceClicked = true;

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
        const result = data.result;

        if (error) {
          // Set status flag: error
          isAdditionSuccess = false;
          // Handle error
          handleAPIError(error);
        } else {
          // Set alert: success
          alerts.addAlert(
            "add-service-success",
            "New service added",
            "success"
          );

          // Dispatch host data to redux
          const updatedServiceList = result.result as unknown as Service;
          dispatch(addService(updatedServiceList));
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

  const addAndAddAnotherHandler = () => {
    onAddServiceClicked = false;
    const validation = validateFields();
    if (validation) {
      setAddAgainBtnSpinning(true);
      addServiceData().then(() => {
        if (isAdditionSuccess) {
          // Do not close the modal, but clean fields & reset validations
          cleanAllFields();
          resetValidations();
        } else {
          // Close the modal without cleaning fields
          if (props.onCloseAddModal !== undefined) {
            props.onCloseAddModal();
          }
          setAddAgainBtnSpinning(false);
        }
      });
    }
  };

  const addServiceHandler = () => {
    onAddServiceClicked = true;
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

    // Repeats the same previous operation
    if (onAddServiceClicked) {
      addServiceHandler();
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

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key="add-new-service"
      name="add"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addServiceHandler}
      form="modal-form"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={addSpinning}
    >
      {addSpinning ? "Adding" : "Add"}
    </SecondaryButton>,
    <SecondaryButton
      key="add-and-add-another-new-service"
      name="add_and_add_another"
      isDisabled={buttonDisabled || addAgainSpinning || addSpinning}
      onClickHandler={addAndAddAnotherHandler}
      form="modal-form"
      spinnerAriaValueText="Adding again"
      spinnerAriaLabel="Adding again"
      isLoading={addAgainSpinning}
    >
      {addAgainSpinning ? "Adding" : "Add and add another"}
    </SecondaryButton>,
    <Button
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
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
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
