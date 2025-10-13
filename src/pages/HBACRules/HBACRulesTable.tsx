import React, { useEffect, useState } from "react";
// PatternFly
import { Td, Th, Tr } from "@patternfly/react-table";
// Tables
import TableLayout from "../../components/layouts/TableLayout";
// Data types
import { HBACRule } from "../../utils/datatypes/globalDataTypes";
// Utils
import { checkEqualStatusHbacRule } from "src/utils/utils";
// Layouts
import SkeletonOnTableLayout from "../../components/layouts/Skeleton/SkeletonOnTableLayout";
// React Router DOM
import { Link } from "react-router";

interface RulesData {
  isHbacRuleSelectable: (rule: HBACRule) => boolean;
  selectedRules: HBACRule[];
  selectableRulesTable: HBACRule[];
  setRulesSelected: (rule: HBACRule, isSelecting?: boolean) => void;
  clearSelectedRules: () => void;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
  isDeletion: boolean;
  updateIsDeletion: (value: boolean) => void;
  updateIsEnableButtonDisabled?: (value: boolean) => void;
  updateIsDisableButtonDisabled?: (value: boolean) => void;
  isDisableEnableOp?: boolean;
  updateIsDisableEnableOp?: (value: boolean) => void;
}

interface PaginationData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

interface PropsToTable {
  shownElementsList: HBACRule[];
  showTableRows: boolean;
  rulesData: RulesData;
  buttonsData: ButtonsData;
  paginationData: PaginationData;
  searchValue: string;
}

const HBACRulesTable = (props: PropsToTable) => {
  // Retrieve groups data from props
  const shownRulesList = [...props.shownElementsList];

  // Column names
  const columnNames = {
    cn: "Rule name",
    ipaenabledflag: "Status",
    description: "Description",
  };

  // When user status is updated, unselect selected rows
  useEffect(() => {
    if (props.buttonsData.isDisableEnableOp) {
      props.rulesData.clearSelectedRules();
    }
  }, [props.buttonsData.isDisableEnableOp]);

  const isRuleSelected = (rule: HBACRule) => {
    if (
      props.rulesData.selectedRules.find(
        (selectedRule) => selectedRule.cn[0] === rule.cn[0]
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  // To allow shift+click to select/deselect multiple rows
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = useState<
    number | null
  >(null);
  const [shifting, setShifting] = useState(false);

  // On selecting one single row
  const onSelectRule = (
    rule: HBACRule,
    rowIndex: number,
    isSelecting: boolean
  ) => {
    // If the host is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(
              new Array(numberSelected + 1),
              (_x, i) => i + recentSelectedRowIndex
            )
          : Array.from(
              new Array(Math.abs(numberSelected) + 1),
              (_x, i) => i + rowIndex
            );
      intermediateIndexes.forEach((index) =>
        props.rulesData.setRulesSelected(shownRulesList[index], isSelecting)
      );
    } else {
      props.rulesData.setRulesSelected(rule, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);

    // Resetting 'isDisableEnableOp'
    props.buttonsData.updateIsDeleteButtonDisabled(false);

    // Update hostIdsSelected array
    if (isSelecting) {
      // Increment the elements selected per page (++)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage + 1
      );
    } else {
      // Decrement the elements selected per page (--)
      props.paginationData.updateSelectedPerPage(
        props.paginationData.selectedPerPage - 1
      );
    }
  };

  // Reset 'selectedRoles array if a delete operation has been done
  useEffect(() => {
    if (props.buttonsData.isDeletion) {
      props.rulesData.clearSelectedRules();
      props.buttonsData.updateIsDeletion(false);
    }
  }, [props.buttonsData.isDeletion]);

  // Enable 'Delete' button (if any host selected)
  useEffect(() => {
    if (props.rulesData.selectedRules.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
    }

    if (props.rulesData.selectedRules.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
    }
  }, [props.rulesData.selectedRules]);

  // Enable 'Delete' and 'Enable|Disable' option buttons (if any rule selected)
  useEffect(() => {
    if (props.rulesData.selectedRules.length > 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(false);
      const selectedRules: HBACRule[] = props.rulesData.selectedRules;
      if (
        props.buttonsData.updateIsDisableButtonDisabled !== undefined &&
        props.buttonsData.updateIsEnableButtonDisabled !== undefined
      ) {
        // Check if selected users have the same status
        if (selectedRules.length > 0) {
          const equalStatus = checkEqualStatusHbacRule(
            selectedRules[0].ipaenabledflag[0],
            selectedRules
          );
          if (equalStatus) {
            if (selectedRules[0].ipaenabledflag[0]) {
              // Enabled
              props.buttonsData.updateIsDisableButtonDisabled(false);
              props.buttonsData.updateIsEnableButtonDisabled(true);
            } else {
              // Disabled
              props.buttonsData.updateIsDisableButtonDisabled(true);
              props.buttonsData.updateIsEnableButtonDisabled(false);
            }
          } else {
            // Different status selected -> Disable all buttons
            props.buttonsData.updateIsDisableButtonDisabled(true);
            props.buttonsData.updateIsEnableButtonDisabled(true);
          }
        }
      }
    }

    if (props.rulesData.selectedRules.length === 0) {
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      if (
        props.buttonsData.updateIsEnableButtonDisabled !== undefined &&
        props.buttonsData.updateIsDisableButtonDisabled !== undefined
      ) {
        props.buttonsData.updateIsDisableButtonDisabled(true);
        props.buttonsData.updateIsEnableButtonDisabled(true);
      }
    }
  }, [props.rulesData.selectedRules]);

  // Keyboard event
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShifting(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Defining table header and body from here to avoid passing specific names to the Table Layout
  const header = (
    <Tr>
      <Th modifier="wrap" aria-label="Select rows"></Th>
      <Th modifier="wrap">{columnNames.cn}</Th>
      <Th modifier="wrap">{columnNames.ipaenabledflag}</Th>
      <Th modifier="wrap">{columnNames.description}</Th>
    </Tr>
  );

  const body = shownRulesList.map((rule, rowIndex) => (
    <Tr key={rule.cn} id={rule.cn}>
      <Td
        dataLabel="checkbox"
        select={{
          rowIndex,
          onSelect: (_event, isSelecting) =>
            onSelectRule(rule, rowIndex, isSelecting),
          isSelected: isRuleSelected(rule),
          isDisabled: !props.rulesData.isHbacRuleSelectable(rule),
        }}
      />
      <Td dataLabel={columnNames.cn}>
        <Link to={"/hbac-rules/" + rule.cn} state={rule}>
          {rule.cn}
        </Link>
      </Td>
      <Td dataLabel={columnNames.ipaenabledflag}>
        {rule.ipaenabledflag[0] ? "Enabled" : "Disabled"}
      </Td>
      <Td dataLabel={columnNames.description}>{rule.description}</Td>
    </Tr>
  ));

  const skeleton = (
    <SkeletonOnTableLayout
      rows={4}
      colSpan={9}
      screenreaderText={"Loading table rows"}
    />
  );

  return (
    <TableLayout
      ariaLabel={"HBAC rules table"}
      variant={"compact"}
      hasBorders={true}
      classes={"pf-v6-u-mt-md"}
      tableId={"hbacrules-table"}
      isStickyHeader={true}
      tableHeader={header}
      tableBody={!props.showTableRows ? skeleton : body}
    />
  );
};

export default HBACRulesTable;
