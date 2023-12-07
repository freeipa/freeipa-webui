import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  TextVariants,
  PaginationVariant,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { HBACServiceGroup } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppSelector } from "src/store/hooks";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import HBACServiceGroupsTable from "./HBACServiceGroupsTable";
// Components
import PaginationLayout from "../../components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
// Modals
import AddHBACServiceGroup from "src/components/modals/HbacModals/AddHBACServiceGroup";
import DeleteHBACServiceGroup from "src/components/modals/HbacModals/DeleteHBACServiceGroup";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Utils
import {
  API_VERSION_BACKUP,
  isHbacServiceGroupSelectable,
} from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingHbacServiceGroupQuery } from "src/services/rpcHBACSvcGroups";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const HBACServiceGroups = () => {
  return EmptyPage();
};

export default HBACServiceGroups;
