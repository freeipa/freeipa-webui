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
import NetgroupsTable from "src/pages/Netgroups/NetgroupsTable";
// Modal
import AddNetgroup from "src/components/modals/AddNetgroup";
import DeleteNetgroups from "src/components/modals/DeleteNetgroups";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { updateNetgroupsList } from "src/store/Identity/netgroups-slice";
// Data types
import { Netgroup } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isNetgroupSelectable } from "src/utils/utils";
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
import { useGettingNetgroupsQuery } from "../../services/rpcNetgroups";

const Netgroups = () => {
  return <EmptyPage />;
};

export default Netgroups;
