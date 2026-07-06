# Sub-Pages — Entity Data Types

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Data Hook](02-data-hook.md)

How to use TypeScript interfaces and API metadata when generating sub-pages.

## Using Entity Data Types

Always check the entity's TypeScript interface in `src/utils/datatypes/globalDataTypes.ts`.

The interface provides:
1. **Field types** — Use the correct form component
2. **Type constraints** — Comments specify defaults, min/max, allowed values
3. **Optional vs required** — Fields without `?` are typically required

**Example:** The `OtpToken` interface:

```typescript
export interface OtpToken {
  ipatokenuniqueid: string;
  ipatokentotpclockoffset: number; // Default: 0 | Minimum value: -2147483648 | Maximum value: 2147483647
  ipatokentotptimestep: number;    // Default: 30 | Minimum value: 5 | Maximum value: 2147483647
  ipatokenotpdigits: OtpTokenDigits; // Default: 6
}
```

Apply constraints to form components:

```tsx
<IpaNumberInput
  name="ipatokentotptimestep"
  minValue={5}
  maxValue={2147483647}
  numCharsShown={10}  // max(String(5).length, String(2147483647).length)
/>
```

For plain `string` fields, `IpaTextInput` needs no extra constraint props — `required` is inferred automatically from metadata. Add `rules` only when custom validation is needed:

```tsx
<IpaTextInput
  name="cn"
  dataCy="entity-tab-settings-textbox-cn"
  ipaObject={ipaObject}
  onChange={recordOnChange}
  rules={[
    {
      id: "maxLength",
      message: "Must be at most 255 characters",
      validate: (value: string) => value.length <= 255,
    },
  ]}
/>
```

Each rule provides live feedback: `indeterminate` when empty, `success`/`error` as the user types.

## Type-to-Component Mappings

| TypeScript Type | Comment Hints | Form Component | Extra Props |
|-----------------|---------------|----------------|-------------|
| `string` | — | `IpaTextInput` | — |
| `string` | (multi-line) | `IpaTextArea` | — |
| `number` | `Minimum/Maximum value` | `IpaNumberInput` | `minValue`, `maxValue`, `numCharsShown` |
| `boolean` | — | `IpaCheckbox` | — |
| `Date \| string` | datetime | `IpaCalendar` | — |
| `string[]` | — | `IpaSelect` | `options` |
| Custom type | — | `IpaSelect` | `options` from type values |

## Calculating numCharsShown

For `IpaNumberInput`, set width based on the longest possible value:

```
numCharsShown = max(String(minValue).length, String(maxValue).length)
```

| Field | Min | Max | numCharsShown |
|-------|-----|-----|---------------|
| `ipatokentotpclockoffset` | -2147483648 | 2147483647 | 11 (includes `-`) |
| `ipatokentotptimestep` | 5 | 2147483647 | 10 |
| `ipatokenotpdigits` | 6 | 8 | 1 |

## Tab Shorthand Reference

Use these shorthand codes in prompts to specify membership tabs:

| Shorthand | Tab Type | Uses Component |
|-----------|----------|----------------|
| `memberof_group` | Member of User groups | `MemberOfUserGroups` |
| `memberof_hostgroup` | Member of Host groups | `MemberOfHostGroups` |
| `memberof_netgroup` | Member of Netgroups | `MemberOfNetgroups` |
| `memberof_role` | Member of Roles | `MemberOfRoles` |
| `memberof_hbacrule` | Member of HBAC rules | `MemberOfHbacRules` |
| `memberof_sudorule` | Member of Sudo rules | `MemberOfSudoRules` |
| `member_user` | User members | `MembersUsers` |
| `member_group` | Group members | `MembersUserGroups` |
| `member_host` | Host members | `MembersHosts` |
| `managedby_host` | Managed by hosts | `ManagedByHosts` |
| `managedby_user` | Managed by users | `ManagedByUsers` |
| `manager_user` | Member managers (users) | `ManagersUsers` |
| `manager_usergroup` | Member managers (groups) | `ManagersUserGroups` |
| `<name>` (table: cols) | Custom table | Custom implementation |

## Quick Reference

See also:
- [01-overview.md](01-overview.md) — Full input reference, example prompts
- [04-settings-tab.md](04-settings-tab.md) — Form components, field constraints
- [06-membership-tabs.md](06-membership-tabs.md) — Available membership components
