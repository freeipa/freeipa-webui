import React from "react";
// PatternFly
import {
  Button,
  Content,
  ContentVariants,
  Spinner,
} from "@patternfly/react-core";
import useApiError from "src/hooks/useApiErrorModals";
// Redux
import { useAppDispatch } from "src/store/hooks";
// RPC
import { addAlert } from "src/store/Global/alerts-slice";
import { useDeleteAutomountLocationsMutation } from "src/services/rpcAutomountLocations";
// Data types
import {
  AutomountLocation,
  ErrorData,
} from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface DeleteAutomountLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: AutomountLocation[];
  clearSelectedElements: () => void;
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteAutomountLocationsModal = (
  props: DeleteAutomountLocationsModalProps
) => {
  const dispatch = useAppDispatch();

  const [deleteLocations] = useDeleteAutomountLocationsMutation();

  // States
  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const { handleAPIError, ErrorModalComponent } = useApiError();

  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.cn.toString()
    );

    deleteLocations(elementsToDelete)
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

              const error = {
                status: "CUSTOM_ERROR",
                data: errorData,
              } as FetchBaseQueryError;

              handleAPIError(error);
            } else {
              props.clearSelectedElements();
              props.updateIsDeleteButtonDisabled(true);
              props.updateIsDeletion(true);

              dispatch(
                addAlert({
                  name: "remove-automount-locations-success",
                  title: "Automount locations removed",
                  variant: "success",
                })
              );

              props.onClose();
              props.onRefresh();
            }
          }
        }
        if ("error" in response) {
          const error = response.error as FetchBaseQueryError;
          handleAPIError(error);
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
          Are you sure you want to delete the selected automount locations?
        </Content>
      ),
    },
    {
      id: "deleted-automount-locations-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_id"
          elementsToDelete={props.elementsToDelete.map((element) =>
            element.cn.toString()
          )}
          columnNames={["Location name"]}
          columnIds={["cn"]}
          elementType="automount location"
          idAttr="cn"
        />
      ),
    },
  ];

  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-delete"
      key="delete-automount-locations"
      variant="danger"
      onClick={onDelete}
      form="delete-automount-locations-modal"
      spinnerAriaValueText="Deleting"
      spinnerAriaLabel="Deleting"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? (
        <>
          <Spinner size="sm" />
          {"Deleting"}
        </>
      ) : (
        "Delete"
      )}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-delete-automount-locations"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="automount-locations-delete-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove automount locations"
        formId="delete-automount-locations-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActionsDelete}
      />
      {ErrorModalComponent}
    </>
  );
};

export default DeleteAutomountLocationsModal;
