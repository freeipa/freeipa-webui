import React from "react";
// PatternFly
import { TextInput } from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "../layouts/ModalWithFormLayout";
import TextLayout from "../layouts/TextLayout";

interface PropsToPrincipalAliasModal {
  isOpen: boolean;
  onClose: () => void;
  actions: JSX.Element[];
  hostToRemove: string;
}

const PrincipalAliasDeleteModal = (props: PropsToPrincipalAliasModal) => {
  // Fields
  const fieldsToModal = [
    {
      id: "confirmation-question",
      pfComponent: (
        <TextLayout>
          Do you want to remove kerberos alias {props.hostToRemove}
        </TextLayout>
      ),
    },
  ];

  return (
    <ModalWithFormLayout
      variantType="small"
      modalPosition="top"
      title="Remove Kerberos Principal Alias"
      formId="principal-alias"
      fields={fieldsToModal}
      show={props.isOpen}
      onClose={props.onClose}
      actions={props.actions}
    />
  );
};

export default PrincipalAliasDeleteModal;
