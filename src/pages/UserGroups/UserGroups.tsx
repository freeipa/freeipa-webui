import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  TextVariants,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Components
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import PaginationLayout from "src/components/layouts/PaginationLayout";
// Tables
import UserGroupsTable from "./UserGroupsTable";
// Modal
import AddUserGroup from "src/components/modals/AddUserGroup";
import DeleteUserGroups from "src/components/modals/DeleteUserGroups";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateGroupsList } from "src/store/Identity/userGroups-slice";
// Data types
import { UserGroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isUserGroupSelectable } from "src/utils/utils";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "../../services/rpc";
import { useGettingGroupsQuery } from "../../services/rpcUserGroups";

const UserGroups = () => {
  return EmptyPage();
};

export default UserGroups;
