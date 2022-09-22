import { Nav, NavExpandable, NavItem, NavList } from "@patternfly/react-core";
import React, { useState } from "react";
import {
  NavLink,
  useInRouterContext,
  useLocation,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
// Navigation (PatternFly)
import { navigationRoutes } from "./NavRoutes";

const renderNavItem = (item: { label: string; url: string }, id: number) => {
  const location = useLocation();
  console.log(useMatch(item.url));

  return (
    <NavItem key={id} isActive={!!useMatch(item.url)}>
      <NavLink to={item.url}>{item.label}</NavLink>
    </NavItem>
  );
};

const Navigation = () => {
  return (
    <Nav>
      <NavList>
        {navigationRoutes.map((section, id) => {
          return (
            <NavExpandable key={id} title={section.label} isActive isExpanded>
              {section.items.map((subsection, sid) => {
                return (
                  <NavExpandable
                    key={sid}
                    title={subsection.label}
                    isActive
                    isExpanded
                  >
                    {subsection.items.map(
                      (linkItem, lid) =>
                        linkItem.url && renderNavItem(linkItem, lid)
                    )}
                  </NavExpandable>
                );
              })}
            </NavExpandable>
          );
        })}
      </NavList>
    </Nav>
  );
};

export default Navigation;
