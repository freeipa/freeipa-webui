import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  Flex,
  FormGroup,
  Radio,
  TextInput,
} from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import CustomTooltip from "src/components/layouts/CustomTooltip";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import NumberSelector from "src/components/Form/NumberInput";
import PasswordInput from "src/components/layouts/PasswordInput";
// Redux
import { useAppDispatch } from "src/store/hooks";
// RPC
import { addAlert } from "src/store/Global/alerts-slice";
import { TrustAddPayload, useAddTrustMutation } from "src/services/rpcTrusts";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Icons
import { InfoCircleIcon } from "@patternfly/react-icons";
// Data types
import { RangeType } from "src/utils/datatypes/globalDataTypes";

interface PropsToAddTrustModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

// Tooltip messages
const twoWayCheckboxMessage =
  "Establish bi-directional trust. By default trust is inbound one-way only.";
const externalTrustCheckboxMessage =
  "Establish external trust to a domain in another forest. The trust is not transitive beyond the domain.";

const AddTrustModal = (props: PropsToAddTrustModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addTrust] = useAddTrustMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);
  const [domainName, setDomainName] = React.useState<string>("");
  const [isTwoWayCheckboxChecked, setIsTwoWayCheckboxChecked] =
    React.useState<boolean>(false);
  const [isExternalTrustCheckboxChecked, setIsExternalTrustCheckboxChecked] =
    React.useState<boolean>(false);
  // Radio options
  const [authMethod, setAuthMethod] = React.useState<
    "admin" | "pre-shared-pwd"
  >("admin");
  // Fields from radio buttons
  const [adminAccount, setAdminAccount] = React.useState<string>("");
  const [adminAccounPwd, setAdminAccounPwd] = React.useState<string>("");
  const [preSharedPwd, setPreSharedPwd] = React.useState<string>("");
  const [preSharedPwdVerify, setPreSharedPwdVerify] =
    React.useState<string>("");
  // Range type radio buttons
  const [rangeType, setRangeType] = React.useState<RangeType>("detect");
  // Other fields
  const [baseId, setBaseId] = React.useState<number>(0);
  const [rangeSize, setRangeSize] = React.useState<number>(0);
  // Password hidden states
  const [adminAccounPwdHidden, setAdminAccounPwdHidden] =
    React.useState<boolean>(true);
  const [preSharedPwdHidden, setPreSharedPwdHidden] =
    React.useState<boolean>(true);
  const [preSharedPwdVerifyHidden, setPreSharedPwdVerifyHidden] =
    React.useState<boolean>(true);

  const validateFields = () => {
    if (authMethod === "pre-shared-pwd") {
      if (preSharedPwd === "" || preSharedPwdVerify === "") return false;
      if (preSharedPwd !== preSharedPwdVerify) return false;
    }
    if (authMethod === "admin") {
      if (adminAccount === "" || adminAccounPwd === "") return false;
    }
    return domainName !== "";
  };

  const clearFields = () => {
    setDomainName("");
    setIsTwoWayCheckboxChecked(false);
    setIsExternalTrustCheckboxChecked(false);
    setAuthMethod("admin");
    setAdminAccount("");
    setAdminAccounPwd("");
    setPreSharedPwd("");
    setPreSharedPwdVerify("");
    setRangeType("detect");
    setBaseId(0);
    setRangeSize(0);
  };

  // 'Add' button handler
  const onAddTrust = () => {
    setIsAddButtonSpinning(true);

    const payload: TrustAddPayload = {
      domainName: domainName,
    };

    if (isTwoWayCheckboxChecked) {
      payload.bidirectional = true;
    }
    if (isExternalTrustCheckboxChecked) {
      payload.external = true;
    }
    if (authMethod === "admin") {
      payload.realm_admin = adminAccount;
      payload.realm_passwd = adminAccounPwd;
    }
    if (authMethod === "pre-shared-pwd") {
      payload.trust_secret = preSharedPwd;
    }
    if (rangeType === "detect") {
      payload.range_type = "ipa-ad-trust";
    }
    if (baseId) {
      payload.base_id = baseId;
    }
    if (rangeSize) {
      payload.range_size = rangeSize;
    }

    const validation = validateFields();

    if (validation) {
      addTrust(payload)
        .then((response) => {
          if ("data" in response) {
            const data = response.data?.result;
            const error = response.data?.error as SerializedError;

            if (error) {
              dispatch(
                addAlert({
                  name: "add-trust-error",
                  title: error.message!,
                  variant: "danger",
                })
              );
            }

            if (data) {
              dispatch(
                addAlert({
                  name: "add-trust-success",
                  title: data.summary,
                  variant: "success",
                })
              );
              // Reset selected item
              clearFields();
              // Update data
              props.onRefresh();
              // Close modal
              props.onClose();
            }
          }
        })
        .finally(() => {
          setIsAddButtonSpinning(false);
        });
    }
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "domain-name",
      name: "Domain name",
      pfComponent: (
        <TextInput
          data-cy={"modal-textbox-domain-name"}
          id="realm_server"
          name="realm_server"
          value={domainName}
          aria-label="Domain name text input"
          onChange={(_event, value) => setDomainName(value)}
        />
      ),
    },
    {
      id: `two-way-checkbox-${isTwoWayCheckboxChecked}`,
      pfComponent: (
        <Flex>
          <Checkbox
            data-cy={"modal-checkbox-two-way-trust"}
            id="bidirectional"
            name="bidirectional"
            label="Two-way trust"
            isChecked={isTwoWayCheckboxChecked}
            aria-label="Two-way trust checkbox"
            onChange={(_event, checked: boolean) =>
              setIsTwoWayCheckboxChecked(checked)
            }
          />
          <CustomTooltip
            id="two-way-trust-tooltip"
            message={twoWayCheckboxMessage}
            ariaLabel="Two-way trust tooltip with message"
          >
            <InfoCircleIcon />
          </CustomTooltip>
        </Flex>
      ),
    },
    {
      id: `external-trust-checkbox-${isExternalTrustCheckboxChecked}`,
      pfComponent: (
        <Flex>
          <Checkbox
            data-cy={"modal-checkbox-external-trust"}
            id="external-trust-checkbox"
            name="external"
            label="External trust"
            isChecked={isExternalTrustCheckboxChecked}
            aria-label="External trust checkbox"
            onChange={(_event, checked: boolean) =>
              setIsExternalTrustCheckboxChecked(checked)
            }
          />
          <CustomTooltip
            id="external-trust-tooltip"
            message={externalTrustCheckboxMessage}
            ariaLabel="External trust tooltip with message"
          >
            <InfoCircleIcon />
          </CustomTooltip>
        </Flex>
      ),
    },
    {
      id: "admin-account-radio",
      pfComponent: (
        <>
          <Radio
            data-cy={"modal-radio-admin-account"}
            id="admin-account-radio"
            name="auth-method-group"
            checked={authMethod === "admin"}
            onChange={(_event, checked: boolean) => {
              if (checked) setAuthMethod("admin");
            }}
            label="Administrative account"
            aria-label="Administrative account radio button"
          />
          <div className="pf-v6-u-ml-lg" id="admin-account-radio">
            <FormGroup
              label="Account"
              fieldId="admin-account-field"
              name="admin-account-formgroup"
              isRequired={authMethod === "admin"}
            >
              <InputRequiredText
                dataCy={"modal-textbox-admin-account"}
                id="admin-account-field"
                name="realm_admin"
                value={adminAccount}
                onChange={(value: string) => setAdminAccount(value)}
                aria-label="Account text input"
                isDisabled={authMethod !== "admin"}
              />
            </FormGroup>
            <FormGroup
              label="Password"
              fieldId="admin-account-pwd-field"
              name="admin-account-pwd-formgroup"
              isRequired={authMethod === "admin"}
            >
              <PasswordInput
                dataCy={"modal-textbox-admin-account-pwd"}
                id="admin-account-pwd-field"
                name="realm_passwd"
                value={adminAccounPwd}
                onChange={(value: string) => setAdminAccounPwd(value)}
                aria-label="Administrative account password text input"
                isDisabled={authMethod !== "admin"}
                onRevealHandler={() =>
                  setAdminAccounPwdHidden(!adminAccounPwdHidden)
                }
                passwordHidden={adminAccounPwdHidden}
              />
            </FormGroup>
          </div>
        </>
      ),
    },
    {
      id: "pre-shared-pwd-radio",
      pfComponent: (
        <>
          <Radio
            data-cy={"modal-radio-pre-shared-pwd"}
            id="pre-shared-pwd-radio"
            name="auth-method-group"
            checked={authMethod === "pre-shared-pwd"}
            onChange={(_event, checked: boolean) => {
              if (checked) setAuthMethod("pre-shared-pwd");
            }}
            label="Pre-shared password"
            aria-label="Pre-shared password radio button"
          />
          <div className="pf-v6-u-ml-lg" id="pre-shared-pwd-radio">
            <FormGroup
              label="Password"
              fieldId="pre-shared-pwd-field"
              name="pre-shared-pwd-formgroup"
              isRequired={authMethod === "pre-shared-pwd"}
            >
              <PasswordInput
                dataCy={"modal-textbox-pre-shared-pwd"}
                id="pre-shared-pwd-field"
                name="realm_pre_shared_pwd"
                value={preSharedPwd}
                onChange={(value: string) => setPreSharedPwd(value)}
                aria-label="Pre-shared password text input"
                isDisabled={authMethod !== "pre-shared-pwd"}
                onRevealHandler={() =>
                  setPreSharedPwdHidden(!preSharedPwdHidden)
                }
                passwordHidden={preSharedPwdHidden}
              />
            </FormGroup>
            <FormGroup
              label="Password verify"
              fieldId="pre-shared-pwd-verify-field"
              name="pre-shared-pwd-verify-formgroup"
              isRequired={authMethod === "pre-shared-pwd"}
            >
              <>
                <PasswordInput
                  dataCy={"modal-textbox-pre-shared-pwd-verify"}
                  id="pre-shared-pwd-verify-field"
                  name="realm_pre_shared_pwd_verify"
                  value={preSharedPwdVerify}
                  onChange={(value: string) => setPreSharedPwdVerify(value)}
                  aria-label="Pre-shared password verify text input"
                  isDisabled={authMethod !== "pre-shared-pwd"}
                  onRevealHandler={() =>
                    setPreSharedPwdVerifyHidden(!preSharedPwdVerifyHidden)
                  }
                  passwordHidden={preSharedPwdVerifyHidden}
                  rules={[
                    {
                      id: "verify-match",
                      message: "Passwords must match",
                      validate: (v: string) => v === preSharedPwd,
                    },
                  ]}
                />
              </>
            </FormGroup>
          </div>
        </>
      ),
    },
    {
      id: "detect-radio",
      name: "Detect",
      pfComponent: (
        <>
          <Radio
            data-cy={"modal-radio-detect"}
            id="detect-radio"
            name="range-type-group"
            checked={rangeType === "detect"}
            onChange={(_event, checked: boolean) => {
              if (checked) setRangeType("detect");
            }}
            label="Detect"
            aria-label="Detect radio button"
          />
          <Radio
            data-cy={"modal-radio-ad-domain"}
            id="ad-domain-radio"
            name="range-type-group"
            checked={rangeType === "ad-domain"}
            onChange={(_event, checked: boolean) => {
              if (checked) setRangeType("ad-domain");
            }}
            label="AD domain"
            aria-label="AD domain radio button"
          />
          <Radio
            data-cy={"modal-radio-ad-domain-posix"}
            id="ad-domain-posix-radio"
            name="range-type-group"
            checked={rangeType === "ad-domain-posix"}
            onChange={(_event, checked: boolean) => {
              if (checked) setRangeType("ad-domain-posix");
            }}
            label="AD domain POSIX"
            aria-label="AD domain POSIX radio button"
          />
        </>
      ),
    },
    {
      id: "base-id-field",
      name: "Base ID",
      pfComponent: (
        <NumberSelector
          dataCy={"modal-number-selector-base-id"}
          id="base-id-field"
          name="base_id"
          value={baseId}
          setValue={(value: number | "") => setBaseId(Number(value))}
          aria-label="Base ID number input"
          numCharsShown={6}
          maxValue={2147483647}
        />
      ),
    },
    {
      id: "range-size-field",
      name: "Range size",
      pfComponent: (
        <NumberSelector
          dataCy={"modal-number-selector-range-size"}
          id="range-size-field"
          name="range_size"
          value={rangeSize}
          setValue={(value: number | "") => setRangeSize(Number(value))}
          aria-label="Range size number input"
          numCharsShown={6}
          maxValue={2147483647}
        />
      ),
    },
  ];

  // Buttons are disabled until the user fills the required fields
  const isAdminAccountDisabled =
    authMethod === "admin" &&
    (adminAccount.length === 0 || adminAccounPwd.length === 0);

  const isPreSharedPwdDisabled =
    (authMethod === "pre-shared-pwd" &&
      preSharedPwd.length === 0 &&
      preSharedPwdVerify.length === 0) ||
    preSharedPwd !== preSharedPwdVerify;

  const isButtonDisabled =
    isAddButtonSpinning ||
    domainName.length === 0 ||
    isAdminAccountDisabled ||
    isPreSharedPwdDisabled;

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy={"modal-button-add"}
      key="add-new"
      isDisabled={isButtonDisabled}
      isLoading={isAddButtonSpinning}
      type="submit"
      onClick={onAddTrust}
    >
      Add
    </Button>,
    <Button
      data-cy={"modal-button-cancel"}
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy={"add-trust-modal"}
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-trust-modal"
        fields={fields}
        show={props.isOpen}
        onSubmit={onAddTrust}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddTrustModal;
