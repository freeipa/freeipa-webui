import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import SimpleSelector from "src/components/layouts/SimpleSelector";
// Data types
import { cnType, PwPolicy } from "src/utils/datatypes/globalDataTypes";
// RPC
import {
  PwPolicyAddPayload,
  PwPolicyFindPayload,
  usePwPolicyAddMutation,
  usePwPolicyFindQuery,
} from "src/services/rpcPwdPolicies";
import { useGetGenericListQuery } from "src/services/rpc";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
import InputRequiredText from "src/components/layouts/InputRequiredText";

interface PropsToAddModal {
  isOpen: boolean;
  onCloseModal: () => void;
  title: string;
  onRefresh: () => void;
}

const AddModal = (props: PropsToAddModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addPwPolicy] = usePwPolicyAddMutation();

  // States
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [groupsAdded, setGroupsAdded] = React.useState<string[]>([]);
  const [availableItems, setAvailableItems] = React.useState<string[]>([]);
  const [priority, setPriority] = React.useState<string>("");
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);

  // API call - Get user group information
  const groupIdsResponse = useGetGenericListQuery("group");
  const { data: groupIdsData, isLoading, error } = groupIdsResponse;

  // Handle data when the API call is finished
  React.useEffect(() => {
    // On error
    if (!isLoading && error) {
      dispatch(
        addAlert({
          name: "group-find-error",
          title: JSON.stringify(error, null, 2),
          variant: "danger",
        })
      );
    }

    // On success
    if (!isLoading && groupIdsData) {
      const listResult = groupIdsData.result.result as unknown as cnType[];
      const totalCount = groupIdsData.result.count;

      const groupIds: string[] = [];
      for (let i = 0; i < totalCount; i++) {
        const groupId = listResult[i];
        if (groupId.cn) groupIds.push(groupId.cn[0]);
      }
      // "global_policy" won0t be present in the list, but needs to be added
      groupIds.push("global_policy");
      setGroupsAdded(groupIds);
    }
  }, [groupIdsData]);

  // API call - Current password policies
  const pwPoliciesResponse = usePwPolicyFindQuery({
    searchValue: "",
    pkeyOnly: false,
    sizeLimit: 100, // Established a maximum of 100 elements to retrieve
  } as PwPolicyFindPayload);

  // Filter data to show in the selector to avoid repeated items
  React.useEffect(() => {
    const policiesData = pwPoliciesResponse.data?.result
      .result as unknown as PwPolicy[];
    const policiesIds: string[] = [];
    if (policiesData !== undefined && !pwPoliciesResponse.isLoading) {
      policiesData.forEach((policy) => {
        policiesIds.push(policy.cn[0]);
      });

      // Filter the groups to return the ones that have not been added yet
      const filteredIds = groupsAdded.filter(
        (groupId) => !policiesIds.some((policyId) => policyId === groupId)
      );
      setAvailableItems(filteredIds);
    }
  }, [pwPoliciesResponse, groupsAdded]);

  // Refetch data when the modal is opened
  React.useEffect(() => {
    if (props.isOpen) {
      groupIdsResponse.refetch();
      pwPoliciesResponse.refetch();
    }
  }, [props.isOpen]);

  // on Add subordinate ID
  const onAdd = () => {
    setIsAddButtonSpinning(true);

    const payload: PwPolicyAddPayload = {
      groupId: selectedItem,
      priority: priority,
    };

    addPwPolicy(payload).then((result) => {
      if ("data" in result) {
        const data = result.data?.result;
        const error = result.data?.error as SerializedError;

        if (error) {
          dispatch(
            addAlert({
              name: "add-pwpolicy-error",
              title: error.message,
              variant: "danger",
            })
          );
        }

        if (data) {
          dispatch(
            addAlert({
              name: "add-pwpolicy-success",
              title: "Password policy successfully added",
              variant: "success",
            })
          );
          // Reset selected item
          setSelectedItem("");
          setPriority("");
          // Update data
          props.onRefresh();
          groupIdsResponse.refetch();
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
    setPriority("");
    props.onCloseModal();
  };

  // Fields
  const fields: Field[] = [
    {
      id: "group",
      name: "Group",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-simple-group"
          id="group"
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
    {
      id: "modal-form-priority",
      name: "Priority",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-priority"
          id="modal-form-priority"
          name="cospriority"
          value={priority}
          onChange={setPriority}
          requiredHelperText="Required value"
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
      variant="secondary"
      isDisabled={isAddButtonSpinning || selectedItem === ""}
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

  // Render component
  return (
    <>
      <ModalWithFormLayout
        dataCy="add-pwpolicy-modal"
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-modal-form"
        fields={fields}
        show={props.isOpen}
        onSubmit={() => onAdd()}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddModal;
