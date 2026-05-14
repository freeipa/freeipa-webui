# Sub-Pages — Visual Reference

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Tab](04-settings-tab.md) | [Membership Tabs](06-membership-tabs.md)

ASCII diagrams showing the layout of each sub-page tab type.

## Settings Tab

Edit entity properties with forms, category toggles, and member tables.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Refresh] [Revert] [Save]                          [⋮ Kebab]   │
├─────────────────────────────────────────────────────────────────┤
│                                             │ [? Help]         │
│  ═══ General ═══                            │                  │
│  ┌───────────────────────────────────────┐  │ Jump to:         │
│  │ Rule name:   [readonly field       ]  │  │ • General        │
│  │ Description: [text area            ]  │  │ • User           │
│  │ SELinux user:[required field       ]  │  │ • Host           │
│  └───────────────────────────────────────┘  │                  │
│                                             │                  │
│  ═══ User ═══                               │                  │
│  ( ) Anyone  (•) Specified users            │                  │
│  ┌───────────────────────────────────────┐  │                  │
│  │ [Users 3]  [User groups 2]            │  │                  │
│  │ ┌───────────────────────────────────┐ │  │                  │
│  │ │ ☐ user1                    [link] │ │  │                  │
│  │ │ ☐ user2                    [link] │ │  │                  │
│  │ │ ☐ user3                    [link] │ │  │                  │
│  │ └───────────────────────────────────┘ │  │                  │
│  │ [+ Add]  [− Delete]                   │  │                  │
│  └───────────────────────────────────────┘  │                  │
│                                             │                  │
│  ═══ Host ═══                               │                  │
│  (•) Any host  ( ) Specified hosts          │                  │
│  (tables disabled when "Any host")          │                  │
└─────────────────────────────────────────────┴──────────────────┘
```

## Member Of Tab

Shows groups, rules, or policies this entity belongs to.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Refresh]                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [User groups 5] [Netgroups 2] [Roles 1] [HBAC rules 3] [Sudo]  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🔍 [Search...                    ]  [+ Add]  [− Delete]        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☐  Group name          │ GID        │ Description       │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ ☐  admins       [link] │ 1000       │ Admin group       │    │
│  │ ☐  developers   [link] │ 1001       │ Dev team          │    │
│  │ ☐  editors      [link] │ 1002       │ Content editors   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ◀ 1 - 3 of 5 ▶                           [10 ▼] per page      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Managed By Tab

Shows entities (hosts, users) that can manage this entity.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Refresh]                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Hosts 2]                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🔍 [Search...                    ]  [+ Add]  [− Delete]        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☐  Host name                    │ Description           │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ ☐  server1.example.com   [link] │ Primary server        │    │
│  │ ☐  server2.example.com   [link] │ Backup server         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ◀ 1 - 2 of 2 ▶                           [10 ▼] per page      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Members Tab

Shows entities that are members of this group/rule.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Refresh]                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Users 12] [User groups 3] [Services 0]                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🔍 [Search...                    ]  [+ Add]  [− Delete]        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☐  User login       │ First name  │ Last name  │ Status │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ ☐  admin     [link] │ Admin       │ User       │ ●      │    │
│  │ ☐  jsmith    [link] │ John        │ Smith      │ ●      │    │
│  │ ☐  mjones    [link] │ Mary        │ Jones      │ ○      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ◀ 1 - 3 of 12 ▶                          [10 ▼] per page      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Custom Table Tab

Entity-specific tables like DNS records, ID overrides, etc.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Refresh]                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DNS Resource Records                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🔍 [Search...                    ]  [+ Add]  [− Delete]        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☐  Record name  │ Type   │ Data                         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ ☐  @     [link] │ A      │ 192.168.1.1                  │    │
│  │ ☐  @     [link] │ MX     │ 10 mail.example.com.         │    │
│  │ ☐  www   [link] │ CNAME  │ example.com.                 │    │
│  │ ☐  mail  [link] │ A      │ 192.168.1.2                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ◀ 1 - 4 of 15 ▶                          [10 ▼] per page      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Combined Tabs View (Parent Component)

How tabs appear together in the parent Tabs component.

```
┌─────────────────────────────────────────────────────────────────┐
│  ← SELinux user maps                                            │
│                                                                 │
│  SELinux user map: my-selinux-rule                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌───────────┐ ┌────────────┐                      │
│  │ Settings │ │ Member Of │ │ Managed By │  ← Secondary tabs    │
│  └──────────┘ └───────────┘ └────────────┘                      │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│               (Selected tab content appears here)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
