/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
	Button,
	Checkbox,
	HelperText,
	HelperTextItem,
	ValidatedOptions
} from '@patternfly/react-core';
import {
	Select,
	SelectOption,
	SelectVariant
} from '@patternfly/react-core/deprecated';
// Layout
import SecondaryButton from "../layouts/SecondaryButton";
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { addService } from "src/store/Identity/services-slice";

interface PropsToAddService {
  show: boolean;
  handleModalToggle: () => void;
}

const AddService = (props: PropsToAddService) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

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

  const serviceOnToggle = (isOpen: boolean) => {
    setIsServiceOpen(isOpen);
  };

  const serviceOnSelect = (selection: any) => {
    setServiceSelected(selection.target.textContent);
    setServiceValidation({
      isError: false,
      message: "",
      pfError: ValidatedOptions.default,
    });
    setIsServiceOpen(false);
  };

  // 'Host name' select
  const [isHostNameOpen, setIsHostNameOpen] = useState(false);
  const [hostNameSelected, setHostNameSelected] = useState("");
  const hostNameOptions = hostNamesList;

  const hostNameOnToggle = (isOpen: boolean) => {
    setIsHostNameOpen(isOpen);
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

  const [hostNameValidation, setHostNameValidation] = useState({
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

  // Add button is disabled until the user fills the required fields
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (serviceSelected !== "" && hostNameSelected !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(false);
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
            name="service"
            variant={SelectVariant.single}
            placeholderText=" "
            aria-label="Select service"
            onToggle={(_event, isOpen: boolean) => serviceOnToggle(isOpen)}
            onSelect={serviceOnSelect}
            selections={serviceSelected}
            isOpen={isServiceOpen}
            aria-labelledby="service"
          >
            {serviceOptions.map((option, index) => (
              <SelectOption key={index} value={option} />
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
            id="host-name"
            name="host"
            variant={SelectVariant.single}
            placeholderText=" "
            aria-label="Select host name"
            onToggle={(_event, isOpen: boolean) => hostNameOnToggle(isOpen)}
            onSelect={hostNameOnSelect}
            selections={hostNameSelected}
            isOpen={isHostNameOpen}
            aria-labelledby="host name"
          >
            {hostNameOptions.map((option, index) => (
              <SelectOption key={index} value={option} />
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
          isChecked={isForceChecked}
          aria-label="force service checkbox"
          id="force-checkbox"
          name="force"
          value="force"
        />
      ),
    },
    {
      id: "skip-host-check-service",
      name: "",
      pfComponent: (
        <Checkbox
          label="Skip host check"
          isChecked={isSkipHostChecked}
          aria-label="skip host check checkbox"
          id="skip-host-check-checkbox"
          name="skip_host_check"
          value="skip-host-check"
        />
      ),
    },
  ];

  // Helper method to clean the fields
  const cleanAllFields = () => {
    setServiceSelected("");
    setHostNameSelected("");
    setIsForceChecked(false);
    setIsSkipHostChecked(false);
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

  // Add new 'Service'
  const addServiceHandler = () => {
    const validation = validateFields();
    if (validation) {
      const newService: Service = {
        id: serviceSelected + "/" + hostNameSelected,
        serviceType: serviceSelected,
        host: hostNameSelected,
      };
      // TODO: Manage 'Force' and 'Skip host check' behaviors
      dispatch(addService(newService));
      cleanAndCloseModal();
    }
  };

  const addAndAddAnotherServiceHandler = () => {
    const validation = validateFields();
    if (validation) {
      const newService: Service = {
        id: serviceSelected + "/" + hostNameSelected,
        serviceType: serviceSelected,
        host: hostNameSelected,
      };
      // TODO: Manage 'Force' and 'Skip host check' behaviors
      dispatch(addService(newService));
      // Do not close the modal, but clean fields & reset validations
      cleanAllFields();
      resetValidations();
    }
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <SecondaryButton
      key="add-new-service"
      name="add"
      isDisabled={buttonDisabled}
      onClickHandler={addServiceHandler}
      form="modal-form"
    >
      Add
    </SecondaryButton>,
    <SecondaryButton
      key="add-and-add-another-new-service"
      name="add_and_add_another"
      isDisabled={buttonDisabled}
      onClickHandler={addAndAddAnotherServiceHandler}
      form="modal-form"
    >
      Add and add another
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
  );
};

export default AddService;
