import React from "react";
// PatternFly
import {
  Radio,
  FlexItem,
  Flex,
  TextInput,
  Select,
  SelectVariant,
  SelectOptionObject,
  SelectOption,
  Button,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Modals
import ModalWithFormLayout, { Field } from "../layouts/ModalWithFormLayout";
import QrCodeModal from "./QrCodeModal";
// Components
import DateTimeSelector from "../Form/DateTimeSelector";
// Utils
import { NO_SELECTION_OPTION } from "src/utils/constUtils";
// RTK
import {
  ErrorResult,
  useAddOtpTokenMutation,
  useGetActiveUsersQuery,
} from "src/services/rpc";
// Utils
import { API_VERSION_BACKUP } from "src/utils/utils";

interface PropsToAddOtpToken {
  uid: string | undefined;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

const AddOtpToken = (props: PropsToAddOtpToken) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

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
    isTimeBasedChecked: true,
    isCounterBasedChecked: false,
    uniqueId: "",
    description: "",
    selectedOwner: props.uid,
    validityStart: "",
    validityEnd: "",
    model: "",
    vendor: "",
    serial: "",
    key: "",
    isSha1Checked: true,
    isSha256Checked: false,
    isSha384Checked: false,
    isSha512Checked: false,
    digit6: true,
    digit8: false,
    clockInterval: "",
  };

  // Radio buttons
  const [isTimeBasedChecked, setIsTimeBasedChecked] = React.useState(
    initialValues.isTimeBasedChecked
  );
  const [isCounterBasedChecked, setIsCounterBasedChecked] = React.useState(
    initialValues.isCounterBasedChecked
  );
  const [isSha1Checked, setIsSha1Checked] = React.useState(
    initialValues.isSha1Checked
  );
  const [isSha256Checked, setIsSha256Checked] = React.useState(
    initialValues.isSha256Checked
  );
  const [isSha384Checked, setIsSha384Checked] = React.useState(
    initialValues.isSha384Checked
  );
  const [isSha512Checked, setIsSha512Checked] = React.useState(
    initialValues.isSha512Checked
  );
  const [digit6, setdigit6] = React.useState(initialValues.digit6);
  const [digit8, setdigit8] = React.useState(initialValues.digit8);

  const onChangeTimeBased = (checked: boolean) => {
    setIsTimeBasedChecked(checked);
    setIsCounterBasedChecked(!checked);
  };

  const onChangeCounterBased = (checked: boolean) => {
    setIsCounterBasedChecked(checked);
    setIsTimeBasedChecked(!checked);
  };

  const onChangeSha1 = (checked: boolean) => {
    setIsSha1Checked(checked);
    setIsSha256Checked(!checked);
    setIsSha384Checked(!checked);
    setIsSha512Checked(!checked);
  };

  const onChangeSha256 = (checked: boolean) => {
    setIsSha1Checked(!checked);
    setIsSha256Checked(checked);
    setIsSha384Checked(!checked);
    setIsSha512Checked(!checked);
  };

  const onChangeSha384 = (checked: boolean) => {
    setIsSha1Checked(!checked);
    setIsSha256Checked(!checked);
    setIsSha384Checked(checked);
    setIsSha512Checked(!checked);
  };

  const onChangeSha512 = (checked: boolean) => {
    setIsSha1Checked(!checked);
    setIsSha256Checked(!checked);
    setIsSha384Checked(!checked);
    setIsSha512Checked(checked);
  };

  const onChangeDigit6 = (checked: boolean) => {
    setdigit6(checked);
    setdigit8(!checked);
  };

  const onChangeDigit8 = (checked: boolean) => {
    setdigit8(checked);
    setdigit6(!checked);
  };

  const typeComponent: JSX.Element = (
    <Flex>
      <FlexItem>
        <Radio
          isChecked={isTimeBasedChecked}
          name="totp"
          onChange={onChangeTimeBased}
          label="Time-based (TOTP)"
          id="time-based-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={isCounterBasedChecked}
          name="hotp"
          onChange={onChangeCounterBased}
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
          isChecked={isSha1Checked}
          name="sha1"
          onChange={onChangeSha1}
          label="sha1"
          id="sha1-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={isSha256Checked}
          name="sha256"
          onChange={onChangeSha256}
          label="sha256"
          id="sha256-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={isSha384Checked}
          name="sha384"
          onChange={onChangeSha384}
          label="sha384"
          id="sha384-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={isSha512Checked}
          name="sha512"
          onChange={onChangeSha512}
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
          isChecked={digit6}
          name="6"
          onChange={onChangeDigit6}
          label="6"
          id="6-radio"
        />
      </FlexItem>
      <FlexItem>
        <Radio
          isChecked={digit8}
          name="8"
          onChange={onChangeDigit8}
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
    _event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject
  ) => {
    let valueToUpdate = "";

    if (selection !== NO_SELECTION_OPTION) {
      valueToUpdate = selection as string;
    }

    setSelectedOwner(valueToUpdate);
    setIsOwnerOpen(!isOwnerOpen);
  };

  const ownerComponent: JSX.Element = (
    <Select
      id={"owner"}
      name={"ipatokenowner"}
      variant={SelectVariant.single}
      aria-label={"Selector for owner"}
      onToggle={setIsOwnerOpen}
      onSelect={onOwnerSelect}
      selections={selectedOwner}
      isOpen={isOwnerOpen}
    >
      {ownersToSelect.map((option, index) => {
        return <SelectOption key={index} value={option} />;
      })}
    </Select>
  );

  // Date-time selectors
  // - Generalized time format ('YYYYMMDDHHMMSSZ')
  const [validityStart, setValidityStart] = React.useState<string>(
    initialValues.validityStart
  );
  const [validityEnd, setValidityEnd] = React.useState<string>(
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
          id="unique-id"
          type="text"
          aria-label="text input for unique-id"
          value={uniqueId}
          onChange={(value) => setUniqueId(value)}
        />
      ),
    },
    {
      id: "description",
      name: "Description",
      pfComponent: (
        <TextInput
          id="description"
          type="text"
          aria-label="text input for description"
          value={description}
          onChange={(value) => setDescription(value)}
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
          timeValue={validityStart}
          setTimeValue={setValidityStart}
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
          timeValue={validityEnd}
          setTimeValue={setValidityEnd}
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
          id="vendor"
          name="ipatokenvendor"
          type="text"
          aria-label="text input for vendor"
          value={vendor}
          onChange={(value) => setVendor(value)}
        />
      ),
    },
    {
      id: "model",
      name: "Model",
      pfComponent: (
        <TextInput
          id="model"
          name="ipatokenmodel"
          type="text"
          aria-label="text input for model"
          value={model}
          onChange={(value) => setModel(value)}
        />
      ),
    },
    {
      id: "serial",
      name: "Serial",
      pfComponent: (
        <TextInput
          id="serial"
          name="ipatokenserial"
          type="text"
          aria-label="text input for serial"
          value={serial}
          onChange={(value) => setSerial(value)}
        />
      ),
    },
    {
      id: "key",
      name: "Key",
      pfComponent: (
        <TextInput
          id="key"
          name="ipatokenotpkey"
          type="text"
          aria-label="text input for key"
          value={key}
          onChange={(value) => setKey(value)}
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
          id="clock-interval"
          name="ipatokentotptimestep"
          type="text"
          aria-label="text input for clock interval"
          value={clockInterval}
          onChange={(value) => setClockInterval(value)}
          className="pf-u-mb-md"
          isDisabled={!isTimeBasedChecked}
        />
      ),
    },
  ];

  // Return the updated values (taking as reference the initial ones)
  const getModifiedValues = () => {
    const modifiedValues = {};
    if (isTimeBasedChecked) {
      modifiedValues["type"] = "totp";
    } else {
      modifiedValues["type"] = "hotp";
    }
    if (description !== initialValues.description) {
      modifiedValues["description"] = description;
    }
    if (selectedOwner) {
      modifiedValues["ipatokenowner"] = selectedOwner;
    }
    if (validityStart !== initialValues.validityStart) {
      modifiedValues["ipatokennotbefore"] = validityStart;
    }
    if (validityEnd !== initialValues.validityEnd) {
      modifiedValues["ipatokennotafter"] = validityEnd;
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
      modifiedValues["key"] = key;
    }
    if (isSha1Checked) {
      modifiedValues["ipatokenotpalgorithm"] = "sha1";
    } else if (isSha256Checked) {
      modifiedValues["ipatokenotpalgorithm"] = "sha256";
    } else if (isSha384Checked) {
      modifiedValues["ipatokenotpalgorithm"] = "sha384";
    } else if (isSha512Checked) {
      modifiedValues["ipatokenotpalgorithm"] = "sha512";
    }
    if (digit6) {
      modifiedValues["ipatokenotpdigits"] = "6";
    } else {
      modifiedValues["ipatokenotpdigits"] = "8";
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
  const [addAndAddAnotherChecked, setAddAndAddAnotherChecked] =
    React.useState(false);
  const onQrModalClose = () => {
    setIsQrModalOpen(false);
  };

  // Buttons functionality
  // - API call to add otp token
  const onAddOtpToken = (addAndAddAnotherChecked: boolean) => {
    // Get updated values as params
    const params = getModifiedValues();
    // Payload
    const payload = [[uniqueId], params];

    addOtpToken(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Update URI
          setUri(response.data.result.result.uri as string);
          // Close modal
          if (addAndAddAnotherChecked) {
            props.onClose();
            setAddAndAddAnotherChecked(true);
          } else {
            props.onClose();
          }
          // Show QR modal
          setIsQrModalOpen(true);
          // Reset fields
          resetFields();
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("add-otp-error", errorMessage.message, "danger");
        }
      }
    });
  };

  // If the 'add and add another' option has been selected,
  //  open the modal again after showing the previous generated QR code.
  React.useEffect(() => {
    if (!isQrModalOpen && addAndAddAnotherChecked) {
      props.setIsOpen(true);
      setAddAndAddAnotherChecked(false);
    }
  }, [isQrModalOpen, addAndAddAnotherChecked]);

  // Reset fields
  const resetFields = () => {
    setIsTimeBasedChecked(initialValues.isTimeBasedChecked);
    setIsCounterBasedChecked(initialValues.isCounterBasedChecked);
    setUniqueId(initialValues.uniqueId);
    setDescription(initialValues.description);
    setSelectedOwner(initialValues.selectedOwner);
    setValidityStart(initialValues.validityStart);
    setValidityEnd(initialValues.validityEnd);
    setModel(initialValues.model);
    setVendor(initialValues.vendor);
    setSerial(initialValues.serial);
    setKey(initialValues.key);
    setIsSha1Checked(initialValues.isSha1Checked);
    setIsSha256Checked(initialValues.isSha256Checked);
    setIsSha384Checked(initialValues.isSha384Checked);
    setIsSha512Checked(initialValues.isSha512Checked);
    setdigit6(initialValues.digit6);
    setdigit8(initialValues.digit8);
    setClockInterval(initialValues.clockInterval);
  };

  // Reset fields and close modal
  const onResetFieldsAndCloseModal = () => {
    resetFields();
    props.onClose();
  };

  const actions = [
    <Button
      key={"add-otp-token"}
      variant="primary"
      onClick={() => onAddOtpToken(false)}
    >
      Add
    </Button>,
    <Button
      key={"add-and-add-another-otp-token"}
      variant="primary"
      onClick={() => onAddOtpToken(true)}
    >
      Add and add another
    </Button>,
    <Button
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
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="small"
        modalPosition="top"
        title="Add OTP token"
        formId="add-otp-token-form"
        fields={fields}
        show={props.isOpen}
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
