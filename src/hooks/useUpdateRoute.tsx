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
import { useConfigurationSettings } from "src/utils/configurationSettings";

/**
 * Given a pathname, this hook updates the Redux route slice with the current route data.
 * This allows to keep track of the current route and update the UI accordingly
 * (e.g., keep the Nav links highlighted and expanded).
 * @param pathname Current pathname
 * @returns {loadedGroup, breadCrumbPath, browserTitle}
 */

interface UpdateRouteProps {
  pathname: string;
  noBreadcrumb?: boolean;
}

const useUpdateRoute = ({ pathname, noBreadcrumb }: UpdateRouteProps) => {
  const dispatch = useAppDispatch();

  const configurationSettings = useConfigurationSettings();

  const [loadedGroup, setLoadedGroup] = React.useState<string[]>([]);
  const [breadCrumbPath, setBreadCrumbPath] = React.useState<BreadCrumbItem[]>(
    []
  );
  const [browserTitle, setBrowserTitle] = React.useState("");

  // Get route data when the page is loaded
  React.useEffect(() => {
    const loadedGroup = getGroupByPath(pathname, configurationSettings);
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
    if (noBreadcrumb === undefined || !noBreadcrumb) {
      const loadedBreadCrumb = getBreadCrumbByPath(
        pathname,
        configurationSettings
      );
      if (loadedBreadCrumb.length > 0) {
        setBreadCrumbPath(loadedBreadCrumb);
        dispatch(updateBreadCrumbPath(loadedBreadCrumb));
      }
    }

    // Get browser title based on current path
    const currentTitle = getTitleByPath(pathname, configurationSettings);
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
