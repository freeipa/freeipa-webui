import React, { useState } from "react";
// PatternFly
import { Pagination, ToolbarItemVariant } from "@patternfly/react-core";
// Data types
import { Host } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "../layouts/SecondaryButton";
import ToolbarLayout, { ToolbarItem } from "../layouts/ToolbarLayout";
import HelpTextWithIconLayout from "../layouts/HelpTextWithIconLayout";

interface PageData {
  page: number;
  changeSetPage: (
    newPage: number,
    perPage: number | undefined,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => void;
  perPage: number;
  changePerPageSelect: (
    newPerPage: number,
    newPage: number,
    startIdx: number | undefined,
    endIdx: number | undefined
  ) => void;
}

interface ButtonData {
  onClickAddHandler: () => void;
  onClickDeleteHandler: () => void;
  isDeleteButtonDisabled: boolean;
}

export interface PropsToToolbar {
  pageRepo: Host[];
  shownItems: Host[];
  updateShownElementsList: (newShownElementsList: Host[]) => void;
  pageData: PageData;
  buttonData: ButtonData;
}

const ManagedByToolbar = (props: PropsToToolbar) => {
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
    props.updateShownElementsList(props.pageRepo.slice(startIdx, endIdx));
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
    props.updateShownElementsList(props.pageRepo.slice(startIdx, endIdx));
    props.pageData.changePerPageSelect(newPerPage, newPage, startIdx, endIdx);
  };

  // 'Hosts' toolbar elements data
  const hostsToolbarData = {
    refreshButton: {
      id: "hosts-button-refresh",
    },
    deleteButton: {
      id: "hosts-button-delete",
      isDisabledHandler: props.buttonData.isDeleteButtonDisabled,
      onClickHandler: props.buttonData.onClickDeleteHandler,
    },
    addButton: {
      id: "hosts-button-add",
      onClickHandler: props.buttonData.onClickAddHandler,
    },
    separatorId: "hosts-separator",
    helpIcon: {
      id: "hosts-help-icon",
      // href: TDB
    },
    paginationId: "hosts-pagination",
  };

  const toolbarFields: ToolbarItem[] = [
    {
      id: hostsToolbarData.refreshButton.id,
      key: 0,
      element: (
        <SecondaryButton
          dataCy="hosts-tab-managed-by-button-refresh"
          name="refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      id: hostsToolbarData.deleteButton.id,
      key: 1,
      element: (
        <SecondaryButton
          dataCy="hosts-tab-managed-by-button-delete"
          name="remove"
          isDisabled={hostsToolbarData.deleteButton.isDisabledHandler}
          onClickHandler={hostsToolbarData.deleteButton.onClickHandler}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      id: hostsToolbarData.addButton.id,
      key: 2,
      element: (
        <SecondaryButton
          dataCy="hosts-tab-managed-by-button-add"
          name="add"
          onClickHandler={hostsToolbarData.addButton.onClickHandler}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      id: hostsToolbarData.separatorId,
      key: 3,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      id: hostsToolbarData.helpIcon.id,
      key: 7,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      id: hostsToolbarData.paginationId,
      key: 8,
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
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  // Render component
  return <ToolbarLayout isSticky={false} toolbarItems={toolbarFields} />;
};

export default ManagedByToolbar;
