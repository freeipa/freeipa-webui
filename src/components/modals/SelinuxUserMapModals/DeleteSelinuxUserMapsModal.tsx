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
import { useDeleteSelinuxUserMapsMutation } from "src/services/rpcSelinuxUserMaps";
// Data types
import { ErrorData, SELinuxUserMap } from "src/utils/datatypes/globalDataTypes";
import { BatchRPCResponse } from "src/services/rpc";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// Components
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

interface DeleteSelinuxUserMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: SELinuxUserMap[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  updateIsDeletion: (value: boolean) => void;
}

const DeleteSelinuxUserMapsModal = (props: DeleteSelinuxUserMapsModalProps) => {
  const dispatch = useAppDispatch();

  const [deleteSelinuxUserMaps] = useDeleteSelinuxUserMapsMutation();

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);
  const { handleAPIError, ErrorModalComponent } = useApiError();

  const onDelete = () => {
    setBtnSpinning(true);

    const elementsToDelete = props.elementsToDelete.map((element) =>
      element.cn.toString()
    );

    deleteSelinuxUserMaps(elementsToDelete)
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
                  name: "remove-selinux-user-maps-success",
                  title: "SELinux user maps removed",
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
          Are you sure you want to delete the selected entries?
        </Content>
      ),
    },
    {
      id: "deleted-elements-table",
      pfComponent: (
        <DeletedElementsTable
          mode="passing_full_data"
          elementsToDelete={props.elementsToDelete}
          columnNames={props.columnNames}
          columnIds={props.keyNames}
          elementType="SELinux user map"
          idAttr="cn"
        />
      ),
    },
  ];

  const modalActionsDelete: JSX.Element[] = [
    <Button
      data-cy="modal-button-ok"
      key="delete-selinux-user-maps"
      variant="danger"
      onClick={onDelete}
      form="delete-selinux-user-maps-modal"
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
      key="cancel-delete-selinux-user-maps"
      variant="link"
      onClick={props.onClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <ModalWithFormLayout
        dataCy="selinux-user-maps-delete-modal"
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Remove SELinux user maps"
        formId="remove-selinux-user-maps-modal"
        fields={fields}
        show={props.isOpen}
        onClose={props.onClose}
        actions={modalActionsDelete}
      />
      {ErrorModalComponent}
    </>
  );
};

export default DeleteSelinuxUserMapsModal;
