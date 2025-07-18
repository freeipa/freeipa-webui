import React from "react";
// PatternFly
import { Td, Tr } from "@patternfly/react-table";
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from "@patternfly/react-core";
// Icons
import { SearchIcon } from "@patternfly/react-icons";

interface EmptyBodyTableProps {
  colSpan?: number;
  onClickFilter?: () => void;
}

const EmptyBodyTable = (props: EmptyBodyTableProps) => {
  return (
    <Tr>
      <Td colSpan={props.colSpan || 8}>
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateHeader
              titleText="No results found"
              icon={<EmptyStateIcon icon={SearchIcon} />}
              headingLevel="h2"
            />
            <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
            {props.onClickFilter && (
              <EmptyStateFooter>
                <Button
                  data-cy="button-clear-all-filters"
                  variant="link"
                  onClick={props.onClickFilter}
                >
                  Clear all filters
                </Button>
              </EmptyStateFooter>
            )}
          </EmptyState>
        </Bullseye>
      </Td>
    </Tr>
  );
};

export default EmptyBodyTable;
