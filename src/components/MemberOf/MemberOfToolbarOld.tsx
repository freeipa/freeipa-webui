import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  Pagination,
  Text,
  TextContent,
  TextVariants,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Toolbar layout
import ToolbarLayout, {
  ToolbarItemAlignment,
  ToolbarItemSpacer,
} from "src/components/layouts/ToolbarLayout";
// Data types
import {
  UserGroupOld,
  Netgroup,
  Roles,
  HBACRules,
  SudoRules,
  HostGroup,
} from "src/utils/datatypes/globalDataTypes";
// Layout
import SearchInputLayout from "src/components/layouts/SearchInputLayout";

export type MembershipDirection = "direct" | "indirect";

interface MemberOfToolbarProps {
  // search
  searchText: string;
  onSearchTextChange: (value: string) => void;

  // buttons
  refreshButtonEnabled: boolean;
  onRefreshButtonClick?: () => void;
  deleteButtonEnabled: boolean;
  onDeleteButtonClick?: () => void;
  addButtonEnabled: boolean;
  onAddButtonClick?: () => void;

  membershipDirectionEnabled?: boolean;
  membershipDirection?: MembershipDirection;
  onMembershipDirectionChange: (direction: MembershipDirection) => void;

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

interface ButtonData {
  onClickAddHandler: () => void;
  onClickDeleteHandler: () => void;
  isDeleteButtonDisabled: boolean;
}

interface SettersData {
  changeMemberGroupsList: (
    arg:
      | UserGroupOld[]
      | Netgroup[]
      | Roles[]
      | HBACRules[]
      | SudoRules[]
      | HostGroup[]
  ) => void;
  changeTabName: (name: string) => void;
}

interface SearchValueData {
  searchValue: string;
  updateSearchValue: (value: string) => void;
}

export interface PropsToToolbar {
  pageRepo:
    | UserGroupOld[]
    | Netgroup[]
    | Roles[]
    | HBACRules[]
    | SudoRules[]
    | HostGroup[];
  shownItems:
    | UserGroupOld[]
    | Netgroup[]
    | Roles[]
    | HBACRules[]
    | SudoRules[]
    | HostGroup[];
  toolbar:
    | "user groups"
    | "netgroups"
    | "roles"
    | "HBAC rules"
    | "sudo rules"
    | "host groups";
  settersData: SettersData;
  pageData: PageData;
  buttonData: ButtonData;
  searchValueData: SearchValueData;
}

const MemberOfToolbar = (props: PropsToToolbar) => {
  // -- Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // - Page setters
  const onSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPage(newPage);
    props.settersData.changeMemberGroupsList(
      props.pageRepo.slice(startIdx, endIdx)
    );
    props.pageData.changeSetPage(newPage, perPage, startIdx, endIdx);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => {
    setPerPage(newPerPage);
    props.settersData.changeMemberGroupsList(
      props.pageRepo.slice(startIdx, endIdx)
    );
    props.pageData.changePerPageSelect(newPerPage, newPage, startIdx, endIdx);
  };

  // Toggle group
  // - User groups
  const [isTGUserGroupsSelected, setIsTGUserGroupsSelected] =
    useState("direct");

  const TGUserGroupsHandler = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsTGUserGroupsSelected(id);
  };

  const userGroupsOnClickAddHandler = () => {
    props.settersData.changeTabName("User groups");
    props.buttonData.onClickAddHandler();
  };

  const userGroupsOnDeleteClickHandler = () => {
    props.settersData.changeTabName("User groups");
    props.buttonData.onClickDeleteHandler();
  };

  // - Netgroups
  const [isTGNetgroupsSelected, setIsTGNetgroupsSelected] = useState("direct");

