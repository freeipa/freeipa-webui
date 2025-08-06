import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
// import { useCertMappingSettingsData } from "src/hooks/useCertMappingSettingsData";
import { useCertificateMappingSettingsData } from "src/hooks/useCertificateMappingSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import CertificateMappingSettings from "./CertificateMappingSettings";

// eslint-disable-next-line react/prop-types
const CertificateMappingTabs = ({ section }) => {
  const { cn } = useParams();
  const navigate = useNavigate();
  const pathname = "cert-id-mapping-rules";

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  // States - Identifier of the entity (Certificate mapping -> cn)
  const [id, setId] = React.useState("");

  // Data loaded from the API
  const certMappingSettingsData = useCertificateMappingSettingsData(
    cn as string
  );

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
          name: "Certificate Identity Mapping Rule",
          url: URL_PREFIX + "/" + pathname,
        },
        {
          name: cn,
          url: URL_PREFIX + "/" + pathname + "/" + cn,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
    }
  }, [cn]);

  // Handling of the API data
  if (
    certMappingSettingsData.isLoading ||
    !certMappingSettingsData.certMapping
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the certMapping is not found
  if (
    !certMappingSettingsData.isLoading &&
    Object.keys(certMappingSettingsData.certMapping).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <>
      <PageSection hasBodyWrapper={false} className="pf-v6-u-pr-0">
        <BreadCrumb
          className="pf-v6-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={id}
          preText="Certificate Identity Mapping Rule:"
          text={id}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={section}
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
            <CertificateMappingSettings
              certMapping={certMappingSettingsData.certMapping}
              originalCertMapping={certMappingSettingsData.originalCertMapping}
              metadata={certMappingSettingsData.metadata}
              onCertMappingChange={certMappingSettingsData.setCertMapping}
              onRefresh={certMappingSettingsData.refetch}
              isModified={certMappingSettingsData.modified}
              isDataLoading={certMappingSettingsData.isLoading}
              modifiedValues={certMappingSettingsData.modifiedValues}
              onResetValues={certMappingSettingsData.resetValues}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default CertificateMappingTabs;
