import React from "react";
// PatternFly
import {
  Button,
  Content,
  ContentVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import PaginationLayout from "../layouts/PaginationLayout";

interface MemberOfSubIdToolbarProps {
  // buttons
  refreshButtonEnabled: boolean;
  onRefreshButtonClick?: () => void;
  autoAssignButtonEnabled: boolean;
  onAutoAssignSubIdsClick?: () => void;

  // help icon
  helpIconEnabled?: boolean;
  onHelpIconClick?: () => void;

  // paging — page/perPage come from URL via PaginationLayout
  totalItems: number;
}

const MemberOfSubIdToolbar = (props: MemberOfSubIdToolbarProps) => {
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem id="refresh-button">
          <Button
            data-cy="member-of-sub-id-button-refresh"
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
            data-cy="member-of-sub-id-button-auto-assign"
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
              <Content component={ContentVariants.p}>
                <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
                <Content component={ContentVariants.a} isVisitedLink>
                  Help
                </Content>
              </Content>
            )}
          </>
        </ToolbarItem>
        {props.totalItems > 0 && (
          <ToolbarItem id="pagination" align={{ default: "alignEnd" }}>
            <PaginationLayout
              list={[]}
              totalCount={props.totalItems}
              widgetId="pagination-options-menu-top"
              isCompact
            />
          </ToolbarItem>
        )}
      </ToolbarContent>
    </Toolbar>
  );
};

export default MemberOfSubIdToolbar;
