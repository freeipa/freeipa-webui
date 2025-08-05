import React from "react";
// PatternFly
import { Td, Tr } from "@patternfly/react-table";
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
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
          <EmptyState
            headingLevel="h2"
            icon={SearchIcon}
            titleText="No results found"
            variant={EmptyStateVariant.sm}
          >
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
