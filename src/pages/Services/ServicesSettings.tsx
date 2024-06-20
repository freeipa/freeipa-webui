import React, { useState } from "react";
// PatternFly
import {
  DropdownItem,
  Flex,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  PageSectionVariants,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  TextVariants,
} from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { Metadata, Service } from "src/utils/datatypes/globalDataTypes";
// Layouts
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import ModalErrors from "src/components/errors/ModalErrors";
// Field sections
import ServiceSettings from "src/components/ServicesSections/ServiceSettings";
import Provisioning from "src/components/ServicesSections/Provisioning";
import ServiceCertificate from "src/components/ServicesSections/ServiceCertificate";
import AllowedRetrieveKeytab from "src/components/ServicesSections/AllowedRetrieveKeytab";
import AllowedCreateKeytab from "src/components/ServicesSections/AllowedCreateKeytab";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useApiError from "src/hooks/useApiError";
// RPC
import { useSaveServiceMutation } from "src/services/rpcServices";
import { ErrorResult } from "src/services/rpc";
import { partialServiceToService } from "src/utils/serviceUtils";

interface PropsToServicesSettings {
  service: Partial<Service>;
  originalService: Partial<Service>;
  metadata: Metadata;
  onServiceChange: (service: Partial<Service>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Service>;
  onResetValues: () => void;
}

const ServicesSettings = (props: PropsToServicesSettings) => {
  const alerts = useAlerts();
  const modalErrors = useApiError([]);

  // API call: Save the Service
  const [saveService] = useSaveServiceMutation();

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const dropdownItems = [
    <DropdownItem key="delete-key-unprovision">
      Delete key, Unprovision
    </DropdownItem>,
    <DropdownItem key="new certificate">New certificate</DropdownItem>,
  ];

  const onKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.krbcanonicalname = props.service.krbcanonicalname as string;
    setSaving(true);

    saveService(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Service modified", "success");
        } else if (response.data.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        // Reset values. Disable 'revert' and 'save' buttons
        props.onResetValues();
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onServiceChange(props.originalService);
    alerts.addAlert("revert-success", "Service data reverted", "success");
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={props.onRefresh}>
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          isDisabled={!props.isModified || isSaving}
          onClickHandler={onSave}
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          direction={"up"}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={dropdownItems}
        />
      ),
    },
  ];

  // Render component
  return (
    <>
      <alerts.ManagedAlerts />
      <PageSection
        id="settings-page"
        variant={PageSectionVariants.light}
        className="pf-v5-u-pr-0 pf-v5-u-ml-lg pf-v5-u-mr-sm"
        style={{ overflowY: "scroll", height: `calc(100vh - 319px)` }}
      >
        <Sidebar isPanelRight className="pf-v5-u-mt-lg">
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textComponent={TextVariants.p}
              textClassName="pf-v5-u-mb-md"
              subTextComponent={TextVariants.a}
              subTextIsVisitedLink={true}
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
              }
            />
            <JumpLinks
              isVertical
              label="Jump to section"
              scrollableSelector="#settings-page"
              offset={220} // for masthead
              expandable={{ default: "expandable", md: "nonExpandable" }}
            >
              <JumpLinksItem key={0} href="#service-settings">
                Service settings
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#provisioning">
                Provisioning
              </JumpLinksItem>
              <JumpLinksItem key={2} href="#service-certificate">
                Service certificate
              </JumpLinksItem>
              <JumpLinksItem key={3} href="#allowed-retrieve-keytab">
                Allow to retrieve keytab
              </JumpLinksItem>
              <JumpLinksItem key={4} href="#allowed-create-keytab">
                Allow to create keytab
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>

          <SidebarContent className="pf-v5-u-mr-xl">
            <Flex
              direction={{ default: "column" }}
              flex={{ default: "flex_1" }}
            >
              <TitleLayout
                key={0}
                headingLevel="h2"
                id="service-settings"
                text="Service settings"
              />
              <ServiceSettings
                service={props.service}
                metadata={props.metadata}
                onServiceChange={props.onServiceChange}
                onRefresh={props.onRefresh}
              />
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="provisioning"
                text="Provisioning"
              />
              <Provisioning />
              <TitleLayout
                key={2}
                headingLevel="h2"
                id="service-certificate"
                text="Service certificate"
              />
              <ServiceCertificate />
              <TitleLayout
                key={3}
                headingLevel="h2"
                id="allowed-retrieve-keytab"
                text="Allowed to retrieve keytab"
              />
              <AllowedRetrieveKeytab
                service={partialServiceToService(props.service)}
                onRefresh={props.onRefresh}
              />
              <TitleLayout
                key={4}
                headingLevel="h2"
                id="allowed-create-keytab"
                text="Allowed to create keytab"
              />
              <AllowedCreateKeytab
                service={partialServiceToService(props.service)}
                onRefresh={props.onRefresh}
              />
            </Flex>
          </SidebarContent>
        </Sidebar>
        <ModalErrors errors={modalErrors.getAll()} />
      </PageSection>
      <ToolbarLayout
        isSticky={true}
        className={"pf-v5-u-p-md pf-v5-u-ml-lg pf-v5-u-mr-lg"}
        toolbarItems={toolbarFields}
      />
    </>
  );
};

export default ServicesSettings;