  const TGNetgroupsHandler = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsTGNetgroupsSelected(id);
  };

  const netgroupsOnClickAddHandler = () => {
    props.settersData.changeTabName("Netgroups");
    props.buttonData.onClickAddHandler();
  };

  const netgroupsOnDeleteClickHandler = () => {
    props.settersData.changeTabName("Netgroups");
    props.buttonData.onClickDeleteHandler();
  };

  // - Roles
  const [isTGRolesSelected, setIsTGRolesSelected] = useState("direct");

  const TGRolesHandler = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsTGRolesSelected(id);
  };

  const rolesOnClickAddHandler = () => {
    props.settersData.changeTabName("Roles");
    props.buttonData.onClickAddHandler();
  };

  const rolesOnDeleteClickHandler = () => {
    props.settersData.changeTabName("Roles");
    props.buttonData.onClickDeleteHandler();
  };

  // - HBAC rules
  const [isTGHbacRulesSelected, setIsTGHbacRulesSelected] = useState("direct");

  const TGHbacRulesHandler = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsTGHbacRulesSelected(id);
  };

  const hbacRulesOnClickAddHandler = () => {
    props.settersData.changeTabName("HBAC rules");
    props.buttonData.onClickAddHandler();
  };

  const hbacRulesOnDeleteClickHandler = () => {
    props.settersData.changeTabName("HBAC rules");
    props.buttonData.onClickDeleteHandler();
  };

  // - Sudo rules
  const [isTGSudoRulesSelected, setIsTGSudoRulesSelected] = useState("direct");

  const TGSudoRulesHandler = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsTGSudoRulesSelected(id);
  };

  const sudoRulesOnClickAddHandler = () => {
    props.settersData.changeTabName("Sudo rules");
    props.buttonData.onClickAddHandler();
  };

  const sudoRulesOnDeleteClickHandler = () => {
    props.settersData.changeTabName("Sudo rules");
    props.buttonData.onClickDeleteHandler();
  };

  // - Host groups
  const [isTGHostGroupsSelected, setIsTGHostGroupsSelected] =
    useState("direct");

  const TGHostGroupsHandler = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsTGHostGroupsSelected(id);
  };

  const hostGroupsOnClickAddHandler = () => {
    props.settersData.changeTabName("Host groups");
    props.buttonData.onClickAddHandler();
  };

  const hostGroupsOnDeleteClickHandler = () => {
    props.settersData.changeTabName("Host groups");
    props.buttonData.onClickDeleteHandler();
  };

  // 'User groups' toolbar elements data
  const userGroupsToolbarData = {
    searchId: "userGroups-search",
    separator1Id: "userGroups-separator-1",
    refreshButton: {
      id: "userGroups-button-refresh",
    },
    deleteButton: {
      id: "userGroups-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: userGroupsOnDeleteClickHandler,
    },
    addButton: {
      id: "userGroups-button-add",
      onClickHandler: userGroupsOnClickAddHandler,
    },
    separator2Id: "userGroups-separator-2",
    membership: {
      formId: "userGroups-form",
      toggleGroupId: "userGroups-toggle-group",
      isDirectSelected: isTGUserGroupsSelected === "direct",
      onDirectChange: TGUserGroupsHandler,
      isIndirectSelected: isTGUserGroupsSelected === "indirect",
      onIndirectChange: TGUserGroupsHandler,
    },
    separator3Id: "userGroups-separator-3",
    helpIcon: {
      id: "userGroups-help-icon",
      // href: TDB
    },
    paginationId: "userGroups-pagination",
  };

  // 'Netgroups' toolbar elements data
  const netgroupsToolbarData = {
    searchId: "netgroups-search",
    separator1Id: "netgroups-separator-1",
    refreshButton: {
      id: "netgroups-button-refresh",
    },
    deleteButton: {
      id: "netgroups-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: netgroupsOnDeleteClickHandler,
    },
    addButton: {
      id: "netgroups-button-add",
      onClickHandler: netgroupsOnClickAddHandler,
    },
    separator2Id: "netgroups-separator-2",
    membership: {
      formId: "netgroups-form",
      toggleGroupId: "netgroups-toggle-group",
      isDirectSelected: isTGNetgroupsSelected === "direct",
      onDirectChange: TGNetgroupsHandler,
      isIndirectSelected: isTGNetgroupsSelected === "indirect",
      onIndirectChange: TGNetgroupsHandler,
    },
    separator3Id: "netgroups-separator-3",
    helpIcon: {
      id: "netgroups-help-icon",
      // href: TDB
    },
    paginationId: "netgroups-pagination",
  };

  // 'Roles' toolbar elements data
  const rolesToolbarData = {
    searchId: "roles-search",
    separator1Id: "roles-separator-1",
    refreshButton: {
      id: "roles-button-refresh",
    },
    deleteButton: {
      id: "roles-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: rolesOnDeleteClickHandler,
    },
    addButton: {
      id: "roles-button-add",
      onClickHandler: rolesOnClickAddHandler,
    },
    separator2Id: "roles-separator-2",
    membership: {
      formId: "roles-form",
      toggleGroupId: "roles-toggle-group",
      isDirectSelected: isTGRolesSelected === "direct",
      onDirectChange: TGRolesHandler,
      isIndirectSelected: isTGRolesSelected === "indirect",
      onIndirectChange: TGRolesHandler,
    },
    separator3Id: "roles-separator-3",
    helpIcon: {
      id: "roles-help-icon",
      // href: TDB
    },
    paginationId: "roles-pagination",
  };

  // 'HBAC rules' toolbar elements data
  const hbacRulesToolbarData = {
    searchId: "hbacRules-search",
    separator1Id: "hbacRules-separator-1",
    refreshButton: {
      id: "hbacRules-button-refresh",
    },
    deleteButton: {
      id: "hbacRules-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: hbacRulesOnDeleteClickHandler,
    },
    addButton: {
      id: "hbacRules-button-add",
      onClickHandler: hbacRulesOnClickAddHandler,
    },
    separator2Id: "hbacRules-separator-2",
    membership: {
      formId: "hbacRules-form",
      toggleGroupId: "hbacRules-toggle-group",
      isDirectSelected: isTGHbacRulesSelected === "direct",
      onDirectChange: TGHbacRulesHandler,
      isIndirectSelected: isTGHbacRulesSelected === "indirect",
      onIndirectChange: TGHbacRulesHandler,
    },
    separator3Id: "hbacRules-separator-3",
    helpIcon: {
      id: "hbacRules-help-icon",
      // href: TDB
    },
    paginationId: "hbacRules-pagination",
  };

  // 'Sudo rules' toolbar elements data
  const sudoRulesToolbarData = {
    searchId: "sudoRules-search",
    separator1Id: "sudoRules-separator-1",
    refreshButton: {
      id: "sudoRules-button-refresh",
    },
    deleteButton: {
      id: "sudoRules-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: sudoRulesOnDeleteClickHandler,
    },
    addButton: {
      id: "sudoRules-button-add",
      onClickHandler: sudoRulesOnClickAddHandler,
    },
    separator2Id: "sudoRules-separator-2",
    membership: {
      formId: "sudoRules-form",
      toggleGroupId: "sudoRules-toggle-group",
      isDirectSelected: isTGSudoRulesSelected === "direct",
      onDirectChange: TGSudoRulesHandler,
      isIndirectSelected: isTGSudoRulesSelected === "indirect",
      onIndirectChange: TGSudoRulesHandler,
    },
    separator3Id: "sudoRules-separator-3",
    helpIcon: {
      id: "sudoRules-help-icon",
      // href: TDB
    },
    paginationId: "sudoRules-pagination",
  };

  // 'Host groups' toolbar elements data
  const hostGroupsToolbarData = {
    searchId: "hostGroups-search",
    separator1Id: "hostGroups-separator-1",
    refreshButton: {
      id: "hostGroups-button-refresh",
    },
    deleteButton: {
      id: "hostGroups-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: hostGroupsOnDeleteClickHandler,
    },
    addButton: {
      id: "hostGroups-button-add",
      onClickHandler: hostGroupsOnClickAddHandler,
    },
    separator2Id: "hostGroups-separator-2",
    membership: {
      formId: "hostGroups-form",
      toggleGroupId: "hostGroups-toggle-group",
      isDirectSelected: isTGHostGroupsSelected === "direct",
      onDirectChange: TGHostGroupsHandler,
      isIndirectSelected: isTGHostGroupsSelected === "indirect",
      onIndirectChange: TGHostGroupsHandler,
    },
    separator3Id: "hostGroups-separator-3",
    helpIcon: {
      id: "hostGroups-help-icon",
      // href: TDB
    },
    paginationId: "hostGroups-pagination",
  };

  // Specify which toolbar to show
  const toolbarData = () => {
    switch (props.toolbar) {
      case "user groups":
        return userGroupsToolbarData;
      case "netgroups":
        return netgroupsToolbarData;
      case "roles":
        return rolesToolbarData;
      case "HBAC rules":
        return hbacRulesToolbarData;
      case "sudo rules":
        return sudoRulesToolbarData;
      case "host groups":
        return hostGroupsToolbarData;
    }
  };

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem
          id="search-input"
          variant={ToolbarItemVariant["search-filter"]}
          spacer={{ default: "spacerMd" }}
        >
          Delete
        </Button>
      ),
    },
    {
      id: toolbarData().addButton.id,
      key: 4,
      element: (
        <Button
          variant="secondary"
          name="add"
          onClick={toolbarData().addButton.onClickHandler}
        >
          Add
        </Button>
      ),
    },
    {
      id: toolbarData().separator2Id,
      key: 5,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      id: "membership-form",
      key: 6,
      element: (
        <Form isHorizontal maxWidth="93px" className="pf-v5-u-pb-xs">
          <FormGroup
            fieldId="membership"
            label="Membership"
            className="pf-v5-u-pt-0"
          ></FormGroup>
        </Form>
      ),
    },
    {
      id: toolbarData().membership.formId,
      key: 7,
      element: (
        <ToggleGroup isCompact aria-label="Toggle group with single selectable">
          <ToggleGroupItem
            text="Direct"
            name="user-memberof-group-type-radio-direct"
            buttonId="direct"
            isSelected={toolbarData().membership.isDirectSelected}
            onChange={toolbarData().membership.onDirectChange}
          />
          <ToggleGroupItem
            text="Indirect"
            name="user-memberof-group-type-radio-indirect"
            buttonId="indirect"
            isSelected={toolbarData().membership.isIndirectSelected}
            onChange={toolbarData().membership.onIndirectChange}
          />
        </ToggleGroup>
      ),
    },
    {
      id: toolbarData().separator3Id,
      key: 8,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      id: toolbarData().helpIcon.id,
      key: 9,
      element: (
        <TextContent>
          <Text component={TextVariants.p}>
            <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
            <Text component={TextVariants.a} isVisitedLink>
              Help
            </Text>
          </Text>
        </TextContent>
      ),
    },
    {
      id: toolbarData().paginationId,
      key: 10,
      element: (
        <Pagination
          itemCount={props.pageRepo.length}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          widgetId="pagination-options-menu-top"
          onPerPageSelect={onPerPageSelect}
          isCompact
        />
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
        <ToolbarItem id="delete-button">
          <Button
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
            variant="secondary"
            name="add"
            isDisabled={!props.addButtonEnabled}
            onClick={props.onAddButtonClick}
          >
            Add
          </Button>
        </ToolbarItem>
        <ToolbarItem
          id="separator-membership"
          variant={ToolbarItemVariant.separator}
        />
        <ToolbarItem id="membership-form">
          <Form isHorizontal maxWidth="93px" className="pf-v5-u-pb-xs">
            <FormGroup
              fieldId="membership"
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
      </ToolbarContent>
    </Toolbar>
  );
};

export default MemberOfToolbar;
