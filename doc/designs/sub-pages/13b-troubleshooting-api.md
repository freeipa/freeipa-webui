# Sub-Pages — Troubleshooting: API Issues

> **Part of:** [Troubleshooting](13-troubleshooting.md)
> **See also:** [Form Issues](13a-troubleshooting-forms.md) | [Save/Revert](13c-troubleshooting-save-revert.md)

## API Response Handling for Member Operations

When adding/removing members via `*_add_user`, `*_remove_user`, etc., handle the response structure carefully.

**API Response Structure:**

```json
{
  "result": {
    "completed": 2,
    "failed": { "memberuser": { "user": [], "group": [] } },
    "result": { "cn": ["rule_name"], "memberuser_user": ["user1", "user2"] }
  },
  "error": null
}
```

**Key points:**
- `error` is at the **top level** (`data.error`), NOT inside `data.result`
- `completed` — Number of successfully added/removed members (use for success check!)
- `failed` — Which members could not be added/removed

**Correct pattern:**

```typescript
addMemberToEntity(payload).then((response) => {
  if ("data" in response) {
    const data = response.data;
    
    // 1. Check for API-level error first
    if (data?.error) {
      dispatch(addAlert({ title: "Error: " + data.error, variant: "danger" }));
      return;
    }
    
    // 2. Check result and use 'completed' for success
    if (data?.result) {
      const results = data.result as unknown as AddRemoveMemberResult;
      
      // 2a. Check for partial failures
      const failedMembers = results.failed?.memberuser?.user || [];
      if (failedMembers.length > 0) {
        dispatch(addAlert({ 
          title: "Some members could not be added: " + failedMembers.join(", "), 
          variant: "danger" 
        }));
      }
      
      // 2b. Use 'completed' count for success
      if (results.completed > 0) {
        dispatch(addAlert({ 
          title: "Added " + results.completed + " member(s)", 
          variant: "success" 
        }));
      }
      
      props.onRefresh();
    }
  }
});
```

**Common mistakes:**

```typescript
// ❌ Using containsAny to verify success (type mismatches can cause failures)
if (containsAny(membersFromResponse, newMembers)) { ... }

// ❌ Checking results.error (doesn't exist in this structure!)
if (results && !results.error) { ... }

// ❌ Not refreshing on partial failures
if (results.completed > 0) { props.onRefresh(); }  // Should always refresh!
```

**Interface definition:**

```typescript
export interface AddRemoveMemberResult {
  completed: number;  // ← Use this for success check!
  failed: {
    memberuser?: { user: string[]; group: string[] };
    memberhost?: { host: string[]; hostgroup: string[] };
  };
  result: Record<string, unknown>;
}
```

## API Error: "Unknown option: memberuser_user"

**Symptom:** When saving, API returns error like `{"code": 3005, "message": "Unknown option: memberuser_user"}`.

**Root Cause:** The `*_mod` API endpoint does NOT accept member fields. These must be managed via separate `*_add_*` and `*_remove_*` endpoints.

**Solution:** Filter out member fields in the save mutation:

```typescript
saveEntity: build.mutation<FindRPCResponse, Partial<Entity>>({
  query: (entity) => {
    const params = { ...entity };
    delete params["cn"];
    delete params["dn"];
    // Member fields are NOT valid for *_mod API
    delete params["memberuser_user"];
    delete params["memberuser_group"];
    delete params["memberhost_host"];
    delete params["memberhost_hostgroup"];
    delete params["memberuser"];
    delete params["memberhost"];
    return getCommand({
      method: "entity_mod",
      params: [[entity.cn], params],
    });
  },
}),
```

**Fields to exclude:**
- Member arrays: `memberuser_user`, `memberuser_group`, `memberhost_host`, `memberhost_hostgroup`
- Aggregate arrays: `memberuser`, `memberhost`
- Read-only: `dn`

See [Category Toggle + Tables](12-settings-patterns.md#category-toggle--tables) for the complete pattern.
