import React, { useState } from "react";
// PatternFly
import {
  Button,
  DropdownItem,
  Flex,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import {
  Certificate,
  Metadata,
  Service,
} from "src/utils/datatypes/globalDataTypes";
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
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useApiError from "src/hooks/useApiError";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
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
  certData?: Certificate[];
  changeFromPage: (from: string) => void;
  onOpenContextualPanel: () => void;
}

const ServicesSettings = (props: PropsToServicesSettings) => {
  const dispatch = useAppDispatch();

  const modalErrors = useApiError([]);

  // API call: Save the Service
  const [saveService] = useSaveServiceMutation();
  const [executeUnprovision] = useUnprovisionServiceMutation();

  // Update page to show correct links info in Contextual panel
  React.useEffect(() => {
    props.changeFromPage("service-settings");
  }, [props.changeFromPage]);

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
      data-cy="modal-button-unprovision"
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
    <Button
      data-cy="modal-button-cancel"
      key="cancel"
      variant="link"
      onClick={onCloseUnprovisionModal}
    >
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
        const disableError = result.data?.error as
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

          dispatch(
            addAlert({
              name: "unprovision-error",
              title: error || "Error when unprovisioning service",
              variant: "danger",
            })
          );
        } else {
          // alert: success
          dispatch(
            addAlert({
              name: "unprovision-success",
              title: "Service successfully unprovisioned",
              variant: "success",
            })
          );
        }
        setModalSpinning(false);
        setIsUnprovisionModalOpen(false);
      }
    });
  };

  const dropdownItems = [
    <DropdownItem
      data-cy="services-tab-settings-kebab-new-certificate"
      key="new certificate"
      onClick={() => setIsCertModalOpen(true)}
    >
      New certificate
    </DropdownItem>,
  ];

  if (props.service.has_keytab) {
    dropdownItems.unshift(
      <DropdownItem
        data-cy="services-tab-settings-kebab-delete-key-unprovision"
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
        if (response.data?.result) {
          // Show toast notification: success
          dispatch(
            addAlert({
              name: "save-success",
              title: "Service modified",
              variant: "success",
            })
          );
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          dispatch(
            addAlert({
              name: "save-error",
              title: errorMessage.message,
              variant: "danger",
            })
          );
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
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Service data reverted",
        variant: "success",
      })
    );
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="services-tab-settings-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="services-tab-settings-button-revert"
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
          dataCy="services-tab-settings-button-save"
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
          dataCy="services-tab-settings-kebab"
          direction={"up"}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={dropdownItems}
          isDisabled={isSaving}
        />
      ),
    },
  ];

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight className="pf-v6-u-mt-lg">
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={props.onOpenContextualPanel}
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
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
        <SidebarContent className="pf-v6-u-mr-xl">
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
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="services-modal-error"
      />
      <ConfirmationModal
        dataCy="services-unprovision-modal"
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
