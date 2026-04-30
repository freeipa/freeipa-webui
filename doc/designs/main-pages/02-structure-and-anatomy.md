# Main Pages — Folder Structure, Anatomy & Imports

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Overview](01-overview.md) | [Walkthrough: Init & Data Fetching](03-walkthrough-init-fetch.md)

## Folder Structure

Each entity gets its own folder under `src/pages/`:

```
src/pages/MyEntities/
├── MyEntities.tsx          # Main page (this guide)
├── MyEntitiesTabs.tsx      # Detail/settings tabs (separate concern, not covered here)
└── MyEntitiesSettings.tsx  # Settings tab content (separate concern)
```

**Note:** Do not create a custom table component (e.g. `MyEntitiesTable.tsx`) in this folder. New pages must use the shared `MainTable` component from `src/components/tables/MainTable.tsx` instead.

## Anatomy of a Main Page

Every main page follows the same structural pattern, in this order:

1. **Route & title setup** (`useUpdateRoute`)
2. **URL-synced pagination/search state** (`useListPageSearchParams`)
3. **API version retrieval** (Redux selector)
4. **Data fetching** (RTK Query hook for initial load)
5. **Search mutation** (RTK Query mutation for explicit search)
6. **Selection management** (selected items, bulk selector logic)
7. **Button state management** (delete, enable, disable disabled states)
8. **Data wrappers** (prop bundles for child components)
9. **Toolbar items array** (search, buttons, pagination, kebab, help)
10. **JSX render** (title, toolbar, table, bottom pagination, modals)

## Imports

Main pages share a consistent set of imports. Adapt as needed for your entity.

```tsx
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
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
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useApiError from "src/hooks/useApiError";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
// Data types
import { MyEntity } from "src/utils/datatypes/globalDataTypes";
// Utils
import { API_VERSION_BACKUP, isMyEntitySelectable } from "src/utils/utils";
// RPC client
import { GenericPayload, useSearchEntriesMutation } from "src/services/rpc";
import { useGettingMyEntitiesQuery } from "src/services/rpcMyEntities";
// Tables
import MainTable from "src/components/tables/MainTable";
// Modals
import AddMyEntityModal from "src/components/modals/MyEntityModals/AddMyEntityModal";
import DeleteMyEntitiesModal from "src/components/modals/MyEntityModals/DeleteMyEntitiesModal";
```

### Optional imports (add only if the page needs them)

```tsx
// For kebab dropdown menus
import { DropdownItem, Button, Content } from "@patternfly/react-core";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";

// For contextual help panel
import ContextualHelpPanel from "src/components/ContextualHelpPanel/ContextualHelpPanel";

// For enable/disable operations
import DisableEnableMyEntitiesModal from "src/components/modals/MyEntityModals/DisableEnableMyEntitiesModal";
```
