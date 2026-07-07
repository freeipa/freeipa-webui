import { useEffect } from "react";
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
  pathname?: string;
  noBreadcrumb?: boolean;
}

const useUpdateRoute = ({ pathname, noBreadcrumb }: UpdateRouteProps) => {
  const dispatch = useAppDispatch();
  const configurationSettings = useConfigurationSettings();

  // Get route data when the page is loaded
  useEffect(() => {
    if (pathname === undefined) return;

    let loadedGroup: string[] = [];
    loadedGroup = getGroupByPath(pathname, configurationSettings);
    if (loadedGroup.length > 0) {
      let currentFirstLevel = loadedGroup[loadedGroup.length - 2];
      const currentSecondLevel = loadedGroup[loadedGroup.length - 1];

      // If no second level is present, first and second levels have the same value
      // This allows the navbar item to be expanded and highlighted
      // E.g.: ['', 'services']
      if (currentFirstLevel === "") {
        currentFirstLevel = currentSecondLevel;
      }

      dispatch(updateActiveFirstLevel(currentFirstLevel));
      dispatch(updateActiveSecondLevel(currentSecondLevel));
      dispatch(updateActivePageName(currentSecondLevel)); // Corresponds to the page name
    }

    // Get breadcrumb data based on current path
    if (
      pathname !== undefined &&
      (noBreadcrumb === undefined || !noBreadcrumb)
    ) {
      const breadCrumbPath = getBreadCrumbByPath(
        pathname,
        configurationSettings
      );
      dispatch(updateBreadCrumbPath(breadCrumbPath));
    }

    // Get browser title based on current path
    if (pathname !== undefined) {
      const browserTitle = getTitleByPath(pathname, configurationSettings);
      dispatch(updateBrowserTitle(browserTitle));
    }
  }, [pathname, dispatch, configurationSettings, noBreadcrumb]);
};

export default useUpdateRoute;
