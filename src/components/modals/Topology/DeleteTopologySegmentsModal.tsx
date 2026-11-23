import React from "react";
// PatternFly
import {
  Button,
  Content,
  ContentVariants,
  Spinner,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Modals
import ErrorModal from "src/components/modals/ErrorModal";
// RPC
import { useDeleteTopologySegmentsMutation } from "src/services/rpcTopology";
import { BatchRPCResponse } from "src/services/rpc";
// Data types
import {
  ErrorData,
  TopologySegment,
} from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface DeleteTopologySegmentsModalProps {
  suffix: string;
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: TopologySegment[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteTopologySegmentsModal = (
  props: DeleteTopologySegmentsModalProps
) => {
  const dispatch = useAppDispatch();

  // RPC calls
  const [deleteTopologySegments] = useDeleteTopologySegmentsMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  // Handle API error data
  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("code" in error) {
      setErrorTitle("IPA error " + error.code + ": " + error.name);
      if (error.message !== undefined) {
        setErrorMessage(error.message);
      }
    } else if ("data" in error) {
      const errorData = error.data as ErrorData;
      setErrorTitle(
        "IPA error " + (errorData.code as string) + ": " + errorData.name
      );
      setErrorMessage(errorData.error as string);
    }
    setIsModalErrorOpen(true);
  };

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  // Delete handler
  const onDelete = () => {
    setBtnSpinning(true);

    deleteTopologySegments({
      suffix: props.suffix,
      cn: props.elementsToDelete.map((segment) => segment.cn),
    })
      .then((response) => {
        if ("data" in response) {
          const data = response.data as BatchRPCResponse;
          const result = data.result;

          if (result) {
            if ("error" in result.results[0] && result.results[0].error) {
              const errorData = {
                code: result.results[0].error_code,
                name: result.results[0].error_name,
                error: result.results[0].error,
              } as ErrorData;

              handleAPIError({
                status: "CUSTOM_ERROR",
                data: errorData,
              } as FetchBaseQueryError);
            } else {
              props.clearSelectedElements();
              props.updateIsDeleteButtonDisabled(true);
              props.updateIsDeletion(true);

              dispatch(
                addAlert({
                  name: "remove-topology-segments-success",
                  title: "Topology segments removed",
                  variant: "success",
                })
              );

              props.onClose();
              props.onRefresh();
            }
          }
        }
      })
      .finally(() => {
        setBtnSpinning(false);
      });
  };

  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <Content component={ContentVariants.p}>
          Are you sure you want to remove the selected topology segments?
        </Content>
      ),
    },
    {
      id: "deleted-topology-segments-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="Topology segment"
          idAttr="cn"
        />
      ),
    },
  ];

  const errorModalActions = [
    <Button
      key="cancel"
      variant="link"
      onClick={closeAndCleanErrorParameters}
      data-cy="modal-button-error-modal-ok"
    >
      OK
    </Button>,
  ];

  const modalActions: JSX.Element[] = [
    <Button
      key="delete-topology-segments"
      variant="danger"
      type="submit"
      form="delete-topology-segments-modal"
      isDisabled={spinning}
      data-cy="modal-button-delete"
    >
      {spinning ? <Spinner size="sm" /> : "Delete"}
    </Button>,
    <Button
      key="cancel-delete-topology-segments"
      variant="link"
      onClick={props.onClose}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Delete topology segments"
        formId="delete-topology-segments-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        onSubmit={onDelete}
        actions={modalActions}
        dataCy="delete-topology-segments-modal"
      />
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={closeAndCleanErrorParameters}
          actions={errorModalActions}
          errorMessage={errorMessage}
          dataCy="modal-error-modal"
        />
      )}
    </>
  );
};

export default DeleteTopologySegmentsModal;
