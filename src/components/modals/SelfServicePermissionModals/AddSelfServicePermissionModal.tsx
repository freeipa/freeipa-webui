import React from "react";
import { Button } from "@patternfly/react-core";
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputWithValidation from "src/components/layouts/InputWithValidation";
import type { RuleProps } from "src/components/layouts/InputWithValidation";
import { TypeAheadWithCheckbox } from "src/components/TypeAheadWithCheckbox";
import { useAddSelfServicePermissionMutation } from "src/services/rpcSelfServicePermissions";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import { SerializedError } from "@reduxjs/toolkit";

const SELF_SERVICE_ATTRS = [
  "audio",
  "businesscategory",
  "carlicense",
  "cn",
  "departmentnumber",
  "description",
  "destinationindicator",
  "displayname",
  "employeenumber",
  "employeetype",
  "facsimiletelephonenumber",
  "gecos",
  "gidnumber",
  "givenname",
  "homedirectory",
  "homephone",
  "homepostaladdress",
  "inetuserhttpurl",
  "inetuserstatus",
  "initials",
  "internationalisdnnumber",
  "ipacertmapdata",
  "ipaidpconfiglink",
  "ipaidpsub",
  "ipakrbauthzdata",
  "ipanthash",
  "ipanthomedirectory",
  "ipanthomedirectorydrive",
  "ipantlogonscript",
  "ipantprofilepath",
  "ipantsecurityidentifier",
  "ipapasskey",
  "ipasshpubkey",
  "ipatokenradiusconfiglink",
  "ipatokenradiususername",
  "ipauniqueid",
  "ipauserauthtype",
  "jpegphoto",
  "krballowedtodelegateto",
  "krbauthindmaxrenewableage",
  "krbauthindmaxticketlife",
  "krbcanonicalname",
  "krbextradata",
  "krblastadminunlock",
  "krblastfailedauth",
  "krblastpwdchange",
  "krblastsuccessfulauth",
  "krbloginfailedcount",
  "krbmaxrenewableage",
  "krbmaxticketlife",
  "krbpasswordexpiration",
  "krbprincipalaliases",
  "krbprincipalauthind",
  "krbprincipalexpiration",
  "krbprincipalkey",
  "krbprincipalname",
  "krbprincipaltype",
  "krbpwdhistory",
  "krbpwdpolicyreference",
  "krbticketflags",
  "krbticketpolicyreference",
  "krbupenabled",
  "l",
  "labeleduri",
  "loginshell",
  "mail",
  "manager",
  "memberof",
  "mepmanagedentry",
  "mobile",
  "o",
  "objectclass",
  "ou",
  "pager",
  "photo",
  "physicaldeliveryofficename",
  "postaladdress",
  "postalcode",
  "postofficebox",
  "preferreddeliverymethod",
  "preferredlanguage",
  "registeredaddress",
  "roomnumber",
  "secretary",
  "seealso",
  "sn",
  "st",
  "street",
  "telephonenumber",
  "teletexterminalidentifier",
  "telexnumber",
  "title",
  "uid",
  "uidnumber",
  "usercertificate",
  "userclass",
  "userpassword",
  "userpkcs12",
  "usersmimecertificate",
  "x121address",
  "x500uniqueidentifier",
];

const ATTR_OPTIONS = SELF_SERVICE_ATTRS.map((attr) => ({
  value: attr,
  children: attr,
  "data-cy": `modal-select-attrs-${attr}`,
}));

interface PropsToAddModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onRefresh: () => void;
}

const AddSelfServicePermissionModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();
  const [addSelfServicePermission] = useAddSelfServicePermissionMutation();

  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [selfServiceName, setSelfServiceName] = React.useState("");
  const [selectedAttrs, setSelectedAttrs] = React.useState<string[]>([]);

  const ACI_NAME_PATTERN = /^[-_ a-zA-Z0-9]+$/;

  const aciNameRules: RuleProps[] = [
    {
      id: "no-leading-trailing-spaces",
      message: "Must not have leading or trailing spaces",
      validate: (value: string) => value === value.trim(),
    },
    {
      id: "valid-characters",
      message:
        "Only letters, digits, hyphens, underscores, and spaces are allowed",
      validate: (value: string) => ACI_NAME_PATTERN.test(value),
    },
  ];

  const isAciNameValid = (name: string): boolean => {
    if (name === "") return false;
    return aciNameRules.every((rule) => rule.validate(name));
  };

  const clearFields = () => {
    setSelfServiceName("");
    setSelectedAttrs([]);
  };

  const onAdd = () => {
    setIsAddButtonSpinning(true);

    addSelfServicePermission({
      aciname: selfServiceName,
      attrs: selectedAttrs,
    })
      .then((response) => {
        if ("error" in response && response.error) {
          const error = response.error as SerializedError;

          dispatch(
            addAlert({
              name: "add-self-service-permission-error",
              title: error.message,
              variant: "danger",
            })
          );

          return;
        }

        if ("data" in response) {
          const data = response.data?.result;
          const error = response.data?.error as SerializedError;

          if (error) {
            dispatch(
              addAlert({
                name: "add-self-service-permission-error",
                title: error.message,
                variant: "danger",
              })
            );

            return;
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-self-service-permission-success",
                title: "New self-service permission added",
                variant: "success",
              })
            );
            clearFields();
            props.onRefresh();
            props.onClose();
          }
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  const cleanAndCloseModal = () => {
    clearFields();
    props.onClose();
  };

  const fields: Field[] = [
    {
      id: "modal-form-self-service-name",
      name: "Self-service name",
      pfComponent: (
        <InputWithValidation
          dataCy="modal-textbox-self-service-name"
          id="modal-form-self-service-name"
          name="aciname"
          value={selfServiceName}
          onChange={setSelfServiceName}
          isRequired={true}
          rules={aciNameRules}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-attrs",
      name: "Attributes",
      pfComponent: (
        <TypeAheadWithCheckbox
          id="modal-form-attrs"
          dataCy="modal-select-attrs"
          options={ATTR_OPTIONS}
          selected={selectedAttrs}
          setSelected={setSelectedAttrs}
        />
      ),
      fieldRequired: true,
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={
        isAddButtonSpinning ||
        !isAciNameValid(selfServiceName) ||
        selectedAttrs.length === 0
      }
      form="add-modal-form"
      type="submit"
    >
      Add
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new"
      variant="link"
      onClick={cleanAndCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      dataCy="add-self-service-permission-modal"
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title={props.title}
      formId="add-modal-form"
      fields={fields}
      show={props.isOpen}
      onSubmit={() => onAdd()}
      onClose={cleanAndCloseModal}
      actions={modalActions}
    />
  );
};

export default AddSelfServicePermissionModal;
