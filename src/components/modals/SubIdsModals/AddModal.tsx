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
// Hooks
import useAlerts from "src/hooks/useAlerts";
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
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API call
  const [generateSubid] = useAssignSubIdsMutation();

  // States
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [subIdsAdded, setSubIdsAdded] = React.useState<string[]>([]);
  const [availableItems, setAvailableItems] = React.useState<string[]>([]);
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [isAddAnotherButtonSpinning, setIsAddAnotherButtonSpinning] =
    React.useState(false);

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
      alerts.addAlert("subid-find-error", error, "danger");
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
  const onAdd = (keepModalOpen: boolean) => {
    setIsAddButtonSpinning(true);
    setIsAddAnotherButtonSpinning(true);

    generateSubid(selectedItem).then((result) => {
      if ("data" in result) {
        const data = result.data.result;
        const error = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (error) {
          alerts.addAlert("add-subid-error", error, "danger");
        }

        if (data) {
          alerts.addAlert(
            "add-subid-success",
            "Subordinate ID successfully added",
            "success"
          );
          // Reset selected item
          setSelectedItem("");
          // Update data
          if (props.onRefresh) {
            props.onRefresh();
          }
          subIdsDataResponse.refetch();
          // 'Add and add another' will keep the modal open
          if (!keepModalOpen) {
            props.onCloseModal();
          }
          // Reset button spinners
          setIsAddButtonSpinning(false);
          setIsAddAnotherButtonSpinning(false);
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
          id="owner"
          options={availableItems.map((name) => ({
            label: name,
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
      key="add-new"
      variant="secondary"
      isDisabled={isAddButtonSpinning || selectedItem === ""}
      form="add-modal-form"
      onClick={() => {
        onAdd(false);
      }}
    >
      Add
    </Button>,
    <Button
      key="add-new-again"
      variant="secondary"
      isDisabled={isAddAnotherButtonSpinning || selectedItem === ""}
      form="add-again-modal-form"
      onClick={() => {
        onAdd(true);
      }}
    >
      Add and add again
    </Button>,
    <Button key="cancel-new" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
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
