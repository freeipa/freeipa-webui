import React, { useEffect, useState } from "react";
// PatternFly
import {
  DropdownItem,
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
import DualListLayout from "src/components/layouts/DualListLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
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
import IDViewsTable from "src/pages/IDViews/IDViewsTable";
// Modal
import AddIDViewModal from "src/components/modals/AddIDView";
import DeleteIDViewsModal from "src/components/modals/DeleteIDViews";
// Redux
import { useAppSelector } from "src/store/hooks";
// Data types
import { IDView } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isViewSelectable } from "src/utils/utils";
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
import {
  ErrorResult,
  GenericPayload,
  useSearchEntriesMutation,
} from "../../services/rpc";
import {
  useGettingIDViewsQuery,
  useUnapplyHostsMutation,
  useUnapplyHostgroupsMutation,
} from "../../services/rpcIDViews";

const IDViews = () => {
  return <EmptyPage />;
};

export default IDViews;
