import React from "react";
// PatternFly
import { Button } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import InputRequiredText from "src/components/layouts/InputRequiredText";
import SimpleSelector from "src/components/layouts/SimpleSelector";
// RPC
import { useAddTopologySegmentMutation } from "src/services/rpcTopology";
import { useFindServerQuery } from "src/services/rpcServer";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// Errors
import { SerializedError } from "@reduxjs/toolkit";

interface PropsToAddSegmentModal {
  suffix: string;
  onClose: () => void;
  onRefresh: () => void;
}

const AddTopologySegmentModal = (props: PropsToAddSegmentModal) => {
  const dispatch = useAppDispatch();

  // API calls
  const [addTopologySegment] = useAddTopologySegmentMutation();
  const serversResponse = useFindServerQuery({ cn: "" });
  const servers = serversResponse.data ?? [];

  // States
  const [segmentName, setSegmentName] = React.useState("");
  const [leftNode, setLeftNode] = React.useState("");
  const [rightNode, setRightNode] = React.useState("");
  const [isAddButtonSpinning, setIsAddButtonSpinning] =
    React.useState<boolean>(false);

  const serverOptions = servers.map((server) => ({
    key: server.cn,
    value: server.cn,
  }));

  const mandatoryEmpty =
    segmentName === "" || leftNode === "" || rightNode === "";

  const onAddSegment = () => {
    setIsAddButtonSpinning(true);

    addTopologySegment({
      suffix: props.suffix,
      cn: segmentName,
      iparepltoposegmentleftnode: leftNode,
      iparepltoposegmentrightnode: rightNode,
    })
      .then((response) => {
        if ("error" in response && response.error) {
          const error = response.error as SerializedError;
          dispatch(
            addAlert({
              name: "add-topology-segment-error",
              title: error.message || "Failed to add topology segment",
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
                name: "add-topology-segment-error",
                title: error.message,
                variant: "danger",
              })
            );
          }

          if (data) {
            dispatch(
              addAlert({
                name: "add-topology-segment-success",
                title: "Topology segment added",
                variant: "success",
              })
            );
            props.onRefresh();
            props.onClose();
          }
        }
      })
      .finally(() => {
        setIsAddButtonSpinning(false);
      });
  };

  const onClose = () => {
    if (!isAddButtonSpinning) {
      props.onClose();
    }
  };

  const fields: Field[] = [
    {
      id: "modal-form-segment-name",
      name: "Segment name",
      pfComponent: (
        <InputRequiredText
          dataCy="modal-textbox-segment-name"
          id="modal-form-segment-name"
          name="Segment name"
          value={segmentName}
          onChange={setSegmentName}
          requiredHelperText="Required value"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-left-node",
      name: "Left node",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-select-left-node"
          id="modal-form-left-node"
          selected={leftNode}
          options={serverOptions}
          onSelectedChange={setLeftNode}
          ariaLabel="Left node"
          noOptionsMessage="No servers available"
        />
      ),
      fieldRequired: true,
    },
    {
      id: "modal-form-right-node",
      name: "Right node",
      pfComponent: (
        <SimpleSelector
          dataCy="modal-select-right-node"
          id="modal-form-right-node"
          selected={rightNode}
          options={serverOptions}
          onSelectedChange={setRightNode}
          ariaLabel="Right node"
          noOptionsMessage="No servers available"
        />
      ),
      fieldRequired: true,
    },
  ];

  const modalActions: JSX.Element[] = [
    <Button
      data-cy="modal-button-add"
      key="add-new"
      isDisabled={isAddButtonSpinning || mandatoryEmpty}
      form="add-topology-segment-modal"
      type="submit"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={isAddButtonSpinning}
    >
      {isAddButtonSpinning ? "Adding" : "Add"}
    </Button>,
    <Button
      key="cancel-new"
      variant="link"
      onClick={onClose}
      isDisabled={isAddButtonSpinning}
      data-cy="modal-button-cancel"
    >
      Cancel
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      variantType="small"
      modalPosition="top"
      offPosition="76px"
      title="Add topology segment"
      formId="add-topology-segment-modal"
      fields={fields}
      show={true}
      onClose={onClose}
      onSubmit={onAddSegment}
      actions={modalActions}
      dataCy="add-topology-segment-modal"
    />
  );
};

export default AddTopologySegmentModal;
