import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  Pagination,
  Content,
  ContentVariants,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import SearchInputLayout from "../layouts/SearchInputLayout";

export type MembershipDirection = "direct" | "indirect";

interface MemberOfToolbarProps {
  // search
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;

  // buttons
  refreshButtonEnabled: boolean;
  onRefreshButtonClick?: () => void;
  deleteButtonEnabled: boolean;
  onDeleteButtonClick?: () => void;
  addButtonEnabled: boolean;
  onAddButtonClick?: () => void;

  membershipDirectionEnabled?: boolean | false;
  membershipDirection?: MembershipDirection;
  onMembershipDirectionChange?: (direction: MembershipDirection) => void;

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

const MemberOfToolbar = (props: MemberOfToolbarProps) => {
  const onMembershipDirectionChange = (
    selected,
    direction: MembershipDirection
  ) => {
    if (selected && props.onMembershipDirectionChange) {
      props.onMembershipDirectionChange(direction);
    }
  };

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem id="search-input" gap={{ default: "gapMd" }}>
          <SearchInputLayout
            dataCy="search"
            name="search"
            ariaLabel="Search user"
            placeholder="Search"
            searchValueData={{
              searchValue: props.searchText,
              updateSearchValue: props.onSearchTextChange,
              submitSearchValue: props.onSearch,
            }}
          />
        </ToolbarItem>
        <ToolbarItem
          id="separator-refresh"
          variant={ToolbarItemVariant.separator}
        />
        <ToolbarItem id="refresh-button">
          <Button
            data-cy="member-of-button-refresh"
            variant="secondary"
            name="refresh"
            isDisabled={!props.refreshButtonEnabled}
            onClick={props.onRefreshButtonClick}
          >
            Refresh
          </Button>
        </ToolbarItem>
        <ToolbarItem id="delete-button">
          <Button
            data-cy="member-of-button-delete"
            variant="secondary"
            name="remove"
            isDisabled={!props.deleteButtonEnabled}
            onClick={props.onDeleteButtonClick}
          >
            Delete
          </Button>
        </ToolbarItem>
        <ToolbarItem id="add-button">
          <Button
            data-cy="member-of-button-add"
            variant="secondary"
            name="add"
            isDisabled={!props.addButtonEnabled}
            onClick={props.onAddButtonClick}
          >
            Add
          </Button>
        </ToolbarItem>
        {/* Membership direction will show only if `membershipDirectionEnabled` is true */}
        {props.membershipDirectionEnabled && (
          <>
            <ToolbarItem
              id="separator-membership"
              variant={ToolbarItemVariant.separator}
            />
            <ToolbarItem id="membership-form">
              <Form isHorizontal maxWidth="93px" className="pf-v5-u-pb-xs">
                <FormGroup
                  fieldId="membership"
                  role="group"
                  label="Membership"
                  className="pf-v5-u-pt-0"
                ></FormGroup>
              </Form>
            </ToolbarItem>
            <ToolbarItem id="toggle-group">
              <ToggleGroup
                isCompact
                aria-label="Toggle group with single selectable"
              >
                <ToggleGroupItem
                  text="Direct"
                  name="user-memberof-group-type-radio-direct"
                  buttonId="direct"
                  isSelected={props.membershipDirection === "direct"}
                  onChange={(_event, selected) =>
                    onMembershipDirectionChange(selected, "direct")
                  }
                />
                <ToggleGroupItem
                  text="Indirect"
                  name="user-memberof-group-type-radio-indirect"
                  buttonId="indirect"
                  isSelected={props.membershipDirection === "indirect"}
                  onChange={(_event, selected) =>
                    onMembershipDirectionChange(selected, "indirect")
                  }
                />
              </ToggleGroup>
            </ToolbarItem>
          </>
        )}
        <ToolbarItem
          id="separator-help-icon"
          variant={ToolbarItemVariant.separator}
        />
        <ToolbarItem id="help-icon">
          <>
            {props.helpIconEnabled && (
              <Content>
                <Content component={ContentVariants.p}>
                  <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
                  <Content component={ContentVariants.a} isVisitedLink>
                    Help
                  </Content>
                </Content>
              </Content>
            )}
          </>
        </ToolbarItem>
        {props.totalItems > 0 && (
          <ToolbarItem id="pagination" align={{ default: "alignEnd" }}>
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

export default MemberOfToolbar;
