# Sub-Pages — Troubleshooting: Form Issues

> **Part of:** [Troubleshooting](13-troubleshooting.md)
> **See also:** [Data Hook](03-data-hook.md) | [API Issues](13b-troubleshooting-api.md)

## Form Fields Not Editable / Save Button Always Disabled

**Symptom:** Form fields cannot be edited, or changes don't enable the Save button.

**Root Cause:** The FreeIPA API returns field values as **arrays** (e.g., `description: ["some text"]`), but UI components expect **simple types** (e.g., `description: "some text"`).

**Solution:** Always use `apiTo<Entity>` in the RPC endpoint's `transformResponse`:

```typescript
// ❌ INCORRECT - Raw API data
getEntityById: build.query<Partial<Entity>, string>({
  query: (id) => getCommand({ method: "entity_show", params: [[id], { all: true, rights: true }] }),
  transformResponse: (response: FindRPCResponse) =>
    response.result?.result as unknown as Partial<Entity>,  // Raw data!
}),

// ✅ CORRECT - Use apiTo<Entity> conversion
getEntityById: build.query<Entity, string>({
  query: (id) => getCommand({ method: "entity_show", params: [[id], { all: true, rights: true }] }),
  transformResponse: (response: FindRPCResponse) =>
    apiToEntity(response.result?.result),  // Properly converted!
}),
```

**Checklist:**
1. ✅ RPC `*_show` endpoint uses `apiTo<Entity>` in `transformResponse`
2. ✅ Entity utils file exports `apiTo<Entity>` function
3. ✅ The `apiTo<Entity>` function handles all fields in the entity interface

## Metadata Errors in Console

**Symptom:** Console shows errors like `Object <objectName> not found in metadata`.

**Solution:** 
1. Verify `objectName` matches the IPA API object (e.g., `selinuxusermap`, `sudorule`)
2. Check that field `name` props match actual API parameter names
3. Ensure metadata is loaded before rendering (check `isLoading` state)

## Table Data Handling

When displaying data in tables:

- **If the field should contain multiple values**, ensure it's typed as `string[]` and **excluded from `simpleValues`** in the utils file.
- **If the received value is a comma-separated string**, split it before displaying.

**Rule of thumb:** If a field represents a list that should display in a table, type it as `string[]` and exclude from `simpleValues`.

## IPA API Metadata as Source of Truth

When a prompt specifies an IPA API object, the **API metadata is the single source of truth**.

The metadata defines:
- **Available parameters** (`takes_params`) — field names, types, constraints
- **Attribute members** — relationships to other entities
- **Permissions and bindability** — what operations are allowed

**Before generating a sub-page**, verify:
1. The entity's TypeScript interface matches the API metadata
2. Field types align with the parameter definitions
3. Member fields (arrays) are correctly typed as `string[]`

## Post-Generation Quality Checks

**Always run these checks** after generating a sub-page:

```bash
npm run prettier:fix   # Fix code formatting
npm run knip           # Detect unused exports/files
npm run lint           # Fix any errors (warnings ok)
npm run build          # Catch TypeScript errors
```

Fix all errors before committing. See [08-checklist.md](08-checklist.md) for details.
