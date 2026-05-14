# Sub-Pages — Modals for Table Tabs

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Table Tab](05-table-tab.md) | [Main Pages Delete Modal](../main-pages/08-delete-modal-and-utils.md)

## Overview

Table tabs require Add and Delete modals for CRUD operations. Files to create:
- `src/components/modals/<Entity>/Add<ChildEntity>Modal.tsx`
- `src/components/modals/<Entity>/Delete<ChildEntity>Modal.tsx`

## Add Modal

### Props Interface

```tsx
interface Add<ChildEntity>ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  <parentId>: string;  // e.g., dnsZoneId, idViewId
}
```

### Template

```tsx
import React from "react";
import { Button, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, TextInput } from "@patternfly/react-core";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import { useAdd<ChildEntity>Mutation } from "src/services/rpc<Entity>";

const Add<ChildEntity>Modal = (props: Add<ChildEntity>ModalProps) => {
  const dispatch = useAppDispatch();
  const [add<ChildEntity>] = useAdd<ChildEntity>Mutation();
  const [field1, setField1] = React.useState("");
  const [spinning, setSpinning] = React.useState(false);

  const resetFields = () => setField1("");

  const onClose = () => { resetFields(); props.onClose(); };

  const onAdd = () => {
    setSpinning(true);
    add<ChildEntity>({ <parentId>: props.<parentId>, field1 }).then((response) => {
      if ("data" in response) {
        if (response.data?.error) {
          dispatch(addAlert({ name: "add-error", title: response.data.error.message, variant: "danger" }));
        } else {
          dispatch(addAlert({ name: "add-success", title: "<ChildEntity> added", variant: "success" }));
          props.onRefresh();
          onClose();
        }
      }
      setSpinning(false);
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={onClose} variant="small">
      <ModalHeader title="Add <child entity>" />
      <ModalBody>
        <Form id="add-<child-entity>-form">
          <FormGroup label="Field 1" fieldId="field1" isRequired>
            <TextInput id="field1" value={field1} onChange={(_e, val) => setField1(val)} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onAdd} isDisabled={!field1 || spinning}>
          {spinning ? <Spinner size="sm" /> : "Add"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Add<ChildEntity>Modal;
```

## Delete Modal

### Props Interface

The Delete modal also receives the parent entity ID:

```tsx
interface Delete<ChildEntity>ModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementsToDelete: <ChildEntity>[];
  clearSelectedElements: () => void;
  columnNames: string[];
  keyNames: string[];
  onRefresh: () => void;
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  <parentId>: string;
}
```

### Template

```tsx
import React from "react";
import { Button, Content, ContentVariants, Spinner } from "@patternfly/react-core";
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
import { useDelete<ChildEntity>Mutation } from "src/services/rpc<Entity>";
import { BatchRPCResponse } from "src/services/rpc";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";

const Delete<ChildEntity>Modal = (props: Delete<ChildEntity>ModalProps) => {
  const dispatch = useAppDispatch();
  const [delete<ChildEntities>] = useDelete<ChildEntity>Mutation();
  const [spinning, setSpinning] = React.useState(false);

  const onDelete = () => {
    setSpinning(true);
    const idsToDelete = props.elementsToDelete.map((el) => el.<pk>);
    
    delete<ChildEntities>({ <parentId>: props.<parentId>, ids: idsToDelete }).then((response) => {
      if ("data" in response) {
        const data = response.data as BatchRPCResponse;
        if (data.result) {
          props.clearSelectedElements();
          props.updateIsDeleteButtonDisabled(true);
          dispatch(addAlert({ name: "delete-success", title: "Items deleted", variant: "success" }));
          props.onRefresh();
          props.onClose();
        }
      } else if ("error" in response) {
        dispatch(addAlert({ name: "delete-error", title: "Delete failed", variant: "danger" }));
      }
      setSpinning(false);
    });
  };

  const modalActions = [
    <Button key="cancel" variant="link" onClick={props.onClose}>Cancel</Button>,
    <Button key="delete" variant="danger" onClick={onDelete} isDisabled={spinning}>
      {spinning ? <Spinner size="sm" /> : "Delete"}
    </Button>,
  ];

  return (
    <ModalWithFormLayout
      variantType="medium"
      modalPosition="top"
      title="Delete <child entities>"
      formId="delete-<child-entity>-form"
      fields={<>
        <Content component={ContentVariants.p}>Are you sure you want to delete the selected items?</Content>
        <DeletedElementsTable elementsToDelete={props.elementsToDelete} columnNames={props.columnNames} columnIds={props.keyNames} />
      </>}
      actions={modalActions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    />
  );
};

export default Delete<ChildEntity>Modal;
```

## Examples

| Modal Type | Example File |
|------------|--------------|
| Add (complex) | `src/components/modals/DnsZones/AddDnsRecordsModal.tsx` |
| Add (simple) | `src/components/modals/DnsZones/AddDnsZoneModal.tsx` |
| Delete | `src/components/modals/DnsZones/DeleteDnsRecords.tsx` |
