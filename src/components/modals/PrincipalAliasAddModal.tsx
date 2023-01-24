/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";

interface PropsToPrincipalAliasModal {
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  data: any; // Data agnostic on passed props
}

const PrincipalAliasAddModal = (props: PropsToPrincipalAliasModal) => {
  // Fields
  const fieldsToModal = [
    {
      id: "new-kerberos-alias",
      name: "New kerberos principal alias",
      pfComponent: (
        <TextInput
          id="new-kerberos-alias"
          name="krbprincalname"
          value={props.data.newKrbAlias}
          onChange={props.data.onChangeNewKrbAlias}
          type="text"
          aria-label="new kerberos alias"
        />
      ),
    },
  ];

  return (
    <ModalWithFormLayout
      variantType="small"
      modalPosition="top"
      title="Add Kerberos Principal Alias"
      formId="principal-alias"
      fields={fieldsToModal}
      show={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    />
  );
};

export default PrincipalAliasAddModal;
