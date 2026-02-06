import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import SimpleSelector from "src/components/layouts/SimpleSelector";
// Data types
import { SubId } from "src/utils/datatypes/globalDataTypes";
// RPC
import { useUserFindQuery } from "src/services/rpcUsers";
import {
  SubidFindPayload,
  useSubidFindQuery,
  useAssignSubIdsMutation,
} from "src/services/rpcSubIds";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddModal {
  isOpen: boolean;
  onOpenModal?: () => void;
  onCloseModal: () => void;
  title: string;
  onRefresh?: () => void;
}

const AddModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API call
  const [generateSubid] = useAssignSubIdsMutation();

  // States
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [subIdsAdded, setSubIdsAdded] = React.useState<string[]>([]);
  const [availableItems, setAvailableItems] = React.useState<string[]>([]);
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);

  // Get all the Subordinate IDs to perform the filtering
  // API calls
  const subIdsDataResponse = useSubidFindQuery({
    searchValue: "",
    pkeyOnly: false,
    sizeLimit: 100, // Established a maximum of 100 elements to retrieve
  } as SubidFindPayload);

  const { data: subidFindData, isLoading, error } = subIdsDataResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    // On error
    if (!isLoading && error) {
      dispatch(
        addAlert({
          name: "subid-find-error",
          title: JSON.stringify(error, null, 2),
          variant: "danger",
        })
      );
    }

    // On success
    if (!isLoading && subidFindData) {
      const listResult = subidFindData.result.result as unknown as SubId[];
      const totalCount = subidFindData.result.count;

      const subids: string[] = [];
      for (let i = 0; i < totalCount; i++) {
        const subid = listResult[i];
        if (subid.ipauniqueid) subids.push(subid.ipaowner[0]);
      }
      setSubIdsAdded(subids);
    }
  }, [subidFindData]);

  // API call - Prepare available items to show in Add modal
  const usersResult = useUserFindQuery({
    uid: null,
    noMembers: true,
  });

  // Filter data to show in the selector
  React.useEffect(() => {
    const usersData = usersResult.data;
    const userIds: string[] = [];
    if (usersData !== undefined && !usersResult.isLoading) {
      usersData.forEach((user) => {
        userIds.push(user.uid);
      });

      // Filter the users to return the ones that have not been added yet
      const filteredIds = userIds.filter((user) => {
        return !subIdsAdded.some((subId) => subId === user);
      });
      setAvailableItems(filteredIds);
    }
  }, [usersResult, subIdsAdded]);

  // Refetch data when the modal is opened
  React.useEffect(() => {
    if (props.isOpen) {
      subIdsDataResponse.refetch();
      usersResult.refetch();
    }
  }, [props.isOpen]);

  // on Add subordinate ID
  const onAdd = () => {
    setIsAddButtonSpinning(true);

    generateSubid(selectedItem).then((result) => {
      if ("data" in result) {
        const data = result.data?.result;
        const error = result.data?.error as
          | FetchBaseQueryError
          | SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-subid-error",
              title: JSON.stringify(error, null, 2),
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-subid-success",
              title: "Subordinate ID successfully added",
              variant: "success",
            })
          );
          // Reset selected item
          setSelectedItem("");
          // Update data
          if (props.onRefresh) {
            props.onRefresh();
          }
          subIdsDataResponse.refetch();
          props.onCloseModal();
          // Reset button spinners
          setIsAddButtonSpinning(false);
        }
      }
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    setSelectedItem("");
    props.onCloseModal();
  };

  // Fields
  const fields: Field[] = [
    {
      id: "owner",
      name: "Owner",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-simple-owner"
          id="owner"
          options={availableItems.map((name) => ({
            key: name,
            value: name,
          }))}
          selected={selectedItem}
          onSelectedChange={(selected: string) => setSelectedItem(selected)}
        />
      ),
      fieldRequired: true,
    },
  ];

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddButtonSpinning || selectedItem === ""}
      form="add-modal-form"
      onClick={() => {
        onAdd();
      }}
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

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy="add-subid-modal"
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-modal-form"
        fields={fields}
        show={props.isOpen}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddModal;
