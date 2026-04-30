# Main Pages — Checklist, Data Types, Selectability & Modal Naming

> **Part of:** [Main Pages guide](../main-pages.md)
> **See also:** [Overview](01-overview.md) | [Add Modal](07-add-modal.md) | [Delete Modal & Entity Utils](08-delete-modal-and-utils.md)

## Checklist: Files to Create or Modify

When adding a brand-new main page, touch these files:

### Required new files

| File | Purpose |
|------|---------|
| `src/pages/MyEntities/MyEntities.tsx` | The main page component |
| `src/utils/datatypes/globalDataTypes.ts` | Add the `MyEntity` interface |
| `src/utils/utils.tsx` | Add `isMyEntitySelectable` function |
| `src/utils/myEntitiesUtils.tsx` | Entity utils: `apiToMyEntity`, `createEmptyMyEntity`, `asRecord` (see [Entity Utils](08-delete-modal-and-utils.md)) |
| `src/services/rpcMyEntities.ts` | RTK Query hooks wrapping FreeIPA API commands (see [RPC Service](09-rpc-service.md)) |
| `src/components/modals/MyEntityModals/AddMyEntityModal.tsx` | Add modal |
| `src/components/modals/MyEntityModals/DeleteMyEntitiesModal.tsx` | Delete modal |

### Required modifications

| File | Change |
|------|--------|
| `src/navigation/AppRoutes.tsx` | Import the new page component and add `<Route>` entries (see [Routing](10-routing-and-conventions.md)) |
| `src/navigation/NavRoutes.ts` | Add group ref constant and register entry in `getNavigationRoutes` (see [Routing](10-routing-and-conventions.md)) |
| `src/services/rpc.ts` | Add `entryType` to `GenericPayload` union (if using generic search) and add cache tag to `tagTypes` (if needed). **Do not add entity-specific endpoints here** — those go in `src/services/rpc<Entity>.ts` |

### Optional new files

| File | When needed |
|------|------------|
| `src/components/modals/MyEntityModals/DisableEnableMyEntitiesModal.tsx` | If enable/disable is supported |

## Data Type Definition

Add the entity interface to `src/utils/datatypes/globalDataTypes.ts`:

```tsx
export interface MyEntity {
  cn: string;           // or string[] — depends on the IPA schema
  description: string;  // or string[]
  dn: string;
  // Add all relevant LDAP attributes...
}
```

**Important:** Do **not** add an index signature (`[key: string]: unknown`) to entity interfaces. Each field must be explicitly declared with its correct type. This preserves compile-time type safety — an index signature silently allows access to any arbitrary key, which defeats the purpose of having a typed interface.

To discover the full list of fields and their types for an entity, use the **API browser** built into the FreeIPA WebUI (navigate to *IPA Server > API browser* and look up the `<entity>_show` or `<entity>_find` command parameters). You can also consult the [FreeIPA API reference](https://freeipa.readthedocs.io/en/latest/api/commands.html).

Fields are typically `string` or `string[]` matching the IPA JSON-RPC response. Use `string[]` when the attribute is multi-valued in LDAP (most IPA attributes are arrays in the API).

## Selectability Function

Add to `src/utils/utils.tsx`:

```tsx
export const isMyEntitySelectable = (entity: MyEntity) => entity.cn !== "";
```

The pattern checks whether the primary key is non-empty (empty rows are placeholders/loading rows).

## Modal Naming Convention

All modal component files and their default exports **must** include the `Modal` suffix. This ensures consistency across the codebase and makes it immediately clear that the component is a modal.

| Modal type | File name pattern | Component name pattern |
|------------|------------------|----------------------|
| Add | `Add<Entity>Modal.tsx` | `Add<Entity>Modal` |
| Delete | `Delete<Entities>Modal.tsx` | `Delete<Entities>Modal` |
| Enable/Disable | `DisableEnable<Entities>Modal.tsx` | `DisableEnable<Entities>Modal` |

**Examples** from existing codebase:

- `src/components/modals/DnsZones/DeleteDnsZonesModal.tsx` → `DeleteDnsZonesModal`
- `src/pages/Trusts/AddTrustModal.tsx` → `AddTrustModal`
- `src/pages/Trusts/DeleteTrustModal.tsx` → `DeleteTrustModal`
