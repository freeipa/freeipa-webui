import React from "react";
import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import {
  getBreadCrumbByPath,
  getGroupByPath,
  getTitleByPath,
} from "src/navigation/NavRoutes";
import {
  updateActiveFirstLevel,
  updateActivePageName,
  updateActiveSecondLevel,
  updateBreadCrumbPath,
  updateBrowserTitle,
} from "src/store/Global/routes-slice";
import { useAppDispatch } from "src/store/hooks";

/**
 * Given a pathname, this hook updates the Redux route slice with the current route data.
 * This allows to keep track of the current route and update the UI accordingly
 * (e.g., keep the Nav links highlighted and expanded).
 * @param pathname Current pathname
 * @returns {loadedGroup, breadCrumbPath, browserTitle}
 */

export const useUpdateRoute = ({ pathname }) => {
  const dispatch = useAppDispatch();

  const [loadedGroup, setLoadedGroup] = React.useState<string[]>([]);
  const [breadCrumbPath, setBreadCrumbPath] = React.useState<BreadCrumbItem[]>(
    []
  );
  const [browserTitle, setBrowserTitle] = React.useState("");

  // Get route data when the page is loaded
  React.useEffect(() => {
    const loadedGroup = getGroupByPath(pathname);
    if (loadedGroup.length > 0) {
      let currentFirstLevel = loadedGroup[loadedGroup.length - 2];
      const currentSecondLevel = loadedGroup[loadedGroup.length - 1];

      // If no second level is present, first and second levels have the same value
      // This allows the navbar item to be expanded and highlighted
      // E.g.: ['', 'services']
      if (currentFirstLevel === "") {
        currentFirstLevel = currentSecondLevel;
      }

      setLoadedGroup(loadedGroup);

      dispatch(updateActiveFirstLevel(currentFirstLevel));
      dispatch(updateActiveSecondLevel(currentSecondLevel));
      dispatch(updateActivePageName(currentSecondLevel)); // Corresponds to the page name
    }

    // Get breadcrumb data based on current path
    const loadedBreadCrumb = getBreadCrumbByPath(pathname);
    if (loadedBreadCrumb.length > 0) {
      setBreadCrumbPath(loadedBreadCrumb);
      dispatch(updateBreadCrumbPath(loadedBreadCrumb));
    }

    // Get browser title based on current path
    const currentTitle = getTitleByPath(pathname);
    if (currentTitle) {
      setBrowserTitle(currentTitle);
      dispatch(updateBrowserTitle(currentTitle));
    }
  }, [pathname]);

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  return {
    loadedGroup,
    breadCrumbPath,
    browserTitle,
  };
};

export default useUpdateRoute;
