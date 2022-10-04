import { Nav, NavExpandable, NavItem, NavList } from "@patternfly/react-core";
import React from "react";
import { NavLink } from "react-router-dom";
// Navigation (PatternFly)
import { navigationRoutes } from "./NavRoutes";
// Context
import { Context } from "app/App";

// Renders NavItem
const renderNavItem = (
  item: { label: string; group: string; path: string; title: string },
  id: number,
  superGroup: string
) => {
  const { groupActive, setGroupActive, setBrowserTitle, setSuperGroupActive } =
    React.useContext(Context);
  return (
    <NavItem
      key={id}
      isActive={groupActive === item.group}
      onClick={() => {
        setGroupActive(item.group);
        setBrowserTitle(item.title);
        setSuperGroupActive(superGroup);
      }}
    >
      <NavLink to={item.path}>{item.label}</NavLink>
    </NavItem>
  );
};

// Renders 'Navigation'
const Navigation = () => {
  const { superGroupActive } = React.useContext(Context);
  return (
    <Nav>
      <NavList>
        {navigationRoutes.map((section, id) => {
          return (
            <NavExpandable
              key={id}
              title={section.label}
              isActive={section.items.some(
                (route) => route.group === superGroupActive
              )}
              isExpanded={section.items.some(
                (route) => route.group === superGroupActive
              )}
            >
              {section.items.map((subsection, sid) => {
                if (subsection.items.length > 0) {
                  return (
                    <NavExpandable
                      key={sid}
                      title={subsection.label}
                      isActive={superGroupActive === subsection.group}
                      isExpanded={superGroupActive === subsection.group}
                    >
                      {subsection.items.map(
                        (linkItem, lid) =>
                          linkItem.path &&
                          renderNavItem(linkItem, lid, subsection.group)
                      )}
                    </NavExpandable>
                  );
                } else {
                  return renderNavItem(subsection, sid, subsection.group);
                }
              })}
            </NavExpandable>
          );
        })}
      </NavList>
    </Nav>
  );
};

export default Navigation;
