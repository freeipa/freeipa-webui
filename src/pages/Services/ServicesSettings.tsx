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
// Modals
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import IssueNewCertificate from "src/components/modals/CertificateModals/IssueNewCertificate";
// Layouts
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import ModalErrors from "src/components/errors/ModalErrors";
import TabLayout from "src/components/layouts/TabLayout";
// Field sections
import ServiceSettings from "src/components/ServicesSections/ServiceSettings";
import Provisioning from "src/components/ServicesSections/Provisioning";
import ServiceCertificate from "src/components/ServicesSections/ServiceCertificate";
import AllowedRetrieveKeytab from "src/components/ServicesSections/AllowedRetrieveKeytab";
import AllowedCreateKeytab from "src/components/ServicesSections/AllowedCreateKeytab";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useApiError from "src/hooks/useApiError";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// RPC
import {
  useSaveServiceMutation,
  useUnprovisionServiceMutation,
} from "src/services/rpcServices";
import { ErrorResult } from "src/services/rpc";
import { partialServiceToService } from "src/utils/serviceUtils";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";

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
  certData: Record<string, unknown>;
}

const ServicesSettings = (props: PropsToServicesSettings) => {
  const alerts = useAlerts();
  const modalErrors = useApiError([]);

  // API call: Save the Service
  const [saveService] = useSaveServiceMutation();
  const [executeUnprovision] = useUnprovisionServiceMutation();

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

  // 'Add certificate' modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const onCloseCertModal = () => {
    setIsCertModalOpen(false);
  };

  // Unprovision host modal
  const [modalSpinning, setModalSpinning] = React.useState(false);
  const [isUnprovisionModalOpen, setIsUnprovisionModalOpen] =
    React.useState(false);

  const onCloseUnprovisionModal = () => {
    setIsUnprovisionModalOpen(false);
  };

  const unprovisionModalActions = [
    <Button
      key="unprov-host"
      variant="danger"
      onClick={() => onUnprovision()}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Unprovisioning"
      spinnerAriaLabelledBy="Unprovisioning"
      spinnerAriaLabel="Unprovisioning"
    >
      {modalSpinning ? "Unprovisioning" : "Unprovision"}
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseUnprovisionModal}>
      Cancel
    </Button>,
  ];

  const onUnprovision = () => {
    const service = props.service.krbcanonicalname || "";
    if (service === "") {
      return;
    }
    setModalSpinning(true);

    executeUnprovision(service).then((result) => {
      if ("data" in result) {
        const disableError = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (disableError) {
          // alert: error
          let error: string | undefined = "";
          if ("error" in disableError) {
            error = disableError.error;
          } else if ("message" in disableError) {
            error = disableError.message;
          }

          alerts.addAlert(
            "unprovision-error",
            error || "Error when unprovisioning service",
            "danger"
          );
        } else {
          // alert: success
          alerts.addAlert(
            "unprovision-success",
            "Service successfully unprovisioned",
            "success"
          );
        }
        setModalSpinning(false);
        setIsUnprovisionModalOpen(false);
      }
    });
  };

  const dropdownItems = [
    <DropdownItem
      key="new certificate"
      onClick={() => setIsCertModalOpen(true)}
    >
      New certificate
    </DropdownItem>,
  ];

  if (props.service.has_keytab) {
    dropdownItems.unshift(
      <DropdownItem
        key="delete-key-unprovision"
        onClick={() => setIsUnprovisionModalOpen(true)}
      >
        Delete key, Unprovision
      </DropdownItem>
    );
  }

  const onKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<Element, MouseEvent> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "services", noBreadcrumb: true });

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
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
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
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
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
            <Provisioning service={props.service} metadata={props.metadata} />
            <TitleLayout
              key={2}
              headingLevel="h2"
              id="service-certificate"
              text="Service certificate"
            />
            <ServiceCertificate
              service={props.service}
              metadata={props.metadata}
              onServiceChange={props.onServiceChange}
              onRefresh={props.onRefresh}
              certData={props.certData}
            />
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
      <ConfirmationModal
        title={"Unprovision service"}
        isOpen={isUnprovisionModalOpen}
        onClose={onCloseUnprovisionModal}
        actions={unprovisionModalActions}
        messageText={"Unprovision/disable this service?"}
        messageObj={
          props.service.krbcanonicalname ? props.service.krbcanonicalname : ""
        }
      />
      <IssueNewCertificate
        isOpen={isCertModalOpen}
        onClose={onCloseCertModal}
        id={props.service.krbcanonicalname}
        showPrincipalFields={false}
        onRefresh={props.onRefresh}
        principal={
          props.service.krbprincipalname
            ? props.service.krbprincipalname[0]
            : ""
        }
      />
    </TabLayout>
  );
};

export default ServicesSettings;
