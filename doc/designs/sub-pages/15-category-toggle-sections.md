# Sub-Pages — Category Toggle Sections

> **Part of:** [Sub-Pages guide](../sub-pages.md)
> **See also:** [Settings Patterns](12-settings-patterns.md) | [Membership Tabs](06-membership-tabs.md)

## Overview

The Category Toggle Section pattern combines:
1. A toggle group to switch between "Anyone" (all) and "Specified" (specific members)
2. Tabbed tables showing membership entries for different member types
3. Add/Remove operations for managing members

### Components Involved

- **`CategoryToggleSection`** — `src/components/CategoryToggleSection/CategoryToggleSection.tsx`
- **`useCategoryMembershipOperations`** — `src/hooks/useCategoryMembershipOperations.ts`

## Documentation Structure

| File | Contents |
|------|----------|
| [15a-category-toggle-basics.md](15a-category-toggle-basics.md) | RPC mutations, hook config, UI component setup |
| [15b-category-toggle-advanced.md](15b-category-toggle-advanced.md) | Clearing members on "Anyone", API naming conventions |

## Quick Reference

### API Method Naming

| Entity | Users/Groups API | Hosts API |
|--------|-----------------|-----------|
| SELinux User Maps | `selinuxusermap_add_user` | `selinuxusermap_add_host` |
| Sudo Rules | `sudorule_add_user` | `sudorule_add_host` |
| HBAC Rules | `hbacrule_add_user` | `hbacrule_add_host` |

### Critical: Clearing Members

When switching to "Anyone" (`*category = "all"`), you **must** remove all existing members before saving. The API does NOT automatically clear members.

See [15b-category-toggle-advanced.md](15b-category-toggle-advanced.md) for implementation.

## Checklist

- [ ] Membership fields typed as `string[]` in `globalDataTypes.ts`
- [ ] Fields NOT in `simpleValues` in entity utils
- [ ] Fields initialized as `[]` in `createEmpty<Entity>()`
- [ ] Fields filtered out in save mutation
- [ ] Separate RPC mutations for add/remove
- [ ] `onSave` handles category change to "all"

## Reference Implementations

- `src/pages/SELinuxUserMaps/SELinuxUserMapsSettings.tsx`
- `src/pages/SudoRules/SudoRulesSettings.tsx`
- `src/components/SudoRuleSections/SudoRulesWho.tsx`
