import React from "react";
// PatternFly
import {
  Radio,
  FlexItem,
  Flex,
  TextInput,
  Select,
  SelectOption,
  Button,
  MenuToggleElement,
  MenuToggle,
  SelectList,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Modals
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import QrCodeModal from "./QrCodeModal";
// Components
import DateTimeSelector from "src/components/Form/DateTimeSelector";
// Utils
import { NO_SELECTION_OPTION } from "src/utils/constUtils";
// RTK
import { ErrorResult } from "src/services/rpc";
import {
  useAddOtpTokenMutation,
  useGetActiveUsersQuery,
} from "src/services/rpcUsers";
// Utils
import { API_VERSION_BACKUP, toGeneralizedTime } from "src/utils/utils";

interface PropsToAddOtpToken {
  uid: string | undefined;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

const AddOtpToken = (props: PropsToAddOtpToken) => {
  const dispatch = useAppDispatch();

  // RPC hooks
  const activeUsersListQuery = useGetActiveUsersQuery();
  const [addOtpToken] = useAddOtpTokenMutation();

  // Get active users UIDs list
  const activeUsersUids: string[] = [];
  const activeUsersListData = activeUsersListQuery.data;
  const isActiveUsersListLoading = activeUsersListQuery.isLoading;

  React.useEffect(() => {
    if (!isActiveUsersListLoading) {
      if (activeUsersListData !== undefined) {
        activeUsersListData.forEach((user) => {
          activeUsersUids.push(user.uid[0]);
        });
      }
      // Add empty option at the beginning of the list
      activeUsersUids.unshift(NO_SELECTION_OPTION);
      setOwnersToSelect(activeUsersUids);
    }
  }, [isActiveUsersListLoading]);

  // Track initial values to detect changes
  const initialValues = {
    tokenType: "totp",
    tokenAlgorithm: "sha1",
    tokenDigits: "6",
    uniqueId: "",
    description: "",
    selectedOwner: props.uid,
    validityStart: null,
    validityEnd: null,
    model: "",
    vendor: "",
    serial: "",
    key: "",
    clockInterval: "",
  };

  const [tokenType, setTokenType] = React.useState(initialValues.tokenType);
  const [tokenAlgorithm, setTokenAlgorithm] = React.useState(
    initialValues.tokenAlgorithm
  );
  const [tokenDigits, setTokenDigits] = React.useState(
    initialValues.tokenDigits
  );

  const onTokenTypeChange = (checked: boolean, value: string) => {
    if (checked) {
      setTokenType(value);
    }
  };

  const onTokenAlgorithmChange = (checked: boolean, value: string) => {
    if (checked) {
      setTokenAlgorithm(value);
    }
  };

  const onTokenDigitsChange = (checked: boolean, value: string) => {
    if (checked) {
      setTokenDigits(value);
    }
  };

  const typeComponent: JSX.Element = (
    <Flex>
      <FlexItem>
        <Radio
          data-cy="modal-radio-totp"
          isChecked={tokenType === "totp"}
          name="totp"
          onChange={(_event, checked) => onTokenTypeChange(checked, "totp")}
          label="Time-based (TOTP)"
          id="time-based-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="modal-radio-hotp"
          isChecked={tokenType === "hotp"}
          name="hotp"
          onChange={(_event, checked) => onTokenTypeChange(checked, "hotp")}
          label="Counter-based (HOTP)"
          id="counter-based-radio"
        />
      </FlexItem>
    </Flex>
  );

  const algorithmComponent: JSX.Element = (
    <Flex>
      <FlexItem>
        <Radio
          data-cy="modal-radio-sha1"
          isChecked={tokenAlgorithm === "sha1"}
          name="sha1"
          onChange={(_event, checked) =>
            onTokenAlgorithmChange(checked, "sha1")
          }
          label="sha1"
          id="sha1-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="modal-radio-sha256"
          isChecked={tokenAlgorithm === "sha256"}
          name="sha256"
          onChange={(_event, checked) =>
            onTokenAlgorithmChange(checked, "sha256")
          }
          label="sha256"
          id="sha256-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="modal-radio-sha384"
          isChecked={tokenAlgorithm === "sha384"}
          name="sha384"
          onChange={(_event, checked) =>
            onTokenAlgorithmChange(checked, "sha384")
          }
          label="sha384"
          id="sha384-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="modal-radio-sha512"
          isChecked={tokenAlgorithm === "sha512"}
          name="sha512"
          onChange={(_event, checked) =>
            onTokenAlgorithmChange(checked, "sha512")
          }
          label="sha512"
          id="sha512-radio"
        />
      </FlexItem>
    </Flex>
  );

  const digitsComponent: JSX.Element = (
    <Flex>
      <FlexItem>
        <Radio
          data-cy="modal-radio-6"
          isChecked={tokenDigits === "6"}
          name="6"
          onChange={(_event, checked) => onTokenDigitsChange(checked, "6")}
          label="6"
          id="6-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          data-cy="modal-radio-8"
          isChecked={tokenDigits === "8"}
          name="8"
          onChange={(_event, checked) => onTokenDigitsChange(checked, "8")}
          label="8"
          id="8-radio"
        />
      </FlexItem>
    </Flex>
  );

  // Text inputs
  const [uniqueId, setUniqueId] = React.useState(initialValues.uniqueId);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [vendor, setVendor] = React.useState(initialValues.vendor);
  const [model, setModel] = React.useState(initialValues.model);
  const [serial, setSerial] = React.useState(initialValues.serial);
  const [key, setKey] = React.useState(initialValues.key);
  const [clockInterval, setClockInterval] = React.useState(
    initialValues.clockInterval
  );

  // Selector
  const [isOwnerOpen, setIsOwnerOpen] = React.useState(false);
  const [selectedOwner, setSelectedOwner] = React.useState(
    initialValues.selectedOwner
  );
  const [ownersToSelect, setOwnersToSelect] =
    React.useState<string[]>(activeUsersUids);

  const onOwnerSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    let valueToUpdate = "";

    if (selection !== NO_SELECTION_OPTION) {
      valueToUpdate = selection as string;
    }

    setSelectedOwner(valueToUpdate);
    setIsOwnerOpen(!isOwnerOpen);
  };

  const onToggle = () => {
    setIsOwnerOpen(!isOwnerOpen);
  };

  // Toggle
  const toggleOwnersToSelect = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy="modal-select-owner-toggle"
      ref={toggleRef}
      onClick={onToggle}
      isExpanded={isOwnerOpen}
      variant={"default"}
      className="pf-v6-u-w-100"
    >
      {selectedOwner}
    </MenuToggle>
  );

  const ownerComponent: JSX.Element = (
    <Select
      data-cy="modal-select-owner"
      id={"owner"}
      aria-label={"Selector for owner"}
      toggle={toggleOwnersToSelect}
      onSelect={onOwnerSelect}
      selected={selectedOwner}
      isOpen={isOwnerOpen}
    >
      <SelectList>
        {ownersToSelect.map((option, index) => {
          return (
            <SelectOption
              data-cy={"modal-select-owner-" + option}
              key={index}
              value={option}
            >
              {option}
            </SelectOption>
          );
        })}
      </SelectList>
    </Select>
  );

  // Date-time selectors
  // - Generalized time format ('YYYYMMDDHHMMSSZ')
  const [validityStart, setValidityStart] = React.useState<Date | null>(
    initialValues.validityStart
  );
  const [validityEnd, setValidityEnd] = React.useState<Date | null>(
    initialValues.validityEnd
  );

  // List of fields
  const fields: Field[] = [
    {
      id: "radio-buttons-type",
      name: "type",
      pfComponent: typeComponent,
    },
    {
      id: "unique-id",
      name: "Unique ID",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-unique-id"
          id="unique-id"
          type="text"
          aria-label="text input for unique-id"
          value={uniqueId}
          onChange={(_event, value) => setUniqueId(value)}
        />
      ),
    },
    {
      id: "description",
      name: "Description",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-description"
          id="description"
          type="text"
          aria-label="text input for description"
          value={description}
          onChange={(_event, value) => setDescription(value)}
        />
      ),
    },
    {
      id: "owner",
      name: "Owner",
      pfComponent: ownerComponent,
    },
    {
      id: "validity-start",
      name: "Validity start",
      pfComponent: (
        <DateTimeSelector
          dataCy="modal-textbox-validity-start"
          datetime={validityStart}
          onChange={setValidityStart}
          name="ipatokennotbefore"
          ariaLabel="Validity start date selector"
        />
      ),
    },
    {
      id: "validity-end",
      name: "Validity end",
      pfComponent: (
        <DateTimeSelector
          dataCy="modal-textbox-validity-end"
          datetime={validityEnd}
          onChange={setValidityEnd}
          name="ipatokennotafter"
          ariaLabel="Validity end date selector"
        />
      ),
    },
    {
      id: "vendor",
      name: "Vendor",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-vendor"
          id="vendor"
          name="ipatokenvendor"
          type="text"
          aria-label="text input for vendor"
          value={vendor}
          onChange={(_event, value) => setVendor(value)}
        />
      ),
    },
    {
      id: "model",
      name: "Model",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-model"
          id="model"
          name="ipatokenmodel"
          type="text"
          aria-label="text input for model"
          value={model}
          onChange={(_event, value) => setModel(value)}
        />
      ),
    },
    {
      id: "serial",
      name: "Serial",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-serial"
          id="serial"
          name="ipatokenserial"
          type="text"
          aria-label="text input for serial"
          value={serial}
          onChange={(_event, value) => setSerial(value)}
        />
      ),
    },
    {
      id: "key",
      name: "Key",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-key"
          id="key"
          name="ipatokenotpkey"
          type="text"
          aria-label="text input for key"
          value={key}
          onChange={(_event, value) => setKey(value)}
        />
      ),
    },
    {
      id: "algorithm",
      name: "Algorithm",
      pfComponent: algorithmComponent,
    },
    {
      id: "digits",
      name: "Digits",
      pfComponent: digitsComponent,
    },
    {
      id: "clock-interval",
      name: "Clock interval (seconds)",
      pfComponent: (
        <TextInput
          data-cy="modal-textbox-clock-interval"
          id="clock-interval"
          name="ipatokentotptimestep"
          type="text"
          aria-label="text input for clock interval"
          value={clockInterval}
          onChange={(_event, value) => setClockInterval(value)}
          className="pf-u-mb-md"
          isDisabled={tokenType === "hotp"}
        />
      ),
    },
  ];

  // Return the updated values (taking as reference the initial ones)
  const getModifiedValues = () => {
    const modifiedValues = {};
    if (tokenType !== initialValues.tokenType) {
      modifiedValues["type"] = tokenType;
    }
    if (description !== initialValues.description) {
      modifiedValues["description"] = description;
    }
    if (selectedOwner) {
      modifiedValues["ipatokenowner"] = selectedOwner;
    }
    if (validityStart !== initialValues.validityStart) {
      modifiedValues["ipatokennotbefore"] = toGeneralizedTime(validityStart);
    }
    if (validityEnd !== initialValues.validityEnd) {
      modifiedValues["ipatokennotafter"] = toGeneralizedTime(validityEnd);
    }
    if (vendor !== initialValues.vendor) {
      modifiedValues["ipatokenvendor"] = vendor;
    }
    if (model !== initialValues.model) {
      modifiedValues["ipatokenmodel"] = model;
    }
    if (serial !== initialValues.serial) {
      modifiedValues["ipatokenserial"] = serial;
    }
    if (key !== initialValues.key) {
      modifiedValues["ipatokenotpkey"] = key;
    }
    if (tokenAlgorithm !== initialValues.tokenAlgorithm) {
      modifiedValues["ipatokenotpalgorithm"] = tokenAlgorithm;
    }
    if (tokenDigits !== initialValues.tokenDigits) {
      modifiedValues["ipatokenotpdigits"] = tokenDigits;
    }
    if (clockInterval !== initialValues.clockInterval) {
      modifiedValues["ipatokentotptimestep"] = clockInterval;
    }
    modifiedValues["version"] = API_VERSION_BACKUP;
    return modifiedValues;
  };

  // QR data
  const [uri, setUri] = React.useState("");

  // QR code modal
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const onQrModalClose = () => {
    setIsQrModalOpen(false);
  };

  // Buttons functionality
  // - API call to add otp token
  const onAddOtpToken = () => {
    // Get updated values as params
    const params = getModifiedValues();
    // Payload
    const payload = [[uniqueId], params];

    addOtpToken(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Update URI
          setUri(response.data.result.result.uri as string);
          // Close modal
          props.onClose();
          // Show QR modal
          setIsQrModalOpen(true);
          // Reset fields
          resetFields();
        } else if (response.data?.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "add-otp-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
        }
      }
    });
  };

  // Reset fields
  const resetFields = () => {
    setTokenType(initialValues.tokenType);
    setUniqueId(initialValues.uniqueId);
    setDescription(initialValues.description);
    setSelectedOwner(initialValues.selectedOwner);
    setValidityStart(initialValues.validityStart);
    setValidityEnd(initialValues.validityEnd);
    setModel(initialValues.model);
    setVendor(initialValues.vendor);
    setSerial(initialValues.serial);
    setKey(initialValues.key);
    setTokenAlgorithm(initialValues.tokenAlgorithm);
    setTokenDigits(initialValues.tokenDigits);
    setClockInterval(initialValues.clockInterval);
  };

  // Reset fields and close modal
  const onResetFieldsAndCloseModal = () => {
    resetFields();
    props.onClose();
  };

  const actions = [
    <Button
      data-cy="modal-button-add"
      key={"add-otp-token"}
      variant="primary"
      type="submit"
      form="add-otp-token-form"
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key={"cancel-reset-password"}
      variant="link"
      onClick={onResetFieldsAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy="add-otp-token-modal"
        variantType="small"
        modalPosition="top"
        title="Add OTP token"
        formId="add-otp-token-form"
        fields={fields}
        show={props.isOpen}
        onSubmit={() => onAddOtpToken()}
        onClose={props.onClose}
        actions={actions}
      />
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={onQrModalClose}
        QrUri={uri}
      />
    </>
  );
};

export default AddOtpToken;
