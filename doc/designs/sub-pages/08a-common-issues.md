# Sub-Pages — Common Implementation Issues

> **Part of:** [Checklist](08-checklist.md)
> **See also:** [Troubleshooting](13-troubleshooting.md)

## Component & Import Issues

### MemberOfToolbar Missing Props

```tsx
<MemberOfToolbar
  searchText={searchValue}
  onSearchTextChange={setSearchValue}
  onSearch={() => {}}              // Required!
  searchPlaceholder="Search users" // Required!
  searchAriaLabel="Search users"   // Required!
/>
```

### Wrong Table Component Import

```tsx
// ✅ Correct:
import MemberTable from "src/components/tables/MembershipTable";
// ❌ Wrong:
import MemberTable from "src/components/tables/MemberTable";  // Doesn't exist!
```

### Missing TabLayout/Tabs Wrappers

Custom membership tabs require `TabLayout` + `Tabs` + `Tab`:

```tsx
return (
  <div style={{ height: `var(--memberof-calc)` }}>
    <TabLayout id="managedby">
      <Tabs activeKey={0} isBox={false} mountOnEnter unmountOnExit>
        <Tab eventKey={0} title={...}>{/* Content */}</Tab>
      </Tabs>
    </TabLayout>
    {/* Modals outside TabLayout */}
  </div>
);
```

## API & Data Handling

### API Returns Single Values as Arrays

```tsx
// ✅ Correct:
const uid = Array.isArray(u.uid) ? u.uid[0] : u.uid;
// ❌ Wrong:
userNamesToLoad.includes(u.uid)  // u.uid might be ["admin"]
```

### RPC Response Structure

```tsx
// FindRPCResponse uses:
const data = response.result.result;
// BatchRPCResponse uses:
const data = response.result.results;  // plural
```

### Error Response Handling

```tsx
const errorMessage = response.data.error as unknown as ErrorResult;
dispatch(addAlert({ name: "error-name", title: errorMessage.message, variant: "danger" }));
```

### addAlert Requires `name` Property

```tsx
dispatch(addAlert({
  name: "add-success",  // Required!
  title: "Added users",
  variant: "success",
}));
```

## RTK Query Issues

### Missing `skip` Option

```tsx
const query = useGetUsersInfoByUidQuery(
  { uidsList: namesToLoad },
  { skip: namesToLoad.length === 0 }  // Prevent unnecessary calls
);
```

### UI Not Updating After Action

Include `fulfilledTimeStamp` in dependencies:

```tsx
React.useEffect(() => {
  if (query.data && !query.isFetching) setEntity({ ...query.data });
}, [query.data, query.isFetching, query.fulfilledTimeStamp]);
```

## State Management

### Not Memoizing Derived Lists

```tsx
const memberList = React.useMemo(() => getMemberList(), [props.entity.member_user]);
```

### Not Clearing State When List Empties

```tsx
React.useEffect(() => {
  const names = getMembersToLoad();
  setNamesToLoad(names);
  if (names.length === 0) setMembers([]);  // Clear displayed list!
}, [memberList, searchValue, page, perPage]);
```

### Boolean Status Comparison Fails

`convertApiObj` converts booleans to strings:

```tsx
const isDisabled = props.entity.statusField === true || String(props.entity.statusField) === "true";
```

## Modal Issues

### Delete Modal Missing Children

```tsx
<MemberOfDeleteModal showModal={showDeleteModal} ...>
  <MemberTable entityList={members.filter((m) => selectedItems.includes(m.uid))} ... />
</MemberOfDeleteModal>
```

### Modals Must Be Outside TabLayout

```tsx
return (
  <>
    <TabLayout>{/* content */}</TabLayout>
    <MyModal isOpen={showModal} />  {/* Outside! */}
  </>
);
```

### Kebab Actions Need Confirmation Modal

```tsx
const [showDeleteModal, setShowDeleteModal] = React.useState(false);
<DropdownItem onClick={() => setShowDeleteModal(true)}>Delete</DropdownItem>
// Don't: <DropdownItem onClick={() => deleteEntity(id)}>Delete</DropdownItem>
```

## Form Field Issues

### IpaSelect — Don't Use typeahead

Don't use `variant="typeahead"` in Settings pages.

### Let Metadata Control Editability

```tsx
// ✅ Let metadata control:
<IpaTextInput name="field" metadata={props.metadata} />
// ❌ Don't hardcode:
<IpaTextInput name="field" readOnly />
```

### Kebab Enable/Disable Not Respecting Status

```tsx
const isTokenDisabled = props.entity.ipatokendisabled === true;
<DropdownItem key="enable" isDisabled={!isTokenDisabled}>Enable</DropdownItem>
<DropdownItem key="disable" isDisabled={isTokenDisabled}>Disable</DropdownItem>
```

See [Troubleshooting](13-troubleshooting.md) for additional issues.
