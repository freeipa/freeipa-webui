import { Nav, NavExpandable, NavItem, NavList } from "@patternfly/react-core";
import React from "react";
import { NavLink } from "react-router-dom";
// Navigation (PatternFly)
import { navigationRoutes } from "./NavRoutes";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  updateBreadCrumbPath,
  updateActivePageName,
  updateActiveFirstLevel,
  updateActiveSecondLevel,
  updateBrowserTitle,
} from "src/store/Global/routes-slice";

// Renders NavItem
const renderNavItem = (
  item: { label: string; group: string; path: string; title: string },
  id: number,
  superGroup: string
) => {
  const dispatch = useAppDispatch();
  const activePageName = useAppSelector((state) => state.routes.activePageName);
  return (
    <NavItem
      key={id}
      isActive={activePageName === item.group}
      onClick={() => {
        dispatch(updateActiveSecondLevel(item.group));
        dispatch(updateActivePageName(item.group));
        dispatch(updateBrowserTitle(item.title));
        dispatch(updateActiveFirstLevel(superGroup));
        dispatch(updateBreadCrumbPath([{ name: item.label, url: item.path }]));
      }}
    >
      <NavLink to={item.path} data-cy={`nav-link-${item.group}`}>
        {item.label}
      </NavLink>
    </NavItem>
  );
};

// Renders 'Navigation'
const Navigation = () => {
  // The first level will determine if the section is expanded and highligted
  const activeFirstLevel = useAppSelector(
    (state) => state.routes.activeFirstLevel
  );

  return (
    <Nav>
      <NavList>
        {navigationRoutes.map((section, id) => {
          return (
            <NavExpandable
              key={id}
              title={section.label}
              isActive={section.items.some(
                (route) => route.group === activeFirstLevel
              )}
              isExpanded={section.items.some(
                (route) => route.group === activeFirstLevel
              )}
              data-cy={`nav-${section.label.toLowerCase()}`}
            >
              {section.items.map((subsection, sid) => {
                if (subsection.items && subsection.items.length > 0) {
                  return (
                    <NavExpandable
                      key={sid}
                      title={subsection.label}
                      isActive={activeFirstLevel === subsection.group}
                      isExpanded={activeFirstLevel === subsection.group}
                      data-cy={`nav-${subsection.group}`}
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
