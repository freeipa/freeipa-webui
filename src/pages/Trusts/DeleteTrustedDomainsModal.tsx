import React from "react";
// PatternFly
import { Button, Content, ContentVariants } from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  DeleteTrustedDomainsPayload,
  useDeleteTrustedDomainsMutation,
} from "src/services/rpcTrusts";
// Data types
import { TrustDomain } from "src/utils/datatypes/globalDataTypes";
import { BatchResult } from "src/services/rpc";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
import ErrorModal from "src/components/modals/ErrorModal";

interface DeleteTrustedDomainsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: TrustDomain[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
  trustId: string;
}

const DeleteTrustedDomainsModal = (props: DeleteTrustedDomainsModalProps) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [deleteTrustedDomains] = useDeleteTrustedDomainsMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const errorModalActions = [
    <Button
      data-cy="modal-button-ok"
      key="cancel"
      variant="link"
      onClick={closeAndCleanErrorParameters}
    >
      OK
    </Button>,
  ];

  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.cn.toString()
    );

    const payload: DeleteTrustedDomainsPayload = {
      trustId: props.trustId,
      domainNames: elementsToDelete,
    };

    deleteTrustedDomains(payload)
      .then((response) => {
        if ("data" in response && response.data !== undefined) {
          const results: BatchResult[] = response.data.result.results;

          results.forEach((result) => {
            if ("error" in result && result.error) {
              dispatch(
                addAlert({
                  name: "remove-trusted-domains-error",
                  title: result.error.toString(),
                  variant: "danger",
                })
              );
            } else {
              dispatch(
                addAlert({
                  name: "remove-trusted-domains-success",
                  title: "Domains deleted",
                  variant: "success",
                })
              );
              // Refresh data
              props.onRefresh();
            }
          });
        }
      })
      .finally(() => {
        setBtnSpinning(false);
        props.clearSelectedElements();
        props.updateIsDeleteButtonDisabled(true);
        props.updateIsDeletion(true);
        props.onClose();
      });
  };

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to delete the selected entries?
        </Content>
      ),
    },
    {
      id: "deleted-trusted-domains-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="trusted domain" // the final 's' is handled by the component
          idAttr={"cn"}
        />
      ),
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-trusted-domains"
      variant="danger"
      onClick={onDelete}
      form="delete-trusted-domains-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Deleting" : "Delete"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-trusted-domains"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="delete-trusted-domains-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove trusted domains"
        formId="delete-trusted-domains-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActions}
      />
      {isModalErrorOpen && (
        <ErrorModal
          dataCy="delete-trusted-domains-modal-error"
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={closeAndCleanErrorParameters}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default DeleteTrustedDomainsModal;
