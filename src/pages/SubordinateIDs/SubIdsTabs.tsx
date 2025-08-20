import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useSubidSettings } from "src/hooks/useSubidSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import SubidSettings from "./SubidsSettings";

// eslint-disable-next-line react/prop-types
const SubIdTabs = ({ section }) => {
  const { ipauniqueid } = useParams();
  const navigate = useNavigate();
  const pathname = "subordinate-ids";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [id, setId] = React.useState("");

  // Data loaded from the API
  const subidSettingsData = useSubidSettings(ipauniqueid as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = React.useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);

    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + id);
    }
  };

  React.useEffect(() => {
    if (!ipauniqueid) {
      // Redirect to the main page
      navigate(URL_PREFIX + "/" + pathname);
    } else {
      setId(ipauniqueid);
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Subordinate IDs",
          url: URL_PREFIX + "/" + pathname,
        },
        {
          name: ipauniqueid,
          url: URL_PREFIX + "/" + pathname + "/" + ipauniqueid,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
    }
  }, [ipauniqueid]);

  if (subidSettingsData.isLoading || !subidSettingsData.subid) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !subidSettingsData.isLoading &&
    Object.keys(subidSettingsData.subid).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={id}
          preText="Subordinate IDs:"
          text={id}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="secondary"
          isBox
          className="pf-v6-u-ml-lg"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <SubidSettings
              subId={subidSettingsData.subid}
              originalSubId={subidSettingsData.originalSubid}
              metadata={subidSettingsData.metadata}
              onSubIdChange={subidSettingsData.setSubid}
              onRefresh={subidSettingsData.refetch}
              isModified={subidSettingsData.modified}
              isDataLoading={subidSettingsData.isLoading}
              modifiedValues={subidSettingsData.modifiedValues}
              onResetValues={subidSettingsData.resetValues}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default SubIdTabs;
