import React, { useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Layouts
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useIDViewSettings } from "src/hooks/useIDViewSettingsData";
// Utils
import { partialViewToView } from "src/utils/idViewUtils";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import { NotFound } from "src/components/errors/PageErrors";
import IDViewsSettings from "./IDViewsSettings";

// eslint-disable-next-line react/prop-types
const IDViewsTabs = ({ section }) => {
  // Get location (React Router DOM) and get state data
  const { cn } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const idViewSettingsData = useIDViewSettings(cn as string);
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/id-views/" + cn);
    } else if (tabIndex === "overrides") {
      navigate("/id-views/" + cn + "/overrides_idview");
    } else if (tabIndex === "appliedto") {
      navigate("/id-views/" + cn + "/appliedto_idview");
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate("/id-views");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "ID views",
          url: URL_PREFIX + "/id-views",
        },
        {
          name: cn,
          url: URL_PREFIX + "/id-views/" + cn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [cn]);

  // Redirect to the settings page if the section is not defined
  React.useEffect(() => {
    if (!section) {
      navigate(URL_PREFIX + "/id-views/" + cn);
    }
    setActiveTabKey(section);
  }, [section]);

  if (
    idViewSettingsData.isLoading ||
    idViewSettingsData.idView.cn === undefined
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the idView is not found
  if (
    !idViewSettingsData.isLoading &&
    Object.keys(idViewSettingsData.idView).length === 0
  ) {
    return <NotFound />;
  }

  const view = partialViewToView(idViewSettingsData.idView);

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={view.cn}
          preText="ID view:"
          text={view.cn}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="light300"
          isBox
          className="pf-v5-u-ml-lg"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
            <IDViewsSettings
              idView={idViewSettingsData.idView}
              originalIDView={idViewSettingsData.originalView}
              metadata={idViewSettingsData.metadata}
              onIDViewChange={idViewSettingsData.setIDView}
              isDataLoading={idViewSettingsData.isFetching}
              onRefresh={idViewSettingsData.refetch}
              isModified={idViewSettingsData.modified}
              onResetValues={idViewSettingsData.resetValues}
              modifiedValues={idViewSettingsData.modifiedValues}
            />
          </Tab>
          <Tab
            eventKey={"overrides"}
            name="overrides-details"
            title={<TabTitleText>Overrides</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
          <Tab
            eventKey={"appliesTo"}
            name="appliesTo-details"
            title={<TabTitleText>Applies to</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default IDViewsTabs;
