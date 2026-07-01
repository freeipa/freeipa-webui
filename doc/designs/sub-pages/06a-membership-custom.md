# Sub-Pages — Custom Membership Tab Implementation

> **Part of:** [Membership Tabs](06-membership-tabs.md)
> **See also:** [Checklist](08-checklist.md)

Patterns for creating custom membership tabs when shared components don't exist.

## Critical Implementation Patterns

### 1. Memoize Derived Member Lists

Use `useMemo` to ensure React properly detects changes:

```tsx
// ✅ Correct: Memoize the derived list
const managedby_user = React.useMemo(() => {
  const managedBy = props.entity.managedby_user;
  if (!managedBy) return [];
  if (Array.isArray(managedBy)) return managedBy;
  if (typeof managedBy === "string" && managedBy.includes(",")) {
    return managedBy.split(",");
  }
  return [managedBy];
}, [props.entity.managedby_user]);

// ❌ Wrong: Loses React's change detection
const managedby_user = getMemberList();
```

### 2. Skip RTK Query When List is Empty

```tsx
// ✅ Correct: Skip query when nothing to load
const fullUsersQuery = useGetUsersInfoByUidQuery(
  { uidsList: userNamesToLoad, noMembers: true },
  { skip: userNamesToLoad.length === 0 }
);

// ❌ Wrong: Query runs even with empty array
const fullUsersQuery = useGetUsersInfoByUidQuery({ uidsList: userNamesToLoad, noMembers: true });
```

### 3. Clear State When List Becomes Empty

```tsx
React.useEffect(() => {
  const names = getMembersToLoad();
  setNamesToLoad(names);
  if (names.length === 0) {
    setMembers([]);  // Clear displayed list!
  }
}, [memberList, searchValue, page, perPage]);
```

### 4. Use Specific Dependencies

```tsx
// ✅ Correct: Specific dependency
}, [managedby_user, searchValue, page, perPage]);

// ❌ Wrong: Entire object may not trigger correctly
}, [props.entity, searchValue, page, perPage]);
```

### 5. Use Lazy State Initialization

```tsx
// ✅ Correct: Lazy initialization
const [namesToLoad, setNamesToLoad] = React.useState<string[]>(() => getMembersToLoad());

// ❌ Wrong: Function called on every render
const [namesToLoad, setNamesToLoad] = React.useState<string[]>(getMembersToLoad());
```

### 6. Delete Modal Requires Children

`MemberOfDeleteModal` uses `props.children` to display items being deleted:

```tsx
// ✅ Correct: Pass a table showing selected items
{showDeleteModal && usersSelected.length > 0 && (
  <MemberOfDeleteModal
    showModal={showDeleteModal}
    onCloseModal={() => setShowDeleteModal(false)}
    title="Remove users from managed by"
    onDelete={onDeleteUsers}
    spinning={spinning}
  >
    <MemberTable
      entityList={users.filter((user) => usersSelected.includes(user.uid))}
      idKey="uid"
      from="active-users"
      columnNamesToShow={["User login"]}
      propertiesToShow={["uid"]}
      showTableRows
    />
  </MemberOfDeleteModal>
)}

// ❌ Wrong: No children - modal shows empty list
<MemberOfDeleteModal ... />
```

### 7. Use TabLayout and Tabs for Proper Styling

```tsx
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import TabLayout from "src/components/layouts/TabLayout";

// ✅ Correct: Wrap content in TabLayout + Tabs + Tab
return (
  <div style={{ height: `var(--memberof-calc)` }}>
    <TabLayout id="managedby">
      <Tabs activeKey={0} isBox={false} mountOnEnter unmountOnExit>
        <Tab
          eventKey={0}
          name="managedby_user"
          title={<TabTitleText>Users <Badge isRead>{memberCount}</Badge></TabTitleText>}
        >
          <MemberOfToolbar ... />
          <MemberTable ... />
          <Pagination ... />
        </Tab>
      </Tabs>
    </TabLayout>
    {/* Modals go OUTSIDE the TabLayout */}
    <MemberOfAddModal ... />
    <MemberOfDeleteModal ... />
  </div>
);
```

**Key points:**
- Outer `div` with `height: var(--memberof-calc)` is required
- Modals should be **outside** `TabLayout` to avoid z-index issues
- Inner `Tab` title can include a `Badge` showing member count

## Handling API Array Responses

The IPA API often returns single values as arrays:

```tsx
// ✅ Correct: Handle both array and string formats
const filteredUsers = usersQuery.data.filter((u: User) => {
  const uid = Array.isArray(u.uid) ? u.uid[0] : u.uid;
  return userNamesToLoad.includes(uid);
});

// ❌ Wrong: Assumes uid is always a string
const filteredUsers = usersQuery.data.filter((u: User) =>
  userNamesToLoad.includes(u.uid)  // u.uid might be ["admin"]
);
```

Apply this pattern to:
- Filtering entities by ID
- Building available items for add modals
- Filtering selected items for delete modals
- Displaying values in table cells

## Alert Message Patterns

Include the entity ID for context:

```tsx
// Add success
dispatch(addAlert({
  name: "add-managedby-user-success",
  title: "Assigned OTP token '" + props.id + "' to users",
  variant: "success",
}));

// Remove success
dispatch(addAlert({
  name: "remove-managedby-user-success",
  title: "Removed elements from '" + props.id + "'",
  variant: "success",
}));
```

## Examples

| Entity | Example File |
|--------|--------------|
| Active Users | `src/pages/ActiveUsers/UserMemberOf.tsx` |
| User Groups | `src/pages/UserGroups/UserGroupsTabs.tsx` |
| Hosts | `src/pages/Hosts/HostsManagedBy.tsx` |
| OTP Tokens | `src/pages/OtpTokens/OtpTokensManagedBy.tsx` |
