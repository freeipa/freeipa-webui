import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
import { Table, TableText, Tr, Tbody, Td } from "@patternfly/react-table";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "../../utils/ipaObjectUtils";
import InputWithValidation from "src/components/layouts/InputWithValidation";

interface PropsToTable extends IPAParamDefinition {
  title: string;
}

const ConfigObjectclassTable = (props: PropsToTable) => {
  const { value } = getParamProperties(props);
  const values = value ? (value as string[]) : [];

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [newOC, setNewOC] = React.useState<string>("");

  const removeOC = (name: string) => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      const newOCList = values.filter((item) => item !== name);
      updateIpaObject(props.ipaObject, props.onChange, newOCList, props.name);
    }
  };

  const addOC = () => {
    if (props.ipaObject !== undefined && props.onChange !== undefined) {
      const newOCList = [...values, newOC];
      updateIpaObject(props.ipaObject, props.onChange, newOCList, props.name);
    }
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <Table aria-label="Objectclass table" variant="compact">
        <Tbody>
          {values.map((item) => {
            const removeButton = (
              <TableText>
                <Button
                  data-cy="configuration-table-button-remove"
                  id={props.name + "-" + item}
                  onClick={() => removeOC(item)}
                  variant="secondary"
                  size="sm"
                  isDisabled={values.length < 2}
                >
                  Remove
                </Button>
              </TableText>
            );

            return (
              <Tr key={item}>
                <Td>{item}</Td>
                <Td>{removeButton}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Button
        data-cy="configuration-table-button-add"
        id={props.name + "-" + "addoc"}
        onClick={() => {
          setNewOC("");
          setIsOpen(true);
        }}
        className="pf-v6-u-mt-md"
        size="sm"
      >
        Add objectclass
      </Button>
      <Modal
        data-cy="add-objectclass-modal"
        variant="small"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalHeader title={"Add objectclass"} labelId="add-oc-modal-title" />
        <ModalBody id="add-oc-modal-body">
          <Form id={"add-oc-modal"}>
            <FormGroup
              key={"oc"}
              label={"New objectclass"}
              fieldId={"oc"}
              isRequired
            >
              <InputWithValidation
                dataCy="modal-textbox-objectclass"
                id="oc"
                name="oc"
                value={newOC}
                onChange={setNewOC}
                isRequired
                rules={[
                  {
                    id: "unique",
                    message: "Must be unique",
                    validate: (value: string) =>
                      values.indexOf(value.toLowerCase()) === -1,
                  },
                ]}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            data-cy="modal-button-add"
            key="add-new-oc"
            isDisabled={
              newOC === "" || values.indexOf(newOC.toLowerCase()) !== -1
            }
            onClick={addOC}
          >
            Add
          </Button>
          ,
          <Button
            data-cy="modal-button-cancel"
            key="cancel-new-host"
            variant="link"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ConfigObjectclassTable;
