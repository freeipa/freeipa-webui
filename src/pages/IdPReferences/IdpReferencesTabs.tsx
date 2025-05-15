import React from "react";
// PatternFly
import {
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useIdpRefSettingsData } from "src/hooks/useIdpRefSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import IdpRefSettings from "./IdpReferencesSettings";

// eslint-disable-next-line react/prop-types
const IdpReferencesTabs = ({ section }) => {
  const { cn } = useParams();
  const navigate = useNavigate();
  const pathname = "identity-provider-references";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // States - Identifier of the entity (IdP -> cn)
  const [id, setId] = React.useState("");

  // Data loaded from the API
  const idpRefSettingsData = useIdpRefSettingsData(cn as string);

  // Tab
  const [activeTabKey, setActiveTabKey] = React.useState(section);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + id);
    }
  };

  React.useEffect(() => {
    if (!cn) {
      // Redirect to the main page
      navigate(URL_PREFIX + "/" + pathname);
    } else {
      setId(cn);
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Identity provider references",
          url: URL_PREFIX + "/" + pathname,
        },
        {
          name: cn,
          url: URL_PREFIX + "/" + pathname + "/" + cn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      setActiveTabKey("settings");
    }
  }, [cn]);

  // Handling of the API data
  if (idpRefSettingsData.isLoading || !idpRefSettingsData.idpRef) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !idpRefSettingsData.isLoading &&
    Object.keys(idpRefSettingsData.idpRef).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={id}
          preText="Identity provider reference:"
          text={id}
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
            <IdpRefSettings
              idpRef={idpRefSettingsData.idpRef}
              originalIdpRef={idpRefSettingsData.originalIdpRef}
              metadata={idpRefSettingsData.metadata}
              onIdpRefChange={idpRefSettingsData.setIdpRef}
              onRefresh={idpRefSettingsData.refetch}
              isModified={idpRefSettingsData.modified}
              isDataLoading={idpRefSettingsData.isLoading}
              modifiedValues={idpRefSettingsData.modifiedValues}
              onResetValues={idpRefSettingsData.resetValues}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default IdpReferencesTabs;
