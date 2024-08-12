import React from "react";
// PatternFly
import {
  Button,
  Pagination,
  Text,
  TextContent,
  TextVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";

interface MemberOfSubIdToolbarProps {
  // buttons
  refreshButtonEnabled: boolean;
  onRefreshButtonClick?: () => void;
  autoAssignButtonEnabled: boolean;
  onAutoAssignSubIdsClick?: () => void;

  // help icon
  helpIconEnabled?: boolean;
  onHelpIconClick?: () => void;

  // paging
  totalItems: number;
  perPage: number;
  page: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (pageSize: number) => void;
}

const MemberOfSubIdToolbar = (props: MemberOfSubIdToolbarProps) => {
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem id="refresh-button">
          <Button
            variant="secondary"
            name="refresh"
            isDisabled={!props.refreshButtonEnabled}
            onClick={props.onRefreshButtonClick}
          >
            Refresh
          </Button>
        </ToolbarItem>
        <ToolbarItem id="auto-assign-button">
          <Button
            variant="secondary"
            name="auto-assign"
            isDisabled={!props.autoAssignButtonEnabled}
            onClick={props.onAutoAssignSubIdsClick}
          >
            Auto assign subordinate IDs
          </Button>
        </ToolbarItem>
        <ToolbarItem
          id="separator-help-icon"
          variant={ToolbarItemVariant.separator}
        />
        <ToolbarItem id="help-icon">
          <>
            {props.helpIconEnabled && (
              <TextContent>
                <Text component={TextVariants.p}>
                  <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
                  <Text component={TextVariants.a} isVisitedLink>
                    Help
                  </Text>
                </Text>
              </TextContent>
            )}
          </>
        </ToolbarItem>
        {props.totalItems > 0 && (
          <ToolbarItem id="pagination" align={{ default: "alignRight" }}>
            <Pagination
              itemCount={props.totalItems}
              perPage={props.perPage}
              page={props.page}
              onSetPage={(_e, page) =>
                props.onPageChange ? props.onPageChange(page) : null
              }
              widgetId="pagination-options-menu-top"
              onPerPageSelect={(_e, perPage) =>
                props.onPerPageChange ? props.onPerPageChange(perPage) : null
              }
              isCompact
            />
          </ToolbarItem>
        )}
      </ToolbarContent>
    </Toolbar>
  );
};

export default MemberOfSubIdToolbar;
