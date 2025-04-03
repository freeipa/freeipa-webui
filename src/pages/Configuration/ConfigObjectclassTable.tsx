import React from "react";
import {
  Button,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Modal,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { Table, TableText, Tr, Tbody, Td } from "@patternfly/react-table";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
  updateIpaObject,
} from "../../utils/ipaObjectUtils";

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
        id={props.name + "-" + "addoc"}
        onClick={() => {
          setNewOC("");
          setIsOpen(true);
        }}
        className="pf-v5-u-mt-md"
        size="sm"
      >
        Add objectclass
      </Button>
      <Modal
        variant="small"
        title={"Add objectclass"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        actions={[
          <Button
            key="add-new-oc"
            isDisabled={
              newOC === "" || values.indexOf(newOC.toLowerCase()) !== -1
            }
            onClick={addOC}
          >
            Add
          </Button>,
          <Button
            key="cancel-new-host"
            variant="link"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form id={"add-oc-modal"}>
          <FormGroup
            key={"oc"}
            label={"New objectclass"}
            fieldId={"oc"}
            isRequired
          >
            <TextInput
              id="oc"
              type="text"
              value={newOC}
              validated={
                newOC === "" || values.indexOf(newOC.toLowerCase()) !== -1
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              onChange={(_event, value: string) => setNewOC(value)}
            />
            {values.indexOf(newOC.toLowerCase()) !== -1 && (
              <HelperText>
                <HelperTextItem variant="error">
                  This objectclass is already defined
                </HelperTextItem>
              </HelperText>
            )}
          </FormGroup>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default ConfigObjectclassTable;
