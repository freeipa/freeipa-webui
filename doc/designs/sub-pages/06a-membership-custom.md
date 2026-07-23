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

## Search Behavior in Membership Tabs

`SearchInputLayout` (rendered inside `MemberOfToolbar`) buffers keystrokes locally and
commits the value to the URL `search` param on Enter, search button, or clear.
Membership tabs read that value via `useListPageSearchParams()` and filter client-side.

### Wiring the MemberOfToolbar

```tsx
const { page, perPage, searchValue, membershipDirection, setMembershipDirection } =
  useListPageSearchParams();

<MemberOfToolbar
  searchPlaceholder="Search members"
  searchAriaLabel="Search members"
  refreshButtonEnabled={isRefreshButtonEnabled}
  onRefreshButtonClick={props.onRefresh}
  deleteButtonEnabled={selected.length > 0}
  onDeleteButtonClick={() => setShowDeleteModal(true)}
  addButtonEnabled={isAddButtonEnabled}
  onAddButtonClick={() => setShowAddModal(true)}
  membershipDirectionEnabled={true}
  membershipDirection={membershipDirection}
  onMembershipDirectionChange={setMembershipDirection}
  helpIconEnabled={true}
  onHelpIconClick={() => dispatch(toggleHelpPanel())}
  totalItems={filteredMembers.length}
/>
```

`MemberOfToolbar` does not take search text props — search and pagination are
URL-backed by `SearchInputLayout` / `PaginationLayout` inside the toolbar.

### Client-Side Filtering Pattern

Use `searchValue` from `useListPageSearchParams` to filter the membership list.
Since the URL `search` param only changes on submit, the filter is applied only when
the user explicitly searches:

```tsx
const filteredMembers = React.useMemo(() => {
  let toLoad = [...memberList].sort();
  if (searchValue) {
    const q = searchValue.toLowerCase();
    toLoad = toLoad.filter((name) => name.toLowerCase().includes(q));
  }
  return toLoad;
}, [memberList, searchValue]);

const namesToLoad = React.useMemo(
  () => paginate(filteredMembers, page, perPage),
  [filteredMembers, page, perPage]
);
```

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

## Search Pagination Reset

Reset to page 1 when the search value changes or is submitted. Without this,
searching from page 2+ can show empty results because the filtered/queried
set may be smaller than the current page offset.

```tsx
const updateSearchValue = (value: string) => {
  setPage(1);
  setSearchValue(value);
};

const submitSearchValue = () => {
  setPage(1);
};

// Wire into MemberOfToolbar:
<MemberOfToolbar
  onSearchTextChange={updateSearchValue}
  onSearch={submitSearchValue}
  ...
/>

// ❌ Wrong: Passes setSearchValue directly — page stays at 2+
<MemberOfToolbar
  onSearchTextChange={setSearchValue}
  onSearch={() => {}}
  ...
/>
```

When using client-side filtering with pagination, also use the filtered count
for `totalItems` and `itemCount` so the pagination widget stays accurate:

```tsx
<MemberOfToolbar totalItems={filteredUsers.length} ... />
<Pagination itemCount={filteredUsers.length} ... />
```

## Derive Available Items with useMemo

Use `useMemo` (not `useState` + `useEffect`) to derive `availableUsers`
and `availableItems` from query data. This avoids extra render cycles and
eslint warnings about calling `setState` inside `useEffect`.

```tsx
// ✅ Correct: Derive with useMemo
const availableUsers = React.useMemo<User[]>(() => {
  if (!usersQuery.data || usersQuery.isFetching) return [];
  const { count, results } = usersQuery.data.result;
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(apiToUser(results[i].result));
  }
  return users;
}, [usersQuery.data, usersQuery.isFetching]);

const availableItems = React.useMemo<AvailableItems[]>(
  () =>
    availableUsers
      .filter((user) => !managedby_user.includes(user.uid))
      .map((user) => ({ key: user.uid, title: user.uid })),
  [availableUsers, managedby_user]
);

// ❌ Wrong: useState + useEffect causes extra renders and lint warnings
const [availableUsers, setAvailableUsers] = React.useState<User[]>([]);
React.useEffect(() => {
  if (usersQuery.data && !usersQuery.isFetching) {
    setAvailableUsers(/* ... */);  // eslint warning!
  }
}, [usersQuery.data, usersQuery.isFetching]);
```

## Mutation Response Handling

Always subdivide `"data" in response` into `result` and `error` paths.
The IPA API can return a successful HTTP response that contains an
application-level error (e.g., insufficient permissions).

```tsx
// ✅ Correct: Check result vs error within data
addManagedBy(payload).then(
  (
    response:
      | { data: { result?: unknown; error?: unknown } }
      | { error: FetchBaseQueryError | SerializedError }
  ) => {
    if ("data" in response) {
      if (response.data?.result) {
        dispatch(addAlert({
          name: "add-managedby-success",
          title: "Assigned new managers to OTP token '" + props.id + "'",
          variant: "success",
        }));
        props.onRefreshData();
        setShowAddModal(false);
      } else if (response.data?.error) {
        const errorMessage = response.data.error as unknown as ErrorResult;
        dispatch(addAlert({
          name: "add-managedby-error",
          title: errorMessage.message,
          variant: "danger",
        }));
      }
    } else if ("error" in response) {
      dispatch(addAlert({
        name: "add-managedby-error",
        title: "Failed to assign managers",
        variant: "danger",
      }));
    }
    setSpinning(false);
  }
);

// ❌ Wrong: Assumes "data" in response always means success
if ("data" in response) {
  dispatch(addAlert({ ..., variant: "success" }));  // May be an error!
}
```

Apply this three-branch pattern to **both** Add and Delete handlers:
- `response.data?.result` → success alert, refresh, close modal
- `response.data?.error` → extract error message, danger alert
- `"error" in response` → network/server failure fallback alert

## Examples

| Entity | Example File |
|--------|--------------|
| Active Users | `src/pages/ActiveUsers/UserMemberOf.tsx` |
| User Groups | `src/pages/UserGroups/UserGroupsTabs.tsx` |
| Hosts | `src/pages/Hosts/HostsManagedBy.tsx` |
| OTP Tokens | `src/pages/OtpTokens/OtpTokensManagedBy.tsx` |
