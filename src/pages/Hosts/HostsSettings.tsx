import React, { useState } from "react";
// PatternFly
import {
  Button,
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
import { Host, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import useApiError from "src/hooks/useApiError";
import ModalErrors from "src/components/errors/ModalErrors";
// Modals
import HostSetPassword from "src/components/modals/HostSetPassword";
import IssueNewCertificate from "src/components/modals/IssueNewCertificate";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
// Layouts
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
import TextLayout from "src/components/layouts/TextLayout";
// Field sections
import HostSettings from "src/components/HostsSections/HostSettings";
import Enrollment from "src/components/HostsSections/Enrollment";
import HostCertificate from "src/components/HostsSections/HostCertificate";
import AllowedRetrieveKeytab from "src/components/HostsSections/AllowedRetrieveKeytab";
import AllowedCreateKeytab from "src/components/HostsSections/AllowedCreateKeytab";
// RPC
import { ErrorResult } from "src/services/rpc";
import {
  useSaveHostMutation,
  useAutoMemberRebuildHostsMutation,
  useUnprovisionHostMutation,
} from "src/services/rpcHosts";

interface PropsToHostsSettings {
  host: Partial<Host>;
  originalHost: Partial<Host>;
  metadata: Metadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certData: any;
  onHostChange: (host: Partial<Host>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Host>;
  onResetValues: () => void;
}

const HostsSettings = (props: PropsToHostsSettings) => {
  // Alerts to show in the UI
  const alerts = useAlerts();
  const modalErrors = useApiError([]);

  // API save the host
  const [saveHost] = useSaveHostMutation();

  // Automember rebuild command
  const [executeAutoMemberRebuild] = useAutoMemberRebuildHostsMutation();

  const [executeUnprovisionHost] = useUnprovisionHostMutation();

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);

  // 'Set password' option
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // 'Rebuild auto membership' modal
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  // 'Add certificate' modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const onCloseCertModal = () => {
    setIsCertModalOpen(false);
  };

  // Unprovision host modal
  const [modalSpinning, setModalSpinning] = React.useState(false);
  const [isUnprovisionHostModalOpen, setIsUnprovisionHostModalOpen] =
    React.useState(false);

  const onCloseUnprovisionHostModal = () => {
    setIsUnprovisionHostModalOpen(false);
  };

  const unprovisionHostModalActions = [
    <Button
      key="unprov-host"
      variant="danger"
      onClick={() => onUnprovisionHost(props.host.fqdn ? props.host.fqdn : "")}
      isDisabled={modalSpinning}
      isLoading={modalSpinning}
      spinnerAriaValueText="Unprovisioning"
      spinnerAriaLabelledBy="Unprovisioning"
      spinnerAriaLabel="Unprovisioning"
    >
      {modalSpinning ? "Unprovisioning" : "Unprovision"}
    </Button>,
    <Button key="cancel" variant="link" onClick={onCloseUnprovisionHostModal}>
      Cancel
    </Button>,
  ];

  const onUnprovisionHost = (host: string) => {
    if (host === "") {
      return;
    }
    setModalSpinning(true);

    executeUnprovisionHost(host).then((result) => {
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
            error || "Error when unprovisioning host",
            "danger"
          );
        } else {
          // alert: success
          alerts.addAlert(
            "unprovision--success",
            "Host successfully unprovisioned",
            "success"
          );
        }
        setModalSpinning(false);
        setIsUnprovisionHostModalOpen(false);
      }
    });
  };

  // [API call] 'Rebuild auto membership'
  const onRebuildAutoMembership = () => {
    // Task can potentially run for a very long time, give feed back that we
    // at least started the task
    alerts.addAlert(
      "rebuild-automember-start",
      "Starting automember rebuild membership task (this may take a long " +
        "time to complete) ...",
      "info"
    );

    executeAutoMemberRebuild([props.host]).then((result) => {
      if ("data" in result) {
        const automemberError = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (automemberError) {
          // alert: error
          let error: string | undefined = "";
          if ("error" in automemberError) {
            error = automemberError.error;
          } else if ("message" in automemberError) {
            error = automemberError.message;
          }

          alerts.addAlert(
            "rebuild-automember-error",
            error || "Error when rebuilding membership",
            "danger"
          );
        } else {
          // alert: success
          alerts.addAlert(
            "rebuild-automember-success",
            "Automember rebuild membership task completed",
            "success"
          );
        }
        // Hide modal
        setIsMembershipModalOpen(!isMembershipModalOpen);
      }
    });
  };

  const membershipModalActions: JSX.Element[] = [
    <Button
      key="rebuild-auto-membership"
      variant="primary"
      onClick={onRebuildAutoMembership}
      form="rebuild-auto-membership-modal"
    >
      OK
    </Button>,
    <Button
      key="cancel-rebuild-auto-membership"
      variant="link"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Cancel
    </Button>,
  ];

  const dropdownItems = [
    <DropdownItem
      key="rebuild auto membership"
      component="button"
      onClick={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
    >
      Rebuild auto membership
    </DropdownItem>,
    <DropdownItem
      key="unprovision"
      onClick={() => setIsUnprovisionHostModalOpen(true)}
      component="button"
      isDisabled={!props.host.has_keytab}
    >
      Unprovision
    </DropdownItem>,
    <DropdownItem
      key="set-one-time-password"
      onClick={() => setIsPasswordModalOpen(true)}
      component="button"
    >
      Set one-time password
    </DropdownItem>,
    <DropdownItem
      key="new certificate"
      component="button"
      onClick={() => setIsCertModalOpen(true)}
    >
      New certificate
    </DropdownItem>,
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
    modifiedValues.fqdn = props.host.fqdn;
    setSaving(true);

    saveHost(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "Host modified", "success");
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
    props.onHostChange(props.originalHost);
    alerts.addAlert("revert-success", "Host data reverted", "success");
  };

  // 'Rebuild auto membership' modal fields: Confirmation question
  const confirmationQuestion = [
    {
      id: "question-text",
      pfComponent: (
        <TextLayout component="p">
          <b>Warning</b> In case of a high number of users, hosts or groups, the
          rebuild task may require high CPU usage. This can severely impact
          server performance. Typically this only needs to be done once after
          importing raw data into the server. Are you sure you want to rebuild
          the auto memberships?
        </TextLayout>
      ),
    },
  ];

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
              <JumpLinksItem key={0} href="#host-settings">
                Host settings
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#enrollment">
                Enrollment
              </JumpLinksItem>
              <JumpLinksItem key={2} href="#host-certificate">
                Host certificate
              </JumpLinksItem>
              <JumpLinksItem key={3} href="#allow-retrieve-keytab">
                Allow to retrieve keytab
              </JumpLinksItem>
              <JumpLinksItem key={4} href="#allow-create-keytab">
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
                id="host-settings"
                text="Host settings"
              />
              <HostSettings
                host={props.host}
                metadata={props.metadata}
                onHostChange={props.onHostChange}
                onRefresh={props.onRefresh}
              />
              <TitleLayout
                key={1}
                headingLevel="h2"
                id="enrollment"
                text="Enrollment"
              />
              <Enrollment host={props.host} />
              <TitleLayout
                key={2}
                headingLevel="h2"
                id="host-certificate"
                text="Host certificate"
              />
              <HostCertificate
                host={props.host}
                metadata={props.metadata}
                onHostChange={props.onHostChange}
                onRefresh={props.onRefresh}
                certData={props.certData}
              />
              <TitleLayout
                key={3}
                headingLevel="h2"
                id="allow-retrieve-keytab"
                text="Allow to retrieve keytab"
              />
              <AllowedRetrieveKeytab
                host={props.host}
                onRefresh={props.onRefresh}
              />
              <TitleLayout
                key={4}
                headingLevel="h2"
                id="allow-create-keytab"
                text="Allow to create keytab"
              />
              <AllowedCreateKeytab
                host={props.host}
                onRefresh={props.onRefresh}
              />
            </Flex>
          </SidebarContent>
        </Sidebar>
        <ModalErrors errors={modalErrors.getAll()} />
        {isMembershipModalOpen && (
          <ModalWithFormLayout
            variantType="medium"
            modalPosition="top"
            offPosition="76px"
            title="Confirmation"
            formId="rebuild-auto-membership-modal"
            fields={confirmationQuestion}
            show={isMembershipModalOpen}
            onClose={() => setIsMembershipModalOpen(!isMembershipModalOpen)}
            actions={membershipModalActions}
          />
        )}
      </PageSection>
      <ToolbarLayout
        isSticky={true}
        className={"pf-v5-u-p-md pf-v5-u-ml-lg pf-v5-u-mr-lg"}
        toolbarItems={toolbarFields}
      />
      <HostSetPassword
        host={props.host.fqdn || ""}
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onRefresh={props.onRefresh}
      />
      <IssueNewCertificate
        isOpen={isCertModalOpen}
        onClose={onCloseCertModal}
        id={props.host.fqdn}
        showPrincipalFields={false}
        onRefresh={props.onRefresh}
        principal={
          props.host.krbprincipalname ? props.host.krbprincipalname[0] : ""
        }
      />
      <ConfirmationModal
        title={"Unprovision host"}
        isOpen={isUnprovisionHostModalOpen}
        onClose={onCloseUnprovisionHostModal}
        actions={unprovisionHostModalActions}
        messageText={"Unprovision/disable this host?"}
        messageObj={props.host.fqdn ? props.host.fqdn : ""}
      />
    </>
  );
};

export default HostsSettings;
